import type { TextProps } from '@radix-ui/themes'

export interface FieldProps extends Props {
  label?: string
  text?: TextProps
}

export const Field: FC<FieldProps> = ({ className, style, children, label, text }) => {
  return (
    <div className={`flex justify-between items-center my-2 ${className}`} style={style}>
      {!!label && <RText {...text}>{label}</RText>}
      {children}
    </div>
  )
}
