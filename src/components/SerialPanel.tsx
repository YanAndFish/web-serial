import { SerialSelect } from './SerialSelect'
import { Editor } from './Editor'
import { BaudRateSelect } from './BaudRateSelect'
import { Field } from './Field'
import { DataBitsSelect } from './DataBitsSelect'
import { StopBitsSelect } from './StopBitsSelect'
import { ParityTypeSelect } from './ParityTypeSelect'
import { useSerialStore } from '@/store/serial'

export interface SerialPanelProps {
}

export const SerialPanel: FC<SerialPanelProps> = () => {
  const { baudRate, setBaudRate, parity, setParity, stopBits, setStopBits, dataBits, setDataBits } = useSerialStore()
  return (
    <Flex className="w-full h-full">
      <Inset side="left" className="w-250px bg-$accent-a2" p="current">
        <ScrollArea type="hover" scrollbars="vertical">
          <Card>
            <Heading size="4">串口设置</Heading>
            <Field>
              <SerialSelect />
            </Field>
            <Field label="波特率">
              <BaudRateSelect className="w-110px" value={baudRate} onValueChange={setBaudRate} />
            </Field>
            <Field label="校验位">
              <ParityTypeSelect className="w-110px" value={parity} onValueChange={setParity} />
            </Field>
            <Field label="停止位">
              <StopBitsSelect className="w-110px" value={stopBits} onValueChange={setStopBits} />
            </Field>
            <Field label="数据位">
              <DataBitsSelect className="w-110px" value={dataBits} onValueChange={setDataBits} />
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
        <Editor readonly className="grow-2" />
        <Editor className="mt-3 grow" />
      </Flex>
    </Flex>
  )
}
