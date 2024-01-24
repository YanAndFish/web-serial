import { create } from 'zustand'
import { useSerialStore } from './serial'
import { createDataTransferStream, reqIdle } from '@/utils/stream'

export interface PortStore {
  port?: SerialPort
  connected: boolean
  writer?: WritableStreamDefaultWriter<string>
  pipeClosed?: Promise<unknown>
  reader?: ReadableStreamDefaultReader<Uint8Array>
}

export const usePortStore = create<PortStore>(() => ({
  port: undefined,
  connected: false,
  writer: undefined,
}))

export async function closePort(port?: SerialPort) {
  try {
    port = port ?? usePortStore.getState().port
    const { writer, pipeClosed, reader } = usePortStore.getState()
    usePortStore.setState({ writer: undefined, pipeClosed: undefined })
    await writer?.close()
    await pipeClosed
    await reader?.cancel()

    await port?.close()
    usePortStore.setState({ connected: false })
  }
  catch (err) {
    if (err instanceof DOMException && err.name === 'InvalidStateError')
      usePortStore.setState({ connected: false })
    else throw err
  }
}

async function openWriteStream() {
  const { port } = usePortStore.getState()

  if (port?.writable) {
    const dataTransfer = createDataTransferStream(() => {
      const state = useSerialStore.getState()
      return { mode: state.sendMode }
    }, useSerialStore.getState().putSendCount)

    const pipeClosed = dataTransfer.readable.pipeTo(port.writable)

    const writer = dataTransfer.writable.getWriter()
    usePortStore.setState({ writer, pipeClosed })
  }
}

export async function openPort() {
  try {
    const port = usePortStore.getState().port
    const { resolveSerialInfo } = useSerialStore.getState()

    if (!port)
      throw new Error('Port is not selected')

    await port.open(resolveSerialInfo())
    usePortStore.setState({ connected: true })

    await openWriteStream()
    createReader(port) // 这里不会使用await，因为createReader会一直运行
    enableAutoSend()
  }
  catch (err) {
    if (err instanceof DOMException && err.name === 'InvalidStateError') {
      usePortStore.setState({ connected: true })
      await openWriteStream()
    }
    else { throw err }
  }
}

export async function togglePort() {
  const { connected } = usePortStore.getState()

  if (connected)
    await closePort()
  else
    await openPort()
}

export async function requestPort() {
  try {
    await closePort()
    const port = await navigator.serial.requestPort()
    port.addEventListener('disconnect', async () => {
      await closePort(port)
      usePortStore.setState({ port: undefined, connected: false })
    })

    usePortStore.setState({ port })
    await openPort()
  }
  catch (err) {
    if (err instanceof DOMException && err.name === 'NotFoundError')
      usePortStore.setState({ connected: false })
    else throw err
  }
}

export async function writeData() {
  const { writer } = usePortStore.getState()
  const data = useSerialStore.getState().sendData
  await writer?.write(JSON.parse(`"${data}"`)) // 让JavaScript把字符串当做表达式计算，使得转义字符生效
}

async function createReader(port: SerialPort) {
  if (!port.readable)
    throw new Error('Port is not readable')

  while (port.readable) {
    if (port.readable.locked)
      break

    const reader = port.readable.getReader()
    usePortStore.setState({ reader })

    const { putReceiveCount } = useSerialStore.getState()

    try {
      while (true) {
        await reqIdle()
        const { value, done } = await reader.read()

        if (done) {
          reader.releaseLock()
          return
        }

        putReceiveCount(value.length)

        const mode = useSerialStore.getState().recvMode

        if (mode === 'text') {
          const decode = new TextDecoder()
          const text = decode.decode(value)
          useSerialStore.getState().putRecvData(text)
        }
        else {
          const hex = Array.from(value).map(v => v.toString(16).padStart(2, '0').toUpperCase()).join(' ')
          useSerialStore.getState().putRecvData(hex)
        }
      }
    }
    catch (err) {
      console.error(err)
      reader.releaseLock()
    }
  }
}

let timer: any

export async function enableAutoSend() {
  const { autoSendInterval, autoSend } = useSerialStore.getState()
  clearInterval(timer)
  if (!autoSend || !usePortStore.getState().connected)
    return

  try {
    await reqIdle()
    await writeData()
    timer = setTimeout(() => {
      enableAutoSend()
    }, autoSendInterval)
  }
  catch (error) {
    console.error(error)
    useSerialStore.setState({ autoSend: false })
  }
}

export async function abortAutoSend() {
  clearInterval(timer)
}
