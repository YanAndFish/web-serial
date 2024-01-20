export interface FieldProps extends Props {
  label?: string
}

export const Field: FC<FieldProps> = ({ className, style, children, label }) => {
  return (
    <div className={`flex justify-between items-center my-2 ${className}`} style={style}>
      {!!label && <RText>{label}</RText>}
      {children}
    </div>
  )
}
