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

      <div className="flex max-w-full flex-grow flex-col items-center justify-center bg-gradient-to-b from-transparent to-neutral p-4">
        <div className="relative w-full max-w-3xl">
          <div className="flex justify-center fill-base-content">
            <ChemECalcsLogo height={150} width={400} />
          </div>

          <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]"></div>
          <div className="flex justify-center">
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
