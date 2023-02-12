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
      <section
        className={`gridCard shadow-nuetral card flex cursor-pointer flex-row items-center bg-base-100 text-base-content shadow-2xl duration-500 motion-safe:hover:scale-105 ${spanClass}`}
      >
        <div className="card-body">
          <h2 className="card-title justify-center ">{name}</h2>
          <p>{description}</p>
          {children && <div className="flex justify-center">{children}</div>}
        </div>
      </section>
    </Link>
  )
}
