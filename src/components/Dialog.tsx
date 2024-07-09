import React from 'react'
import type { ShowDialogOptions } from '@/hooks/use-dialog'

export interface AlertDialogProps extends Props {

}

export interface AlertDialogRef {
  showDialog: (option: ShowDialogOptions) => void
}

export const Dialog = forwardRef<AlertDialogRef, AlertDialogProps>(({ children }, ref) => {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('提示')
  const [description, setDesciption] = useState<React.ReactNode>()
  const handleAction = useRef<React.MouseEventHandler<HTMLButtonElement>>(() => {})
  const handleCancel = useRef<React.MouseEventHandler<HTMLButtonElement>>(() => {})
  const [actionText, setActionText] = useState<string>()
  const [cancelText, setCancelText] = useState<string>()

  useImperativeHandle(ref, () => ({
    showDialog: (option: ShowDialogOptions) => {
      setTitle(option.title)
      setDesciption(option.description)
      handleAction.current = option.onAction || (() => {})
      handleCancel.current = option.onCancel || (() => {})
      setActionText(option.actionText)
      setCancelText(option.cancelText)

      setOpen(true)
    },
  }), [])

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Content style={{ maxWidth: 450 }}>
        <AlertDialog.Title>{title}</AlertDialog.Title>
        <AlertDialog.Description size="2">
          {description ?? children}
        </AlertDialog.Description>
        <Flex gap="3" justify="end" mt="4">
          {
          !!actionText
           && (
             <AlertDialog.Action>
               <Button color="red" variant="solid" onClick={handleAction.current}>
                 {actionText}
               </Button>
             </AlertDialog.Action>
           )
          }

          {
          !!cancelText
           && (
             <AlertDialog.Cancel>
               <Button variant="outline" onClick={handleCancel.current}>{cancelText}</Button>
             </AlertDialog.Cancel>
           )
          }
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
})
