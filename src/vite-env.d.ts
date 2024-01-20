/// <reference types="vite/client" />

interface ChildrenProps {
  children?: React.ReactNode
}

interface StyleProps {
  className?: string | undefined
  style?: React.CSSProperties | undefined
}
interface Props extends ChildrenProps, StyleProps {}
