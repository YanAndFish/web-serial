import { encode } from 'iconv-lite'

export interface TransferOption {
  mode: 'text' | 'binary'
  encoding?: string
}

export function createDataTransferStream(configGetter: () => TransferOption, countCallback: (increase: number) => void) {
  return new TransformStream<string, Uint8Array>({
    transform(chunk, controller) {
      const { mode, encoding } = configGetter()
      if (mode === 'text') {
        const buf = encode(chunk, encoding ?? 'utf-8')
        countCallback(buf.length)
        controller.enqueue(buf)
      }
      else {
        // todo: binary mode
        countCallback(1)
        controller.enqueue(new Uint8Array([1]))
      }
    },
  })
}
