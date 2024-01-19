export interface SerialSelectProps {
  value?: string
}

export const SerialSelect: FC<SerialSelectProps> = () => {
  const handleRequestSerialList = useRef(async () => {
    if (!navigator || !navigator.serial) {
      return 1
    }
    else {
      try {
        const port = await navigator.serial.requestPort()
      }
      catch (err) {
        console.error(err)
      }
    }
  })

  return (
    <Button onClick={handleRequestSerialList.current}>houa</Button>
  )
}
