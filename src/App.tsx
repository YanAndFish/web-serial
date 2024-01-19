import { SerialPanel } from './components/SerialPanel'
import { WindowBox } from '@/components/WindowBox'
import bg from '@/assets/docs-dark.png'

function App() {
  return (
    <>
      <img className="w-90rem fixed right-0" src={bg} />
      <Flex align="center" className="w-full h-full z-2" justify="center">
        <WindowBox height="80vh" title="网页串口调试助手" width="80vw">
          <SerialPanel />
        </WindowBox>
      </Flex>
    </>
  )
}

export default App
