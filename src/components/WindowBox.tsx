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
    <Card className="backdrop-blur-md backdrop-brightness-130" style={{ width, height }}>
      <Flex className="w-full h-full" direction="column">
        <Inset className="bg-white/5 px-4 pt-4 mb-3 shrink-0" clip="padding-box" pb="current" side="top">
          <Flex align="center" justify="start">
            <Heading className="grow">{title || ''}</Heading>
            {!!onClose && <Button color="crimson" variant="soft" onClick={onClose}><Cross1Icon height="16" width="16" /></Button>}
          </Flex>
        </Inset>
        <Inset className="grow overflow-hidden" p="current">{children}</Inset>
      </Flex>
    </Card>
  )
}
