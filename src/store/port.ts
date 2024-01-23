import { create } from 'zustand'
import { useSerialStore } from './serial'
import { createDataTransferStream } from '@/utils/stream'

export interface PortStore {
  port?: SerialPort
  connected: boolean
  writer?: WritableStreamDefaultWriter<string>
  pipeClosed?: Promise<unknown>
}

export const usePortStore = create<PortStore>(() => ({
  port: undefined,
  connected: false,
  writer: undefined,
}))

export async function closePort(port?: SerialPort) {
  try {
    port = port ?? usePortStore.getState().port
    const { writer, pipeClosed } = usePortStore.getState()
    usePortStore.setState({ writer: undefined, pipeClosed: undefined })
    await writer?.close()
    await pipeClosed

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
      return { mode: state.sendMode, encoding: 'utf-8' }
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
    await port?.open(resolveSerialInfo())
    usePortStore.setState({ connected: true })

    await openWriteStream()
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
  await writer?.write(data)
}
