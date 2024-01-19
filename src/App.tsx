import { SerialPanel } from './components/SerialPanel'
import { WindowBox } from '@/components/WindowBox'
import bg from '@/assets/docs-dark.png'

function App() {
  return (
    <>
      <img src={bg} className="w-90rem fixed right-0"></img>
      <Flex align="center" justify="center" className="w-full h-full z-2">
        <WindowBox width="80vw" height="80vh" title="网页串口调试助手">
          <SerialPanel />
        </WindowBox>
      </Flex>
    </>
  )
}

export default App
