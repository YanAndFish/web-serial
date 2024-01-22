import { create } from 'zustand'
import { useSerialStore } from './serial'
import { createCountStream } from '@/utils/count-stream'

export interface PortStore {
  port?: SerialPort
  connected: boolean
  encodeStream?: TransformStream<string, Uint8Array>
}

export const usePortStore = create<PortStore>(() => ({
  port: undefined,
  connected: false,
  writer: undefined,
}))

export async function closePort(port?: SerialPort) {
  try {
    port = port ?? usePortStore.getState().port

    await port?.close()
    usePortStore.setState({ connected: false })
  }
  catch (err) {
    if (err instanceof DOMException && err.name === 'InvalidStateError')
      usePortStore.setState({ connected: false })
    else throw err
  }
}

async function openWriteStream(type: 'text' | 'hex') {
  const { port } = usePortStore.getState()

  if (port?.writable) {
    const encoder = new TextEncoderStream()
    const countStream = createCountStream(useSerialStore.getState().putSendCount)

    encoder.readable.pipeTo(countStream.writable)
    countStream.readable.pipeTo(port.writable)

    usePortStore.setState({ encodeStream: encoder })
  }
}

export async function openPort() {
  try {
    const port = usePortStore.getState().port
    const { resolveSerialInfo } = useSerialStore.getState()
    await port?.open(resolveSerialInfo())
    usePortStore.setState({ connected: true })

    await openWriteStream('text')
  }
  catch (err) {
    if (err instanceof DOMException && err.name === 'InvalidStateError') {
      usePortStore.setState({ connected: true })
      await openWriteStream('text')
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
  const { encodeStream } = usePortStore.getState()
  const data = useSerialStore.getState().sendData

  // await encodeStream?.writable.getWriter()
}
