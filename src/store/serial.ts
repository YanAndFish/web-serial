import { create } from 'zustand'
import type { BaudRate } from '@/components/BaudRateSelect'
import type { DataBits } from '@/components/DataBitsSelect'
import type { StopBits } from '@/components/StopBitsSelect'

const serialOptionKey = 'serial' as const

export interface SerialStore {
  baudRate?: BaudRate
  setBaudRate: (baudRate: BaudRate | undefined) => void
  dataBits?: DataBits
  setDataBits: (dataBits: DataBits | undefined) => void
  stopBits?: StopBits
  setStopBits: (stopBits: StopBits | undefined) => void
  parity?: ParityType
  setParity: (parity: ParityType | undefined) => void
}

function createInitialState() {
  const serial = localStorage.getItem(serialOptionKey)

  const defaultState = () => ({
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: 'none',
  })

  try {
    if (serial)
      return { ...defaultState(), ...JSON.parse(serial) }
    else
      return defaultState()
  }
  catch {
    return defaultState()
  }
}

function saveStore(store: () => SerialStore) {
  localStorage.setItem(serialOptionKey, JSON.stringify(store()))
}

export const useSerialStore = create<SerialStore>((set, store) => ({
  ...createInitialState(),
  setBaudRate: (baudRate: BaudRate | undefined) => {
    set({ baudRate })
    saveStore(store)
  },
  setDataBits: (dataBits: DataBits | undefined) => {
    set({ dataBits })
    saveStore(store)
  },
  setStopBits: (stopBits: StopBits | undefined) => {
    set({ stopBits })
    saveStore(store)
  },
  setParity: (parity: ParityType | undefined) => {
    set({ parity })
    saveStore(store)
  },
}))
