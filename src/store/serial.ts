import { create } from 'zustand'
import { abortAutoSend, enableAutoSend } from './port'
import type { BaudRate } from '@/components/BaudRateSelect'
import type { DataBits } from '@/components/DataBitsSelect'
import type { StopBits } from '@/components/StopBitsSelect'

const serialOptionKey = 'serial' as const
const serialCountKey = 'serialCount' as const
const serialLogKey = 'serialLog' as const

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
  recvData?: string
  putRecvData: (recvData: string) => void
  clearRecvData: () => void
  sendData?: string
  setSendData: (sendData: string | undefined) => void
  clearSendData: () => void
  resolveSerialInfo: () => SerialOptions
  sendMode: 'text' | 'binary'
  setSendMode: (sendMode: 'text' | 'binary') => void
  recvMode: 'text' | 'binary'
  setRecvMode: (recvMode: 'text' | 'binary') => void
  autoSend: boolean
  setAutoSend: (autoSend: boolean) => void
  autoSendInterval?: number
  setAutoSendInterval: (autoSendInterval: number) => void
}

function createInitialState() {
  const option = localStorage.getItem(serialOptionKey)
  const count = localStorage.getItem(serialCountKey)
  const log = localStorage.getItem(serialLogKey)

  const defaultState = () => ({
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: 'none',
    sendCount: 0,
    receiveCount: 0,
    connected: false,
    recvData: '',
    sendData: '',
    sendMode: 'binary',
    recvMode: 'binary',
    autoSend: false,
    autoSendInterval: 0,
  })

  try {
    const optionObj = option ? JSON.parse(option) : {}
    const countObj = count ? JSON.parse(count) : {}
    const logObj = log ? JSON.parse(log) : {}
    return { ...defaultState(), ...optionObj, ...countObj, ...logObj }
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
    recvData: undefined,
    sendData: undefined,
  }))
}

function saveCount(store: () => SerialStore) {
  const { sendCount, receiveCount } = store()
  localStorage.setItem(serialCountKey, JSON.stringify({ sendCount, receiveCount }))
}

function saveLog(store: () => SerialStore) {
  const { sendData, recvData } = store()
  localStorage.setItem(serialLogKey, JSON.stringify({ sendData, recvData }))
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
  resolveSerialInfo: (): SerialOptions => {
    const { baudRate, dataBits, stopBits, parity } = store()

    if (baudRate === undefined)
      throw new Error('未设置波特率')

    if (dataBits === undefined)
      throw new Error('未设置数据位')

    if (stopBits === undefined)
      throw new Error('未设置停止位')

    if (parity === undefined)
      throw new Error('未设置校验位')

    return {
      baudRate,
      dataBits,
      stopBits,
      parity,
      bufferSize: 4 * 1024 * 1024,
    }
  },
  putRecvData: (recvData: string) => {
    set((v) => {
      if (v.recvMode === 'binary' && v.recvData && !v.recvData.endsWith(' '))
        v.recvData = `${v.recvData} `

      return { recvData: v.recvData + recvData }
    })
    saveLog(store)
  },
  clearRecvData: () => {
    set({ recvData: '' })
    saveLog(store)
  },
  setSendData: (sendData: string) => {
    set({ sendData })
    saveLog(store)
  },
  clearSendData: () => {
    set({ sendData: '' })
    saveLog(store)
  },
  setSendMode: (sendMode: 'text' | 'binary') => {
    set({ sendMode })
    saveInfo(store)
  },
  setRecvMode: (recvMode: 'text' | 'binary') => {
    set({ recvMode })
    saveInfo(store)
  },
  setAutoSend(autoSend) {
    set({ autoSend })
    saveInfo(store)
    autoSend ? enableAutoSend() : abortAutoSend()
  },
  setAutoSendInterval(autoSendInterval) {
    set({ autoSendInterval })
    saveInfo(store)
  },
}))
