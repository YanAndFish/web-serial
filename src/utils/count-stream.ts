import { encode } from 'iconv-lite'

export function createCountStream(countCallback: (increase: number) => void) {
  return new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      countCallback(chunk.length)
      controller.enqueue(chunk)
    },
  })
}

export interface TransferOption {
  mode: 'text' | 'binary'
  encoding?: string
}

export function createDataTransferStream(configGetter: () => TransferOption) {
  return new TransformStream<string, Uint8Array>({
    transform(chunk, controller) {
      const { mode, encoding } = configGetter()
      if (mode === 'text')
        controller.enqueue(encode(chunk, encoding ?? 'utf-8'))
    },
  })
}
