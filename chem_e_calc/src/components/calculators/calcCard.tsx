type Props = {
  title?: string
  children?: JSX.Element | string
  [x: string]: any
}

export const CalcCard: React.FC<Props> = ({ title, children, ...props }) => {
  const style = 'lg:w-w-[calc(33.33%_-_2rem)] w-full rounded bg-base-100 p-4 shadow-lg md:w-[calc(50%_-_2rem)]'

  return (
    <div className={style} {...props}>
      <div {...props}>
        {title && <h2 className="mb-4 text-xl">{title}</h2>}
        {children}
      </div>
    </div>
  )
}
