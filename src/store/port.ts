import { create } from 'zustand'
import { useSerialStore } from './serial'
import { createDataTransferStream, reqIdle } from '@/utils/stream'
import { RecWorker } from '@/utils/rec'

export interface PortStore {
  port?: SerialPort
  connected: boolean
  writer?: WritableStreamDefaultWriter<string>
  pipeClosed?: Promise<unknown>
  reader?: ReadableStreamDefaultReader<Uint8Array>
  rec?: boolean
  setREC(rec: boolean): void
  readonly recWorker: RecWorker
}

export const usePortStore = create<PortStore>(set => ({
  port: undefined,
  connected: false,
  writer: undefined,
  recWorker: new RecWorker(),
  setREC: (rec: boolean) => {
    set({ rec })
  },
}))

export async function closePort(port?: SerialPort, removeFileHandler?: boolean) {
  try {
    port = port ?? usePortStore.getState().port
    const { writer, pipeClosed, reader, recWorker } = usePortStore.getState()
    usePortStore.setState({ writer: undefined, pipeClosed: undefined })
    await writer?.close()
    await pipeClosed
    try {
      await recWorker.cancel(removeFileHandler)
      await reader?.cancel()
    }
    catch (err) {
      if (err instanceof TypeError && err.message.includes('has been released')) {
        // ignore
      }
      else {
        throw err
      }
    }

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

export async function openPort(fileHandler?: FileSystemFileHandle) {
  try {
    const port = usePortStore.getState().port
    const { resolveSerialInfo } = useSerialStore.getState()

    if (!port)
      throw new Error('Port is not selected')

    await port.open(resolveSerialInfo())
    usePortStore.setState({ connected: true })

    await openWriteStream()
    createReader(port, fileHandler) // 这里不会使用await，因为createReader会一直运行
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

export async function requestPort(fileHandler?: FileSystemFileHandle) {
  try {
    await closePort()
    const port = await navigator.serial.requestPort()
    port.addEventListener('disconnect', async () => {
      await closePort(port)
      usePortStore.setState({ port: undefined, connected: false })
    })

    usePortStore.setState({ port })
    await openPort(fileHandler)
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

async function createReader(port: SerialPort, fileHandler?: FileSystemFileHandle) {
  if (!port.readable)
    throw new Error('Port is not readable')

  while (port.readable) {
    if (port.readable.locked)
      break

    const { putReceiveCount } = useSerialStore.getState()
    const { recWorker, rec } = usePortStore.getState()
    let stream = port.readable

    if (rec) {
      const [_stream, recStream] = stream.tee()
      stream = _stream
      await recWorker.startRec(recStream, fileHandler)
    }

    const reader = stream.getReader()
    usePortStore.setState({ reader })

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

export function requestFileHandler() {
  return showSaveFilePicker({
    suggestedName: `serial-${Date.now()}.serial`,
    types: [
      {
        description: 'Serial REC data',
        accept: {
          'text/plain': ['.serial'],
        },
      },
    ],
  })
}

export async function startRec() {
  try {
    usePortStore.setState({ rec: true })
    const { port } = usePortStore.getState()
    const fileHandler = await requestFileHandler()

    if (port) {
      await closePort()
      await openPort(fileHandler)
    }
    else {
      await requestPort(fileHandler)
    }
  }
  catch (err) {
    usePortStore.setState({ rec: false })
    if (err instanceof DOMException && err.name === 'AbortError') {
      //
    }
    else { throw err }
  }
}

export async function stopRec() {
  usePortStore.setState({ rec: false })
  await closePort(undefined, true)
}
