import { DropdownMenuIcon, KeyboardIcon } from '@radix-ui/react-icons'

const baudRate = [2400, 4800, 9600, 19200, 38400, 57600, 115200, 230400, 460800, 921600] as const

export type BaudRate = number // = typeof baudRate[number]
export interface BaudRateSelectProps extends StyleProps {
  value?: BaudRate
  disabled?: boolean
  onValueChange?: (value: BaudRate | undefined) => void
}

export const BaudRateSelect: React.FC<BaudRateSelectProps> = ({ value, onValueChange, className, style, disabled }) => {
  const [mode, setMode] = useState<'select' | 'input'>('select')

  const handleValueChange = useCallback((value: string | undefined) => {
    if (!value || Number.isNaN(+value))
      onValueChange?.(undefined)
    else
      return onValueChange?.(+value as BaudRate)
  }, [onValueChange])

  const handleInputChange = useCallback(({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    handleValueChange(value)
  }, [handleValueChange])

  const handleUpdateMode = useCallback(() => {
    setMode(mode === 'input' ? 'select' : 'input')

    // in this time,mode not toggle
    if (mode === 'input' && !(baudRate as readonly number[]).includes(+value!)) {
      if (Number.isNaN(+value!)) {
        handleValueChange('9600')
      }
      else {
        handleValueChange(`${(baudRate as readonly number[]).reduce((prev, curr) =>
          (Math.abs(curr - value!) < Math.abs(prev - value!) ? curr : prev))}`)
      }
    }
  }, [mode, setMode, value])

  useEffect(() => {
    if ((baudRate as readonly number[]).includes(+value!))
      setMode('select')
    else
      setMode('input')
  }, [])

  return (
    <Flex className={className} gap="2" style={style}>
      {
        mode === 'select'
          ? (
            <Select.Root disabled={disabled} value={`${value}`} onValueChange={handleValueChange}>
              <Select.Trigger className="grow" />
              <Select.Content position="popper">
                {baudRate.map(e => <Select.Item key={e} value={`${e}`}>{e}</Select.Item>)}
              </Select.Content>
            </Select.Root>
            )
          : <TextFieldInput placeholder="波特率..." value={value} onChange={handleInputChange} />
      }
      <Button onClick={handleUpdateMode}>
        {mode === 'select' ? <KeyboardIcon /> : <DropdownMenuIcon />}
      </Button>
    </Flex>
  )
}
