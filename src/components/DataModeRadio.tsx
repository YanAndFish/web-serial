export interface DataModeRadioProps {
  value?: 'text' | 'binary'
  onValueChange?: (value: 'text' | 'binary') => void
}

export const DataModeRadio: React.FC<DataModeRadioProps> = ({ value, onValueChange }) => {
  return (
    <RadioGroup.Root className="flex" value={value} onValueChange={onValueChange}>
      <RText as="label" size="2">
        <Flex gap="2">
          <RadioGroup.Item value="text" />
          {' '}
          文本
        </Flex>
      </RText>
      <RText as="label" className="ml-3" size="2">
        <Flex gap="2">
          <RadioGroup.Item value="binary" />
          {' '}
          Hex
        </Flex>
      </RText>

    </RadioGroup.Root>
  )
}
