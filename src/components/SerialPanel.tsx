import type { ChangeEvent } from 'react'
import { SerialSelect } from './SerialSelect'
import { Editor } from './Editor'
import { BaudRateSelect } from './BaudRateSelect'
import { Field } from './Field'
import { DataBitsSelect } from './DataBitsSelect'
import { StopBitsSelect } from './StopBitsSelect'
import { ParityTypeSelect } from './ParityTypeSelect'
import { EditorHeader } from './EditorHeader'
import { DataModeRadio } from './DataModeRadio'
import { useSerialStore } from '@/store/serial'
import { usePortStore, writeData } from '@/store/port'

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

  const { connected } = usePortStore()

  const { sendData, setSendData } = useSerialStore(s => ({ sendData: s.sendData, setSendData: s.setSendData }))
  const { recvData, clearRecvData } = useSerialStore(s => ({ recvData: s.recvData, clearRecvData: s.clearRecvData }))

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && connected && e.metaKey)
        writeData()
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [connected])

  const handleUpdateAutoSendInterval = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setAutoSendInterval(+e.currentTarget.value)
  }, [])

  return (
    <Flex className="w-full h-full">
      <Inset className="w-250px bg-$accent-a2 rounded-0!" p="current" side="left">
        <ScrollArea scrollbars="vertical" type="hover">
          <Card>
            <Heading size="4">串口设置</Heading>
            <Field>
              <SerialSelect />
            </Field>
            <Field label="波特率">
              <BaudRateSelect className="w-110px" disabled={connected} value={baudRate} onValueChange={setBaudRate} />
            </Field>
            <Field label="校验位">
              <ParityTypeSelect className="w-110px" disabled={connected} value={parity} onValueChange={setParity} />
            </Field>
            <Field label="停止位">
              <StopBitsSelect className="w-110px" disabled={connected} value={stopBits} onValueChange={setStopBits} />
            </Field>
            <Field label="数据位">
              <DataBitsSelect className="w-110px" disabled={connected} value={dataBits} onValueChange={setDataBits} />
            </Field>
          </Card>
          <Card className="mt-3">
            <Heading size="4">接收设置</Heading>
            <Field label="接收格式">
              <DataModeRadio value={recvMode} onValueChange={setRecvMode} />
            </Field>
          </Card>
          <Card className="mt-3">
            <Heading size="4">发送设置</Heading>
            <Field label="发送格式">
              <DataModeRadio value={sendMode} onValueChange={setSendMode} />
            </Field>
            <Field label="定时发送" />
            <Flex align="center">
              <Checkbox checked={autoSend} className="mr-2" size="3" onCheckedChange={setAutoSend} />
              <TextField.Input min={0} size="1" type="number" value={autoSendInterval} onChange={handleUpdateAutoSendInterval} />
              <RText className="ml-2" size="2">毫秒</RText>
            </Flex>
          </Card>
        </ScrollArea>
      </Inset>
      <Flex className="h-full h-full grow pl-3" direction="column">
        <EditorHeader className="mb-2 " countType="receive" title="数据接收" />
        <Editor
          autoScollOnBottom
          readonly
          className="grow-2"
          language={`serial-${recvMode}`}
          scrollBeyondLastLine={false}
          value={recvData}
        >
          <div className="grow" />
          <Button variant="soft" onClick={clearRecvData}>清空</Button>
        </Editor>
        <EditorHeader className="mt-3" countType="send" title="数据发送" />
        <Editor
          className="mt-3 grow"
          language={`serial-${sendMode}`}
          value={sendData}
          onValueChange={setSendData}
        >
          <Button disabled={!connected} onClick={writeData}>发送 Meta + Enter</Button>
          <div className="grow" />
          <Button variant="soft" onClick={() => setSendData('')}>清空</Button>
        </Editor>
      </Flex>
    </Flex>
  )
}
