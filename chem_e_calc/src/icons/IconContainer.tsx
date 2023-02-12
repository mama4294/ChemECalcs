export const IconContainer = ({ children, viewBox, ...otherProps }: { children: React.ReactNode; viewBox: string }) => {
  return (
    <svg
      viewBox={viewBox || '0 0 500 500'}
      xmlns="http://www.w3.org/2000/svg"
      className="fill-base-content stroke-base-100"
      {...otherProps}
    >
      {children}
    </svg>
  )
}
