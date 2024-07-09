export interface DataModeRadioProps {
  value?: 'text' | 'binary'
  onValueChange?: (value: 'text' | 'binary') => void
}

export const DataModeRadio: React.FC<DataModeRadioProps> = ({ value, onValueChange }) => {
  return (
    <RadioGroup.Root size="1" className="flex flex-row" value={value} onValueChange={onValueChange}>
      <RadioGroup.Item value="text">文本</RadioGroup.Item>
      <RadioGroup.Item value="binary">Hex</RadioGroup.Item>
    </RadioGroup.Root>
  )
}
