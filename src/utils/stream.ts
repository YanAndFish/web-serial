export interface TransferOption {
  mode: 'text' | 'binary'
}

function encodeHexString(hexStr: string): Uint8Array {
  try {
    return Uint8Array.from((hexStr.split(' ').map(hex => Number.parseInt(hex, 16))))
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
