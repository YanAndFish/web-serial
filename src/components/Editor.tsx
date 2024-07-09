import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import MonacoEditor from '@monaco-editor/react'
import { Range } from 'monaco-editor'
import { resolvePromise } from '@/utils/promise'

export interface EditorProps extends Props {
  readonly?: boolean
  value?: string
  onValueChange?: (value: string | undefined) => void
  autoScollOnBottom?: boolean
  scrollBeyondLastLine?: boolean
  language?: string
}

export interface EditorInstance {
  putContent: (content: string) => Promise<void>
  clearContent: () => Promise<void>
  setContnet: (content: string) => Promise<void>
}

export const Editor = forwardRef<EditorInstance, EditorProps>(({ className, style, readonly, children, value, onValueChange, autoScollOnBottom, scrollBeyondLastLine, language }, ref) => {
  const editor = useRef<monaco.editor.IStandaloneCodeEditor>()
  const autoScroll = useRef<boolean>(true)
  const ready = useRef(resolvePromise<void>())

  function handleEditorDidMount(_editor: monaco.editor.IStandaloneCodeEditor) {
    editor.current = _editor
    _editor.onDidScrollChange((e) => {
      if (!e.scrollTopChanged)
        return

      autoScroll.current = e.scrollHeight === e.scrollTop + (_editor.getDomNode()?.clientHeight ?? 0)
    })

    // resolve ready promise
    ready.current[1]()
  }

  useEffect(() => {
    if (!editor.current)
      return

    if (autoScollOnBottom && readonly && autoScroll.current)
      editor.current.revealLine(editor.current.getModel()?.getLineCount() ?? 0)
  }, [value])

  useImperativeHandle(ref, () => ({
    setContnet: async (content: string) => {
      await ready.current[0]
      if (!editor.current)
        return

      const model = editor.current.getModel()

      if (!model)
        return

      model.setValue(content)
    },
    putContent: async (content: string) => {
      await ready.current[0]
      if (!editor.current)
        return

      const model = editor.current.getModel()

      if (!model)
        return

      const endPosition = model.getFullModelRange().getEndPosition()
      // 插入内容到当前内容最后
      model.pushEditOperations([], [{
        range: new Range(endPosition.lineNumber, endPosition.column, endPosition.lineNumber, endPosition.column),
        text: content,
        forceMoveMarkers: true,
      }], () => null)
    },
    clearContent: async () => {
      await ready.current[0]

      if (!editor.current)
        return

      const model = editor.current.getModel()

      if (!model)
        return

      model.setValue('')
    },
  }), [])

  return (
    <Card className={className} style={style}>
      <Inset className="relative" p="0" side="top" style={{ height: 'calc(100% - 32px)' }}>
        <MonacoEditor
          className="absolute inset-0"
          language={language}
          theme="vs-dark"
          value={value}
          options={{
            wordWrap: 'on',
            minimap: { enabled: false },
            cursorBlinking: 'smooth',
            tabSize: 2,
            readOnly: readonly,
            scrollBeyondLastLine,
            fontFamily: 'CascadiaCode,var(--default-font-family)',
          }}
          onChange={onValueChange}
          onMount={handleEditorDidMount}
        />
      </Inset>
      <Inset className="relative bg-$accent-a2 h-54px flex" p="0" side="bottom">
        <Flex className="px-3 pt-3 w-full">
          {children}
        </Flex>
      </Inset>
    </Card>
  )
})
