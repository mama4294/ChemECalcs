import Image from 'next/image'
import Link from 'next/link'

type GridCardProps = {
  name: string
  children?: React.ReactNode
  description?: string
  link: string
}

export const GridCard = ({ name, children, description, link }: GridCardProps) => {
  return (
    <Link href={link}>
      <section className="shadow-nuetral card w-56 cursor-pointer bg-base-100 text-base-content shadow-2xl duration-500 motion-safe:hover:scale-105">
        <div className="card-body">
          <h2 className="card-title justify-center ">{name}</h2>
          <p>{description}</p>
          {children && (
            <div className="flex justify-center">
              {/* <Image src={svg} width="100px" height="100px" /> */}
              {children}
            </div>
          )}
        </div>
      </section>
    </Link>
  )
}
