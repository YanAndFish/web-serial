const dataBits = [5, 6, 7, 8] as const

export type DataBits = typeof dataBits[number]
export interface DataBitsSelectProps extends StyleProps {
  value?: DataBits
  onValueChange?: (value: DataBits | undefined) => void
}

export const DataBitsSelect: React.FC<DataBitsSelectProps> = ({ value, onValueChange, className, style }) => {
  const handleValueChange = useCallback((value: string | undefined) => {
    if (!value || Number.isNaN(+value))
      onValueChange?.(undefined)
    else
      return onValueChange?.(+value as DataBits)
  }, [onValueChange])

  return (
    <Select.Root value={`${value}`} onValueChange={handleValueChange}>
      <Select.Trigger className={className} style={style} />
      <Select.Content position="popper">
        {dataBits.map(e => <Select.Item value={`${e}`} key={e}>{e}</Select.Item>)}
      </Select.Content>
    </Select.Root>
  )
}
