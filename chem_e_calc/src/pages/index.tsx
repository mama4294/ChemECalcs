import type { NextPage } from 'next'
import { GridCard } from '../components/Layout/GridCard'
import { Metadata } from '../components/Layout/Metadata'
import { LogoIcon } from '../components/Layout/LogoIcon'
import { LogoText } from '../components/Layout/LogoText'
import Link from 'next/link'
import { motion } from 'framer-motion'

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
            <div className="absolute -z-20 flex h-[150px] w-[480px] max-w-full rounded-full bg-gradient-to-br from-sky-900 to-[#0141ff] opacity-40 blur-2xl"></div>
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
          <BatchSchedulerBanner />
        </div>
      </div>
    </>
  )
}

export default Home

const BatchSchedulerBanner = () => {
  return (
    <Link href="https://batchscheduler.netlify.app">
      <motion.div
        className="group relative mt-9 grid cursor-pointer hover:scale-105"
        layout
        initial={{ scale: 0.8 }}
        whileInView={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', duration: 0.5, bounce: 0.3, delay: 0 }}
        viewport={{ once: true }}
      >
        <div className="absolute -inset-0.5 rounded-xl bg-secondary opacity-75 blur duration-500 group-hover:-inset-1 group-hover:opacity-100"></div>
        <div className="relative flex items-center space-x-4 rounded-xl bg-neutral px-6 py-2 text-neutral-content">
          <span className="badge badge-primary">New</span>
          <div className="">
            <h3 className=" font-semibold tracking-tight"> Batch Scheduling Tool </h3>

            <span className="text-sm opacity-75">Model complex batch processes</span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
