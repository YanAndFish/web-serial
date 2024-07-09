import { CounterClockwiseClockIcon, UpdateIcon } from '@radix-ui/react-icons'
import style from './ReplayButton.module.css'
import { loadSerialData, replaySerialData, usePortStore } from '@/store/port'
import { useDialog } from '@/hooks/use-dialog'
import { Dialog } from '@/components/Dialog'

export const ReplayButton: FC = () => {
  const { rec, connected, replaying, setReplaying } = usePortStore(s => ({
    rec: s.rec,
    connected: s.connected,
    replaying: s.replaying,
    setReplaying: s.setReplaying,
  }))
  const { ref, showDialog } = useDialog()

  const handleReplayData = useCallback(async () => {
    const file = await loadSerialData()

    if (file) {
      try {
        setReplaying(true)
        await replaySerialData(file)
      }
      catch (err) {
        showDialog({ title: '数据流重现失败', description: err instanceof Error ? err.message : String(err) })
      }
      finally {
        setReplaying(false)
      }
    }
  }, [showDialog, setReplaying])

  return (
    <>
      <Button onClick={handleReplayData} color="cyan" disabled={rec || !connected} size="1" variant="soft">
        {replaying ? <UpdateIcon className={style['spin-icon-load']} /> : <CounterClockwiseClockIcon />}
        <RText>数据流重现</RText>
      </Button>
      <Dialog ref={ref}></Dialog>
    </>
  )
}
