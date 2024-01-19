import { loader } from '@monaco-editor/react'

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'

(globalThis as any).MonacoEnvironment = {
  getWorker(_: any, label: string) {
    if (label === 'json')
      return new JsonWorker()

    return new EditorWorker()
  },
}

loader.config({ monaco })
loader.init()
