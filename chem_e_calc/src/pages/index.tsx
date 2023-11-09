import type { NextPage } from 'next'
import { GridCard } from '../components/GridCard'
import { Metadata } from '../components/Layout/Metadata'
import { ChemECalcsLogo } from '../components/Layout/Logo'
import { Blob } from '../components/Layout/Blob'

const Home: NextPage = () => {
  return (
    <>
      <Metadata
        title="ChemE Calculator"
        description="Chemical engineering calculations for process and plant engineers"
        keywords="chemical, engineering, home, calculator, unit, conversion, geometry, fluid, dynamics, tank, volume, agitation, scaleup, efficiency, accuracy, process, engineers"
      />

      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="relative w-full max-w-2xl">
          <div className="flex justify-center fill-base-content">
            <ChemECalcsLogo height={150} width={400} />
          </div>
          <div className="my-3 grid gap-9 text-center md:grid-cols-3 ">
            <GridCard name="Unit Conversion" description="Convert between units" link="/conversion" />
            <GridCard name="Geometry" description="Calculators for geometric properties" link="/geometry" />
            <GridCard name="Fluid Dynamics" description="Calculators for fluid dynamics" link="/fluids" />
            <GridCard name="Tank Volume" description="Tank volume visualization" link="/geometry/tank" />
            <GridCard name="Controls" description="Calculators for controls and instrumentation" link="/controls" />
            <GridCard
              name="Fermentation"
              description="Calculators for fermenters and bioreactors"
              link="/fermentation"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
