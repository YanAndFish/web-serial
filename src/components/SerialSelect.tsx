import { ReloadIcon, UpdateIcon } from '@radix-ui/react-icons'
import { useSerialStore } from '@/store/serial'

export interface SerialSelectProps {
  value?: string
}

export const SerialSelect: FC<SerialSelectProps> = () => {
  const { port, connected, requestPort, togglePort } = useSerialStore()
  const supported: boolean = !!navigator.serial

  const [loading, setLoading] = useState<boolean>(false)

  const buttonText = useMemo(() => {
    if (!supported)
      return '不受支持'
    else if (port)
      return connected ? '关闭串口' : '打开串口'
    else
      return '选择一个串口'
  }, [port, connected])

  const handleTogglePort = useCallback(() => {
    try {
      setLoading(true)
      togglePort()
    }
    catch (err) {
      console.error(err)
    }
    finally {
      setLoading(false)
    }
  }, [togglePort])

  return (
    <Flex className="w-full">
      {
        port
          ? (
            <Button
              className="grow"
              color={connected ? 'cyan' : undefined}
              variant="soft"
              onClick={handleTogglePort}
            >
              {loading ? <UpdateIcon /> : buttonText}
            </Button>
            )
          : (
            <Button
              className="grow"
              color={connected ? 'cyan' : undefined}
              disabled={!supported}
              onClick={requestPort}
            >
              {buttonText}
            </Button>
            )
      }
      {
        !!port
        && (
          <Button className="ml-2" variant="soft" onClick={requestPort}>
            <ReloadIcon />
          </Button>
        )
      }
    </Flex>
  )
}
