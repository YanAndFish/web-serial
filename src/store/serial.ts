import { create } from 'zustand'
import type { BaudRate } from '@/components/BaudRateSelect'
import type { DataBits } from '@/components/DataBitsSelect'
import type { StopBits } from '@/components/StopBitsSelect'

const serialOptionKey = 'serial' as const
const serialCountKey = 'serialCount' as const

export interface SerialStore {
  baudRate?: BaudRate
  setBaudRate: (baudRate: BaudRate | undefined) => void
  dataBits?: DataBits
  setDataBits: (dataBits: DataBits | undefined) => void
  stopBits?: StopBits
  setStopBits: (stopBits: StopBits | undefined) => void
  parity?: ParityType
  setParity: (parity: ParityType | undefined) => void
  sendCount?: number
  putSendCount: (sendCount: number) => void
  clearSendCount: () => void
  receiveCount?: number
  putReceiveCount: (receiveCount: number) => void
  clearReceiveCount: () => void
  port?: SerialPort
  requestPort: () => Promise<void>
  togglePort: (status?: 'open' | 'close') => Promise<void>
  connected: boolean
}

function createInitialState() {
  const option = localStorage.getItem(serialOptionKey)
  const count = localStorage.getItem(serialCountKey)

  const defaultState = () => ({
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: 'none',
    sendCount: 0,
    receiveCount: 0,
    connected: false,
  })

  try {
    const optionObj = option ? JSON.parse(option) : {}
    const countObj = count ? JSON.parse(count) : {}
    return { ...defaultState(), ...optionObj, ...countObj }
  }
  catch {
    return defaultState()
  }
}

function saveInfo(store: () => SerialStore) {
  localStorage.setItem(serialOptionKey, JSON.stringify({
    ...store(),
    sendCount: undefined,
    receiveCount: undefined,
    port: undefined,
    connected: undefined,
  }))
}

function saveCount(store: () => SerialStore) {
  const { sendCount, receiveCount } = store()
  localStorage.setItem(serialCountKey, JSON.stringify({ sendCount, receiveCount }))
}

export const useSerialStore = create<SerialStore>((set, store) => ({
  ...createInitialState(),
  setBaudRate: (baudRate: BaudRate | undefined) => {
    set({ baudRate })
    saveInfo(store)
  },
  setDataBits: (dataBits: DataBits | undefined) => {
    set({ dataBits })
    saveInfo(store)
  },
  setStopBits: (stopBits: StopBits | undefined) => {
    set({ stopBits })
    saveInfo(store)
  },
  setParity: (parity: ParityType | undefined) => {
    set({ parity })
    saveInfo(store)
  },
  putSendCount: (sendCount: number) => {
    set(v => ({ sendCount: v.sendCount! + sendCount }))
    saveCount(store)
  },
  clearSendCount: () => {
    set({ sendCount: 0 })
    saveCount(store)
  },
  putReceiveCount: (receiveCount: number) => {
    set(v => ({ receiveCount: v.receiveCount! + receiveCount }))
    saveCount(store)
  },
  clearReceiveCount: () => {
    set({ receiveCount: 0 })
    saveCount(store)
  },
  requestPort: async () => {
    const { port, connected, togglePort } = store()
    try {
      if (port && connected)
        togglePort('close')

      set({ port: await navigator.serial.requestPort() })
    }
    catch (error) {
      set({ port: undefined })
      throw error
    }
  },
  togglePort: async (status: 'open' | 'close' = store().connected ? 'close' : 'open') => {
    const { port, connected } = store()
    if (connected && status === 'close') {
      await port?.close()
      set({ connected: false })
    }
    else if (!connected && status === 'open') {
      await port?.open({ baudRate: 9600 })
      set({ connected: true })
    }
  },
}))
