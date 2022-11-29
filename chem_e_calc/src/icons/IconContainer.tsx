export const IconContainer = ({ children, ...otherProps }: { children: React.ReactNode }) => {
  return (
    <svg
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
      className="fill-base-content stroke-base-100"
      {...otherProps}
    >
      {children}
    </svg>
  )
}
