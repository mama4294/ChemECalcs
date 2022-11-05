import type { NextPage } from 'next'
import Head from 'next/head'
import { GridCard } from '../components/GridCard'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>ChemE Calculator</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        {/* <div className="absolute -z-10 h-screen w-screen ">
          <Image src="/triangleBackground.png" layout="fill" objectFit="cover" quality={100} />
        </div> */}
        <h1 className="text-5xl font-extrabold leading-normal text-neutral-focus md:text-[5rem]">
          Chem<span className="text-accent">E</span> Calculator
        </h1>
        <div className="my-3 grid gap-9 text-center md:grid-cols-3 ">
          <GridCard name="Unit Conversion" description="Convert between units" link="/conversion" />
          <GridCard name="Geometry" description="Calculators for geometric properties" link="/geometry" />
          <GridCard name="Fluid Flow" description="Calculators for fluid dynamics" link="/fluidflow" />
          <GridCard name="Agitation" description="Agitation scaleup calculation" link="/agitation" />
        </div>
      </main>
    </>
  )
}

export default Home
