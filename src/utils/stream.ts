export interface TransferOption {
  mode: 'text' | 'binary'
}

export async function reqIdle(timeout?: number) {
  return new Promise(resolve => requestIdleCallback(resolve, { timeout }))
}

function encodeHexString(hexStr: string): Uint8Array {
  try {
    return Uint8Array.from((hexStr.split(/\s+/).filter(e => e.length).map((hex) => {
      const num = Number.parseInt(hex, 16)
      if (Number.isNaN(num))
        throw new Error('Invalid hex string')
      return num
    })))
  }
  catch (err) {
    console.error(err)
    return Uint8Array.from([])
  }
}

export function createDataTransferStream(configGetter: () => TransferOption, countCallback: (increase: number) => void) {
  return new TransformStream<string, Uint8Array>({
    transform(chunk, controller) {
      const { mode } = configGetter()

      let buf: Uint8Array
      if (mode === 'text') {
        const encode = new TextEncoder()
        buf = encode.encode(chunk)
      }
      else {
        buf = encodeHexString(chunk)
      }

      countCallback(buf.length)
      controller.enqueue(buf)
    },
  })
}

export class SerialDataTransferStream extends TransformStream<string, [number, number[]]> {
  #lastTime: number | undefined

  constructor() {
    super({
      transform: (chunk, controller) => {
        const [time, data] = chunk.split('|')

        const offset = Number(time) - (this.#lastTime ?? Number(time))
        this.#lastTime = Number(time)

        if (data)
          controller.enqueue([offset, data.split(/\s+/).filter(Boolean).map(e => Number.parseInt(e, 16))])
      },
    })
  }
}

export function createArrayReaderableStream<T>(array: T[]): ReadableStream<T> {
  return new ReadableStream<T>({
    start(controller) {
      array.forEach(controller.enqueue.bind(controller))
      controller.close()
    },
  })
}
