import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import MonacoEditor from '@monaco-editor/react'

export interface EditorProps extends Props {
  readonly?: boolean
}

export const Editor: FC<EditorProps> = ({ className, style, readonly, children }) => {
  const editor = useRef<monaco.editor.IStandaloneCodeEditor>()

  function handleEditorDidMount(_editor: monaco.editor.IStandaloneCodeEditor) {
    editor.current = _editor
  }

  return (
    <Card className={className} style={style}>
      <Inset className="relative" p="0" side="top" style={{ height: 'calc(100% - 20px)' }}>
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
      <Inset className="relative h-full bg-$accent-a2 flex" p="0" side="bottom">
        {children}
      </Inset>
    </Card>
  )
}
