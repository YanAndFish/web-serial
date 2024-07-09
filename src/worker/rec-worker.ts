import * as comlink from 'comlink'
import type { RecWorkerInterface } from '../utils/rec'

let readerStream: ReadableStream<Uint8Array> | undefined
let fileHandler: FileSystemFileHandle | undefined
let pipeClosed: Promise<void> | undefined
let fileStream: FileSystemWritableFileStream | undefined
let abortSignal: AbortController | undefined

function createTimeTransform() {
  return new TransformStream<Uint8Array, [Uint8Array, number]>({
    transform(chunk, controller) {
      controller.enqueue([chunk, Date.now()])
    },
  })
}

function createFileSerializerTransform() {
  return new TransformStream<[Uint8Array, number], string>({
    transform([chunk, time], controller) {
      controller.enqueue(`${time} | ${[...chunk].map(e => e.toString(16).padStart(2, '0')).join(' ')}\n`)
    },
  })
}

async function runRec() {
  try {
    if (!readerStream || !fileHandler)
      throw new Error('Invalid stream or file handler')

    const timeTransform = createTimeTransform()
    const fileSerializerTransform = createFileSerializerTransform()

    fileStream = await fileHandler.createWritable()

    abortSignal = new AbortController()

    pipeClosed = readerStream
      .pipeThrough(timeTransform, { signal: abortSignal.signal })
      .pipeThrough(fileSerializerTransform)
      .pipeTo(fileStream, { preventAbort: true })
      .catch(() => {})
  }
  catch (err) {
    return Promise.reject(err)
  }
}

comlink.expose({
  startRec: async (stream, handler) => {
    try {
      readerStream = stream
      fileHandler = handler ?? fileHandler
      await runRec()
    }
    catch (err) {
      return Promise.reject(err)
    }
  },
  stopRec: async () => {
    try {
      abortSignal?.abort()
      await pipeClosed
      await readerStream?.cancel()
      await fileStream?.close()
    }
    catch (err) {
      return Promise.reject(err)
    }
    finally {
      readerStream = undefined
      pipeClosed = undefined
      fileStream = undefined
      abortSignal = undefined
    }
  },
  removeFileHandler: async () => {
    if (fileStream?.locked)
      return Promise.reject(new Error('file handler is used'))

    fileHandler = undefined
    fileStream = undefined
  },
  replayData: async (file) => {

  },
  abortReplay: async () => {

  },
} satisfies RecWorkerInterface)
