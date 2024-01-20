const baudRate = [2400, 4800, 9600, 19200, 38400, 57600, 115200, 230400, 460800, 921600] as const

export type BaudRate = typeof baudRate[number]
export interface BaudRateSelectProps extends StyleProps {
  value?: BaudRate
  disabled?: boolean
  onValueChange?: (value: BaudRate | undefined) => void
}

export const BaudRateSelect: React.FC<BaudRateSelectProps> = ({ value, onValueChange, className, style, disabled }) => {
  const handleValueChange = useCallback((value: string | undefined) => {
    if (!value || Number.isNaN(+value))
      onValueChange?.(undefined)
    else
      return onValueChange?.(+value as BaudRate)
  }, [onValueChange])

  return (
    <Select.Root disabled={disabled} value={`${value}`} onValueChange={handleValueChange}>
      <Select.Trigger className={className} style={style} />
      <Select.Content position="popper">
        {baudRate.map(e => <Select.Item key={e} value={`${e}`}>{e}</Select.Item>)}
      </Select.Content>
    </Select.Root>
  )
}
