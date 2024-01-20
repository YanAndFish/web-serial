const baudRate = [2400, 4800, 9600, 19200, 38400, 57600, 115200, 230400, 460800, 921600] as const

export type BaudRate = typeof baudRate[number]
export interface BaudRateSelectProps extends StyleProps {
  value?: BaudRate
  onValueChange?: (value: BaudRate | undefined) => void
}

export const BaudRateSelect: React.FC<BaudRateSelectProps> = ({ value, onValueChange, className, style }) => {
  const handleValueChange = useCallback((value: string | undefined) => {
    if (!value || Number.isNaN(+value))
      onValueChange?.(undefined)
    else
      return onValueChange?.(+value as BaudRate)
  }, [onValueChange])

  return (
    <Select.Root value={`${value}`} onValueChange={handleValueChange}>
      <Select.Trigger className={className} style={style} />
      <Select.Content position="popper">
        {baudRate.map(e => <Select.Item value={`${e}`} key={e}>{e}</Select.Item>)}
      </Select.Content>
    </Select.Root>
  )
}
