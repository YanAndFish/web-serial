import { upperFirst } from 'lodash-es'
import { useSerialStore } from '@/store/serial'

export interface EditorHeaderProps extends StyleProps {
  title: string
  countType: 'send' | 'receive'
}

export const EditorHeader: FC<EditorHeaderProps> = ({ title, countType, className, style }) => {
  const { count, handleClear } = useSerialStore(s => ({
    count: s[`${countType}Count` as keyof typeof s] as number,
    handleClear: s[`clear${upperFirst(countType)}Count` as keyof typeof s] as () => void,
  }))

  return (
    <Flex className={`items-center ${className}`} style={style}>
      <Heading className="grow" size="3">{title}</Heading>
      <Button color="violet" size="1" variant="soft" onClick={handleClear}>
        <RText>{count}</RText>
        <Separator className="mx-1" color="violet" orientation="vertical" size="1" />
        <RText>清除</RText>
      </Button>
    </Flex>
  )
}
