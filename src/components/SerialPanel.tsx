import { SerialSelect } from './SerialSelect'
import { Editor } from './Editor'

export interface SerialPanelProps {
}

export const SerialPanel: FC<SerialPanelProps> = () => {
  return (
    <Flex className="w-full h-full ">
      <Card className="h-full w-250px shrink-0">
        <SerialSelect />

      </Card>
      <Flex className="h-full grow pl-3" direction="column">
        <Editor readonly />
        <Editor className="mt-3" />
      </Flex>
    </Flex>
  )
}
