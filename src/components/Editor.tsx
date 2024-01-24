import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import MonacoEditor from '@monaco-editor/react'

export interface EditorProps extends Props {
  readonly?: boolean
  value?: string
  onValueChange?: (value: string | undefined) => void
}

export const Editor: FC<EditorProps> = ({ className, style, readonly, children, value, onValueChange }) => {
  const editor = useRef<monaco.editor.IStandaloneCodeEditor>()

  function handleEditorDidMount(_editor: monaco.editor.IStandaloneCodeEditor) {
    editor.current = _editor
  }

  return (
    <Card className={className} style={style}>
      <Inset className="relative" p="0" side="top" style={{ height: 'calc(100% - 32px)' }}>
        <MonacoEditor
          className="absolute inset-0"
          theme="vs-dark"
          value={value}
          options={{
            wordWrap: 'on',
            minimap: { enabled: false },
            cursorBlinking: 'smooth',
            tabSize: 2,
            readOnly: readonly,
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
