const parity: ParityType[] = ['none', 'even', 'odd']
const parityLabel: Record<ParityType, string> = {
  none: '无',
  even: '偶',
  odd: '奇',
}

export interface ParityTypeSelectProps extends StyleProps {
  value?: ParityType
  disabled?: boolean
  onValueChange?: (value: ParityType | undefined) => void
}

export const ParityTypeSelect: React.FC<ParityTypeSelectProps> = ({ value, onValueChange, className, style, disabled }) => {
  return (
    <Select.Root disabled={disabled} value={`${value}`} onValueChange={(value: any) => onValueChange?.(value)}>
      <Select.Trigger className={className} style={style} />
      <Select.Content position="popper">
        {parity.map(e => (
          <Select.Item key={e} value={e}>
            {`${e} (${parityLabel[e]})`}
          </Select.Item>))}
      </Select.Content>
    </Select.Root>
  )
}
