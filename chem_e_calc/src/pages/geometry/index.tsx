import Link from 'next/link'
import { GridCard } from '../../components/GridCard'
import { Metadata } from '../../components/Layout/Metadata'
import { IconBox } from '../../icons/IconBox'
import { IconCone } from '../../icons/iconCone'
import { IconCylinder } from '../../icons/iconCylinder'
import { IconHemisphere } from '../../icons/iconHemiphere'
import { IconPyramid } from '../../icons/iconPyramid'
import { IconSphere } from '../../icons/iconSphere'
import { IconTank } from '../../icons/IconTank'
import ShapeContainer from '../../components/3D shapes/DyanmicShapes'
import { Box3D, Cone3D, Cylinder3D, Hemisphere3D, Sphere3D, Tank3D } from '../../components/3D shapes/StaticShapes'

const Geometry = () => {
  return (
    <>
      <Metadata
        title="Geometry Calculators"
        description="Chemical engineering calculations for process and plant engineers"
        keywords="box, volume, lenght, width, height, calculator, chemical engineering, process engineering, chemical engineering calculations, process engineering calculations"
      />
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
        <div className="my-3 grid gap-9 py-3 text-center  md:grid-cols-3">
          <GridCard name="Cylinder" link="/geometry/cylinder">
            <div className="h-[100px] w-[100px]">
              <ShapeContainer orbit={false}>
                <Cylinder3D />
              </ShapeContainer>
            </div>
          </GridCard>
          <GridCard name="Box" link="/geometry/box">
            <div className="h-[100px] w-[100px]">
              <ShapeContainer orbit={false}>
                <Box3D />
              </ShapeContainer>
            </div>
          </GridCard>
          <GridCard name="Cone" link="/geometry/cone">
            <div className="h-[100px] w-[100px]">
              <ShapeContainer orbit={false}>
                <Cone3D />
              </ShapeContainer>
            </div>
          </GridCard>
          <GridCard name="Sphere" link="/geometry/sphere">
            <div className="h-[100px] w-[100px]">
              <ShapeContainer orbit={false}>
                <Sphere3D />
              </ShapeContainer>
            </div>
          </GridCard>
          {/* <GridCard name="Pyramid" link="/geometry/pyramid">
            <IconPyramid />
          </GridCard> */}
          <GridCard name="Hemisphere" link="/geometry/hemisphere">
            <div className="h-[100px] w-[100px]">
              <ShapeContainer orbit={false}>
                <Hemisphere3D />
              </ShapeContainer>
            </div>
          </GridCard>
          <GridCard name="Tank" link="/geometry/tank" span={1}>
            {/* <IconTank /> */}
            <div className="h-[100px] w-[100px]">
              <ShapeContainer orbit={false}>
                <Tank3D />
              </ShapeContainer>
            </div>
          </GridCard>
        </div>
      </div>
    </>
  )
}

export default Geometry
