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
        className={`group grid cursor-pointer rounded-xl border border-accent-content bg-base-100/50 p-6 text-left text-base-content duration-500 hover:border-[#00899e] hover:bg-base-100/70 ${spanClass}`} //motion-safe:hover:scale-105
      >
        <h3 className="mb-3 flex items-center text-2xl font-semibold tracking-tight">
          {name}
          <span className="ml-1 inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </h3>
        <p className="text-sm opacity-75">{description}</p>
        {children && <div className="flex justify-center">{children}</div>}
      </div>
    </Link>
  )
}
