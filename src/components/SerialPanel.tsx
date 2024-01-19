import { SerialSelect } from './SerialSelect'

export interface SerialPanelProps {
}

export const SerialPanel: FC<SerialPanelProps> = () => {
  return (
    <Flex className="w-full h-full">
      <Card className="h-full w-300px">
        <SerialSelect />
      </Card>
    </Flex>
  )
}
