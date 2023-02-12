import type { NextPage } from 'next'
import { GridCard } from '../components/GridCard'
import { Metadata } from '../components/Layout/Metadata'

const Home: NextPage = () => {
  return (
    <>
      <Metadata
        title="ChemE Calculator"
        description="Chemical engineering calculations for process and plant engineers"
        keywords="chemical, engineering, home, calculator, unit, conversion, geometry, fluid, dynamics, tank, volume, agitation, scaleup, efficiency, accuracy, process, engineers"
      />

      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-5xl font-extrabold leading-normal text-neutral-focus md:text-[5rem]">
          Chem<span className="text-accent">E</span> Calculator
        </h1>
        <div className="my-3 grid gap-9 text-center md:grid-cols-3 ">
          <GridCard name="Unit Conversion" description="Convert between units" link="/conversion" />
          <GridCard name="Geometry" description="Calculators for geometric properties" link="/geometry" />
          <GridCard name="Fluid Dynamics" description="Calculators for fluid dynamics" link="/fluids" />
          <GridCard name="Tank Volume" description="Tank volume visualization" link="/geometry/tank" />
          <GridCard name="Agitation" description="Agitation scaleup calculation" link="/agitation" span={2} />
        </div>
      </div>
    </>
  )
}

export default Home
