import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import MonacoEditor from '@monaco-editor/react'

export interface EditorProps extends Props {
  readonly?: boolean
  value?: string
  onValueChange?: (value: string | undefined) => void
  autoScollOnBottom?: boolean
  scrollBeyondLastLine?: boolean
  language?: string
}

export const Editor: FC<EditorProps> = ({ className, style, readonly, children, value, onValueChange, autoScollOnBottom, scrollBeyondLastLine, language }) => {
  const editor = useRef<monaco.editor.IStandaloneCodeEditor>()
  const autoScroll = useRef<boolean>(true)

  function handleEditorDidMount(_editor: monaco.editor.IStandaloneCodeEditor) {
    editor.current = _editor
    _editor.onDidScrollChange((e) => {
      if (!e.scrollTopChanged)
        return

      autoScroll.current = e.scrollHeight === e.scrollTop + (_editor.getDomNode()?.clientHeight ?? 0)
    })
  }

  useEffect(() => {
    if (!editor.current)
      return

    if (autoScollOnBottom && readonly && autoScroll.current)
      editor.current.revealLine(editor.current.getModel()?.getLineCount() ?? 0)
  }, [value])

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
}
