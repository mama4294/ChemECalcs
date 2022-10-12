import Link from 'next/link'
import { GridCard } from '../../components/GridCard'
import { IconBox } from '../../icons/IconBox'
import { IconCone } from '../../icons/iconCone'
import { IconCylinder } from '../../icons/iconCylinder'
import { IconHemisphere } from '../../icons/iconHemiphere'
import { IconPyramid } from '../../icons/iconPyramid'
import { IconSphere } from '../../icons/iconSphere'

const Geometry = () => {
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
        <GridCard name="Cylinder" link="/geometry/cylinder">
          <IconCylinder />
        </GridCard>
        <GridCard name="Box" link="/geometry/box">
          <IconBox />
        </GridCard>
        <GridCard name="Cone" link="/geometry/cone">
          <IconCone />
        </GridCard>
        <GridCard name="Sphere" link="/geometry/sphere">
          <IconSphere />
        </GridCard>
        <GridCard name="Pyramid" link="/geometry/pyramid">
          <IconPyramid />
        </GridCard>
        <GridCard name="Hemisphere" link="/geometry/hemisphere">
          <IconHemisphere />
        </GridCard>
      </div>
    </div>
  )
}

export default Geometry
