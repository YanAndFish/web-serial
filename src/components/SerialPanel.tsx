import type { ChangeEvent } from 'react'

import { SerialSelect } from './SerialSelect'
import type { EditorInstance } from './Editor'
import { Editor } from './Editor'
import { BaudRateSelect } from './BaudRateSelect'
import { Field } from './Field'
import { DataBitsSelect } from './DataBitsSelect'
import { StopBitsSelect } from './StopBitsSelect'
import { ParityTypeSelect } from './ParityTypeSelect'
import { EditorHeader } from './EditorHeader'
import { DataModeRadio } from './DataModeRadio'
import { RecButton } from './RecButton'
import { ReplayButton } from './ReplayButton'
import { useSerialStore } from '@/store/serial'
import { usePortStore, writeData } from '@/store/port'
import { reqIdle } from '@/utils/stream'

export interface SerialPanelProps {
}

export const SerialPanel: FC<SerialPanelProps> = () => {
  const {
    baudRate, setBaudRate,
    parity, setParity,
    stopBits, setStopBits,
    dataBits, setDataBits,
    sendMode, setSendMode,
    recvMode, setRecvMode,
    autoSend, setAutoSend,
    autoSendInterval, setAutoSendInterval,
  } = useSerialStore()

  const { connected, replaying } = usePortStore()
  const { sendData, setSendData } = useSerialStore(s => ({ sendData: s.sendData, setSendData: s.setSendData }))
  const { recvData, clearRecvData } = useSerialStore(s => ({ recvData: s.recvData, clearRecvData: s.clearRecvData }))
  const setRecvHook = useSerialStore(s => s.setRecvHook)

  const recvEditorRef = useRef<EditorInstance>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && connected && e.metaKey)
        writeData()
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [connected])

  useEffect(() => {
    if (recvEditorRef.current && recvData)
      recvEditorRef.current.setContnet(recvData)
  }, [recvEditorRef])

  useEffect(() => {
    return setRecvHook((recvData) => {
      recvEditorRef.current?.putContent(recvData)
    })
  }, [setRecvHook, recvEditorRef])

  const handleUpdateAutoSendInterval = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setAutoSendInterval(+e.currentTarget.value)
  }, [])

  const handleClearRecv = useCallback(() => {
    clearRecvData()
    recvEditorRef.current?.clearContent()
  }, [clearRecvData, recvEditorRef])

  return (
    <Flex className="w-full h-full">
      <Inset className="w-250px bg-$accent-a2 rounded-0!" p="current" side="left">
        <ScrollArea scrollbars="vertical" type="hover">
          <Card>
            <Heading size="3">串口设置</Heading>
            <Field>
              <SerialSelect />
            </Field>
            <Field label="波特率" text={{ size: '2' }}>
              <BaudRateSelect className="w-140px" disabled={connected} value={baudRate} onValueChange={setBaudRate} />
            </Field>
            <Field label="校验位" text={{ size: '2' }}>
              <ParityTypeSelect className="w-140px" disabled={connected} value={parity} onValueChange={setParity} />
            </Field>
            <Field label="停止位" text={{ size: '2' }}>
              <StopBitsSelect className="w-140px" disabled={connected} value={stopBits} onValueChange={setStopBits} />
            </Field>
            <Field label="数据位" text={{ size: '2' }}>
              <DataBitsSelect className="w-140px" disabled={connected} value={dataBits} onValueChange={setDataBits} />
            </Field>
          </Card>
          <Card className="mt-3">
            <Heading size="3">接收设置</Heading>
            <Field label="接收格式" text={{ size: '2' }}>
              <DataModeRadio value={recvMode} onValueChange={setRecvMode} />
            </Field>
          </Card>
          <Card className="mt-3">
            <Heading size="3">发送设置</Heading>
            <Field label="发送格式" text={{ size: '2' }}>
              <DataModeRadio value={sendMode} onValueChange={setSendMode} />
            </Field>
            <Field label="定时发送" text={{ size: '2' }} />
            <Flex align="center">
              <Checkbox checked={autoSend} className="mr-2" size="3" onCheckedChange={setAutoSend} />
              <TextField.Root
                min={0}
                size="1"
                type="number"
                value={autoSendInterval}
                onChange={handleUpdateAutoSendInterval}
              />
              <RText className="ml-2" size="2">
                毫秒
              </RText>
            </Flex>
          </Card>
        </ScrollArea>
      </Inset>
      <Flex className="h-full h-full grow pl-3" direction="column">
        <EditorHeader
          action={<RecButton />}
          className="mb-2"
          countType="receive"
          title="数据接收"
        />
        <Editor
          autoScollOnBottom
          readonly
          className="grow-2"
          language={`serial-${recvMode}`}
          scrollBeyondLastLine={false}
          ref={recvEditorRef}
        >
          <div className="grow" />
          <Button variant="soft" onClick={handleClearRecv}>
            清空
          </Button>
        </Editor>
        <EditorHeader
          className="mt-3"
          countType="send"
          title="数据发送"
          action={<ReplayButton />}
        />
        <Editor className="mt-3 grow" language={`serial-${sendMode}`} value={sendData} onValueChange={setSendData}>
          <Button disabled={!connected || replaying} onClick={writeData}>
            发送 Meta + Enter
          </Button>
          <div className="grow" />
          <Button variant="soft" onClick={() => setSendData('')}>
            清空
          </Button>
        </Editor>
      </Flex>
    </Flex>
  )
}
