import { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import { debounce } from 'lodash-es'

(globalThis as any).MonacoEnvironment = {
  getWorker(_: any, _label: string) {
    return new EditorWorker()
  },
}

monaco.languages.register({ id: 'serial-binary' })
monaco.languages.register({ id: 'serial-text' })
monaco.languages.setMonarchTokensProvider('serial-text', {
  tokenizer: {
    root: [
      [/.+/, 'string'],
    ],
  },
})
monaco.languages.setMonarchTokensProvider('serial-binary', {
  tokenizer: {
    root: [
      [/.+/, 'number'],
    ],
  },
})

const handleValidSerialBinary = debounce((model: monaco.editor.ITextModel) => {
  if (model.getLanguageId() !== 'serial-binary')
    return
  // 查找0-9a-fA-F以外的字符，设置错误提示
  const regex = /[^0-9a-fA-F\s]+/g
  const match = model.findMatches(regex.source, true, true, false, null, false)

  if (match) {
    monaco.editor.setModelMarkers(model, 'error', match.map(m => ({
      ...m.range,
      message: '不是有效的十六进制字符',
      severity: monaco.MarkerSeverity.Error,
    })))
  }
  else {
    monaco.editor.setModelMarkers(model, 'error', [])
  }
}, 200)

monaco.editor.onDidCreateModel((model) => {
  model.onDidChangeContent(() => {
    handleValidSerialBinary(model)
  })
  handleValidSerialBinary(model)
})

monaco.editor.onDidChangeModelLanguage(({ model }) => {
  monaco.editor.removeAllMarkers('error')
  handleValidSerialBinary(model)
})

loader.config({ monaco })
loader.init()
