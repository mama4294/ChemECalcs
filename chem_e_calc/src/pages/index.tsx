import type { NextPage } from 'next'
import { GridCard } from '../components/Layout/GridCard'
import { Metadata } from '../components/Layout/Metadata'
import { LogoIcon } from '../components/Layout/LogoIcon'
import { LogoText } from '../components/Layout/LogoText'

const Home: NextPage = () => {
  return (
    <>
      <Metadata
        title="ChemE Calculator"
        description="Chemical engineering calculations for process and plant engineers"
        keywords="chemical, engineering, home, calculator, unit, conversion, geometry, fluid, dynamics, tank, volume, agitation, scaleup, efficiency, accuracy, process, engineers"
      />

      <div className="flex max-w-full flex-grow flex-col items-center justify-center bg-gradient-to-t from-transparent to-neutral p-4">
        <div className="relative w-full max-w-3xl">
          <div className="flex justify-center fill-neutral-content">
            <LogoIcon height={150} width={150} />
            <LogoText height={150} width={275} />
            <div className="max-w-full absolute -z-20 flex h-[150px] w-[480px] rounded-full bg-gradient-to-br from-sky-900 to-[#0141ff] opacity-40 blur-2xl"></div>
          </div>
          <div className="flex justify-center text-neutral-content">
            <h2 className="mb-8 text-xl font-medium">Online calculators for chemical, process, and plant engineers.</h2>
          </div>
          <div className="my-3 grid gap-9 md:grid-cols-3 ">
            <GridCard name="Units" description="Convert between units" link="/conversion" />
            <GridCard name="Geometry" description="Volume of a cylinder, cone, box, etc" link="/geometry" />
            <GridCard name="Fluids" description="Pressure drop, Reynolds number, etc" link="/fluids" />
            <GridCard name="Tanks" description="Tank volume visualization" link="/geometry/tank" />
            <GridCard name="Controls" description="Controls and instrumentation" link="/controls" />
            <GridCard name="Fermentation" description="Fermenters and bioreactors" link="/fermentation" />
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
