export interface SerialSelectProps {
  value?: string
}

export const SerialSelect: FC<SerialSelectProps> = () => {
  const supported = useRef<boolean>(!!navigator?.serial)
  const [port, setPort] = useState<SerialPort>()

  const buttonText = useMemo(() => {
    if (!supported.current)
      return '不受支持'
    else if (port)
      return port.getInfo().usbProductId || 'unknown'
    else
      return '选择一个串口'
  }, [port])

  const handleRequestSerialList = useRef(async () => {
    if (navigator.serial) {
      try {
        setPort(await navigator.serial.requestPort())

        port?.open({
          baudRate: 9600,
          dataBits: 8,
          stopBits: 1,
          parity: 'none',
        })
      }
      catch (err) {
        console.error(err)
        setPort(undefined)
      }
    }
  })

  return (
    <Button disabled={!supported.current} className="w-full" onClick={handleRequestSerialList.current}>{buttonText}</Button>
  )
}
