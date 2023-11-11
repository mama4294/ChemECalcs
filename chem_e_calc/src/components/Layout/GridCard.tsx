import Link from 'next/link'

type GridCardProps = {
  name: string
  children?: React.ReactNode
  description?: string
  link: string
  span?: number
}

export const GridCard = ({ name, children, description, link, span }: GridCardProps) => {
  const getClassName = (span: number | undefined) => {
    if (!span) return ''
    switch (span) {
      case 1:
        return 'md:col-span-1'
      case 2:
        return 'md:col-span-2'
      case 3:
        return 'md:col-span-3'
      default:
        return ''
    }
  }

  const spanClass = getClassName(span)

  console.log(spanClass)
  return (
    <Link href={link}>
      <div
        className={`relative group grid cursor-pointer duration-500 hover:scale-105    ${spanClass}`} //motion-safe:hover:scale-105
      >
        <div className='absolute -inset-0.5 bg-secondary blur rounded-xl opacity-75 group-hover:opacity-100 group-hover:-inset-1 duration-500'></div>
        <div className='relative text-left bg-neutral text-neutral-content p-6 rounded-xl'>
          <h3 className="mb-3 flex items-center text-2xl font-semibold tracking-tight">
            {name}
          </h3>
        <p className="text-sm opacity-75">{description}</p>
        {children && <div className="flex justify-center">{children}</div>}
      </div>
      </div>

    </Link>
  )
}
