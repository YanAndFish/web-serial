import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import MonacoEditor from '@monaco-editor/react'

export interface EditorProps extends Props {
  readonly?: boolean
}

export const Editor: FC<EditorProps> = ({ className, style, children, readonly }) => {
  const editor = useRef<monaco.editor.IStandaloneCodeEditor>()

  function handleEditorDidMount(_editor: monaco.editor.IStandaloneCodeEditor) {
    editor.current = _editor
    _editor.layout({ width: 110, height: 120 })
  }

  return (
    <Card className={className} style={style}>
      <Inset className="relative h-300px" p="0">
        <MonacoEditor
          className="absolute inset-0"
          theme="vs-dark"
          options={{
            wordWrap: 'on',
            minimap: { enabled: false },
            cursorBlinking: 'smooth',
            tabSize: 2,
            readOnly: readonly,
          }}
          onMount={handleEditorDidMount}
        />
      </Inset>
      {!!children && <Inset pt="current" side="bottom">{children}</Inset>}
    </Card>

  )
}
