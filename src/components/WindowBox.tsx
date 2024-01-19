import { Cross1Icon } from '@radix-ui/react-icons'

export interface WindowBoxProps {
  width?: string | number
  height?: string | number
  title?: string
  children?: React.ReactNode
  onClose?: () => void
}

export const WindowBox: FC<WindowBoxProps> = ({ width = 'auto', height = 'auto', title, children, onClose }) => {
  return (
    <Card style={{ width, height }} className="backdrop-blur-md backdrop-brightness-130">
      <Flex direction="column" className="w-full h-full">
        <Inset clip="padding-box" side="top" pb="current" className="bg-white/5 px-4 pt-4 mb-3 shrink-0">
          <Flex align="center" justify="start">
            <Heading className="grow">{title || ''}</Heading>
            {!!onClose && <Button onClick={onClose} variant="soft" color="crimson"><Cross1Icon width="16" height="16" /></Button>}
          </Flex>
        </Inset>
        <div className="w-full grow">{children}</div>
      </Flex>
    </Card>
  )
}
