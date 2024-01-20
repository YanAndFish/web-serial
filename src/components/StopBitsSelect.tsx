const stopBits = [1, 2] as const

export type StopBits = typeof stopBits[number]
export interface StopBitsSelectProps extends StyleProps {
  value?: StopBits
  disabled?: boolean
  onValueChange?: (value: StopBits | undefined) => void
}

export const StopBitsSelect: React.FC<StopBitsSelectProps> = ({ value, onValueChange, className, style, disabled }) => {
  const handleValueChange = useCallback((value: string | undefined) => {
    if (!value || Number.isNaN(+value))
      onValueChange?.(undefined)
    else
      return onValueChange?.(+value as StopBits)
  }, [onValueChange])

  return (
    <Select.Root disabled={disabled} value={`${value}`} onValueChange={handleValueChange}>
      <Select.Trigger className={className} style={style} />
      <Select.Content position="popper">
        {stopBits.map(e => <Select.Item key={e} value={`${e}`}>{e}</Select.Item>)}
      </Select.Content>
    </Select.Root>
  )
}
