import { ReloadIcon, UpdateIcon } from '@radix-ui/react-icons'
import { Dialog } from '@/components/Dialog'
import { useDialog } from '@/hooks/use-dialog'
import { requestPort, togglePort, usePortStore } from '@/store/port'

export interface SerialSelectProps {
  value?: string
}

export const SerialSelect: FC<SerialSelectProps> = () => {
  const { port, connected } = usePortStore()
  const supported: boolean = !!navigator.serial

  const [loading, setLoading] = useState<boolean>(false)
  const { ref, showDialog } = useDialog()

  const buttonText = useMemo(() => {
    if (!supported)
      return '不受支持'
    else if (port)
      return connected ? '关闭串口' : '打开串口'
    else
      return '选择一个串口'
  }, [port, connected])

  const handleTogglePort = useCallback(async () => {
    try {
      setLoading(true)
      await togglePort()
    }
    catch (err) {
      console.error(err)
      showDialog({
        title: '串口错误',
        description: err instanceof Error ? err.message : String(err),
        actionText: '了解',
      })
    }
    finally {
      setLoading(false)
    }
  }, [])

  const handleRequestPort = useCallback(async () => {
    try {
      await requestPort()
    }
    catch (err) {
      console.error(err)
      showDialog({
        title: '串口错误',
        description: err instanceof Error ? err.message : String(err),
        actionText: '了解',
      })
    }
  }, [])

  return (
    <>
      <Flex className="w-full">
        {
        port
          ? (
            <Button
              className="grow"
              color={connected ? 'cyan' : undefined}
              variant="soft"
              onClick={loading ? undefined : handleTogglePort}
            >
              {loading ? <UpdateIcon /> : buttonText}
            </Button>
            )
          : (
            <Button
              className="grow"
              color={connected ? 'cyan' : undefined}
              disabled={!supported}
              onClick={handleRequestPort}
            >
              {buttonText}
            </Button>
            )
      }
        {
        !!port
        && (
          <Button className="ml-2" disabled={connected} variant="soft" onClick={handleRequestPort}>
            <ReloadIcon />
          </Button>
        )
      }
      </Flex>
      <Dialog ref={ref} />
    </>
  )
}
