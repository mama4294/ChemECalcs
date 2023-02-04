import { Breadcrumbs } from '../../components/calculators/breadcrumbs'
import { CalcBody } from '../../components/calculators/calcBody'
import { PageContainer } from '../../components/calculators/container'
import { CalcHeader } from '../../components/calculators/header'
import { GridCard } from '../../components/GridCard'
import { Metadata } from '../../components/Layout/Metadata'

const Fluids = () => {
  const paths = [{ title: 'Fluid Dynamics', href: '/fluids/' }]

  return (
    <>
      <Metadata
        title="Fluid Dynamics"
        description="Chemical engineering calculations for process and plant engineers"
        keywords="Fluid Dynamics, chemical, engineering, home, calculator, unit, conversion, geometry, fluid, dynamics, tank, volume, agitation, scaleup, efficiency, accuracy, process, engineers"
      />

      <PageContainer>
        <Breadcrumbs paths={paths} />
        <CalcHeader title={'Fluid Dynamics'} text={'Calculators for fluid dynamics'} />
        <CalcBody>
          <GridCard
            name="Fluid Flow"
            description="Calculate flow rate, velocity, or pipe diameter"
            link="/fluids/fluidflow"
          />
          <GridCard
            name="Fluid Flow"
            description="Calculate the flow regime of fluid in a pipe"
            link="/fluids/reynoldsnumber"
          />
          <GridCard
            name="Pressure Drop"
            description="Calculate pressure drop through a system"
            link="/fluids/pressuredrop"
          />
        </CalcBody>
      </PageContainer>
    </>
  )
}

export default Fluids
