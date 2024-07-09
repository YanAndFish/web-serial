import type { AlertDialogRef } from '@/components/Dialog'

export interface ShowDialogOptions {
  title: string
  description?: React.ReactNode
  actionText?: string
  onAction?: React.MouseEventHandler<HTMLButtonElement>
  cancelText?: string
  onCancel?: React.MouseEventHandler<HTMLButtonElement>
}

export function useDialog() {
  const ref: React.Ref<AlertDialogRef> = useRef(null)

  const showDialog = (option: ShowDialogOptions) => {
    if (!ref.current) {
      if (import.meta.env.DEV)
        console.error('ref引用值为空，是否忘记在组件上添加ref属性？')
    }
    else {
      ref.current.showDialog(option)
    }
  }

  return {
    ref,
    showDialog,
  }
}
