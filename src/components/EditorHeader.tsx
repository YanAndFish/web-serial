import { upperFirst } from 'lodash-es'
import { useSerialStore } from '@/store/serial'

const monoText = {
  fontFamily: 'CascadiaCode,monospace',
}

export interface EditorHeaderProps extends StyleProps {
  title: React.ReactNode
  action?: React.ReactNode
  countType: 'send' | 'receive'
}

export const EditorHeader: FC<EditorHeaderProps> = ({ title, countType, className, style, action }) => {
  const { count, handleClear } = useSerialStore(s => ({
    count: s[`${countType}Count` as keyof typeof s] as number,
    handleClear: s[`clear${upperFirst(countType)}Count` as keyof typeof s] as () => void,
  }))

  return (
    <Flex className={`items-center ${className}`} gap="2" style={style}>
      <Heading className="grow" size="3">{title}</Heading>
      {action}
      <Button color="violet" size="1" variant="soft" onClick={handleClear}>
        <RText style={monoText}>
          {count}
        </RText>
        <Separator className="mx-1" color="violet" orientation="vertical" size="1" />
        <RText>重置</RText>
      </Button>
    </Flex>
  )
}
