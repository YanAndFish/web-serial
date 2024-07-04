import { StopIcon, TargetIcon, UpdateIcon } from '@radix-ui/react-icons'
import style from './RecButton.module.css'
import { startRec, stopRec, usePortStore } from '@/store/port'
import { isRecSupport } from '@/utils/rec'

export const RecButton: FC = () => {
  const { connected, rec } = usePortStore()
  const [loading, setLoading] = useState(false)

  const handleSwitchRec = useCallback(async () => {
    try {
      setLoading(true)
      if (!rec)
        await startRec()
      else
        await stopRec()
    }
    finally {
      setLoading(false)
    }
  }, [rec])

  const icon = useMemo(() => {
    if (loading)
      return <UpdateIcon className={style['spin-icon-load']} />
    else
      return rec ? <StopIcon /> : <TargetIcon />
  }, [loading, rec])

  const support = useMemo(isRecSupport, [])

  return (
    <Button color="red" size="1" variant="soft" disabled={!connected && support} onClick={handleSwitchRec}>
      {icon}
      <RText>数据流录制</RText>
    </Button>
  )
}
