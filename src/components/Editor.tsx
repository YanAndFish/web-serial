import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import MonacoEditor from '@monaco-editor/react'

export interface EditorProps extends StyleProps {
  readonly?: boolean
}

export const Editor: FC<EditorProps> = ({ className, style, readonly }) => {
  const editor = useRef<monaco.editor.IStandaloneCodeEditor>()

  function handleEditorDidMount(_editor: monaco.editor.IStandaloneCodeEditor) {
    editor.current = _editor
  }

  return (
    <Card className={className} style={style}>
      <Inset className="relative h-full" p="0">
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
    </Card>
  )
}
