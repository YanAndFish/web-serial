import { type Remote, transfer, wrap as wrapWorker } from 'comlink'
import _RecWorker from '@/worker/rec-worker?worker'

export interface RecWorkerInterface {
  startRec(serialReadStream: ReadableStream<Uint8Array>, fileHandler: FileSystemFileHandle): Promise<void>
  cancel(): Promise<void>
}

export class RecWorker {
  #worker: Remote<RecWorkerInterface>

  constructor() {
    this.#worker = wrapWorker<RecWorkerInterface>(new _RecWorker())
  }

  cancel() {
    return this.#worker.cancel()
  }

  async startRec(stream: ReadableStream<Uint8Array>, fileHandler: FileSystemFileHandle) {
    await this.#worker.startRec(transfer(stream, [stream]), fileHandler)
  }
}

export function isRecSupport() {
  return 'showSaveFilePicker' in window
}
