import { SerialPanel } from './components/SerialPanel'
import { useDialog } from './hooks/use-dialog'
import { WindowBox } from '@/components/WindowBox'
import bg from '@/assets/docs-dark.png'
import { Dialog } from '@/components/Dialog'

function App() {
  const { ref, showDialog } = useDialog()

  useEffect(() => {
    if (!navigator?.serial) {
      showDialog({
        title: '不受资瓷',
        description: '你的浏览器不资瓷串口，换个浏览器再试试',
        actionText: '了解',
      })
    }
  }, [])

  return (
    <>
      <img className="w-90rem fixed right-0" src={bg} />
      <Flex align="center" className="w-full h-full z-2" justify="center">
        <WindowBox height="80vh" title="网页串口调试助手" width="80vw">
          <SerialPanel />
        </WindowBox>
      </Flex>
      <Dialog ref={ref}></Dialog>
    </>
  )
}

export default App
