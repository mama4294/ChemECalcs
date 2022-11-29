import Image from 'next/image'
import Link from 'next/link'

type GridCardProps = {
  name: string
  children?: React.ReactNode
  description?: string
  link: string
  span?: number
}

export const GridCard = ({ name, children, description, link, span }: GridCardProps) => {
  const spanClass = span ? `md:col-span-${span}` : ''
  return (
    <Link href={link}>
      <section
        className={`shadow-nuetral card cursor-pointer bg-base-100 text-base-content shadow-2xl duration-500 motion-safe:hover:scale-105 ${spanClass}`}
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
