export function createCountStream(countCallback: (increase: number) => void) {
  return new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      countCallback(chunk.length)
      controller.enqueue(chunk)
    },
  })
}
