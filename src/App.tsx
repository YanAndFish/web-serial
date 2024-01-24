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
        <WindowBox
          height="80vh" width="80vw" heading={
            <>
              <img className="rounded-2.5 mr-2.5" draggable={false} height="36px" src="/logo.jpg" width="36px" />
              <Heading className="grow">串口调试助手</Heading>
            </>
        }
        >
          <SerialPanel />
        </WindowBox>
      </Flex>
      <Dialog ref={ref} />
    </>
  )
}

export default App
