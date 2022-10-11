import Link from 'next/link'
import { GridCard } from '../../components/GridCard'

const Geometry = () => {
  const shapes = [
    {
      name: 'Cylinder',
      link: '/geometry/cylinder',
      svg: '/cylinder.svg',
    },
    {
      name: 'Box',
      link: '/geometry/box',
    },
    {
      name: 'Cone',
      link: '/geometry/cone',
      svg: '/cone.svg',
    },
    {
      name: 'Sphere',
      link: '/geometry/sphere',
      svg: '/sphere.svg',
    },
    {
      name: 'Pyramid',
      link: '/geometry/pyramid',
    },
    {
      name: 'Hemisphere',
      link: '/geometry/hemisphere',
    },
  ]

  return (
    <div className="mx-auto mb-24 max-w-xs md:max-w-2xl lg:max-w-4xl 2xl:max-w-6xl">
      {/* Breadcrumbs */}
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link href={'/'}>
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link href={'/geometry'}>
              <a>Geometry</a>
            </Link>
          </li>
        </ul>
      </div>

      {/* Page Title */}
      <div className="mt-4 mb-8">
        <h1 className="text-2xl">Geometry</h1>
        <p>This calculates the volume of geometric shapes with various units</p>
      </div>

      {/* Calculator */}
      <div className="my-3 grid gap-9 py-3 text-center md:grid-cols-3">
        {shapes.map((shape, index) => {
          return <GridCard key={index} name={shape.name} link={shape.link} svg={shape.svg} />
        })}
      </div>
    </div>
  )
}

export default Geometry
