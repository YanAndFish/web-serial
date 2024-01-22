import { SerialSelect } from './SerialSelect'
import { Editor } from './Editor'
import { BaudRateSelect } from './BaudRateSelect'
import { Field } from './Field'
import { DataBitsSelect } from './DataBitsSelect'
import { StopBitsSelect } from './StopBitsSelect'
import { ParityTypeSelect } from './ParityTypeSelect'
import { EditorHeader } from './EditorHeader'
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
  } = useSerialStore()

  const { connected } = usePortStore()

  const { sendData, setSendData } = useSerialStore(s => ({ sendData: s.sendData, setSendData: s.setSendData }))

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && connected)
        writeData()
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [connected])

  return (
    <Flex className="w-full h-full">
      <Inset className="w-250px bg-$accent-a2" p="current" side="left">
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
          </Card>
          <Card className="mt-3">
            <Heading size="4">发送设置</Heading>
          </Card>
        </ScrollArea>
      </Inset>
      <Flex className="h-full h-full grow pl-3" direction="column">
        <EditorHeader className="mb-2 " countType="receive" title="数据接收" />
        <Editor readonly className="grow-2" />
        <EditorHeader className="mt-3" countType="send" title="数据发送" />
        <Editor className="mt-3 grow" value={sendData} onValueChange={setSendData}>
          <Button disabled={!connected} onClick={writeData}>发送 Enter</Button>
        </Editor>
      </Flex>
    </Flex>
  )
}
