import { Breadcrumbs } from '../../components/calculators/breadcrumbs'
import { CalcBody } from '../../components/calculators/calcBody'
import { PageContainer } from '../../components/calculators/container'
import { CalcHeader } from '../../components/calculators/header'
import { GridCard } from '../../components/GridCard'

const Fluids = () => {
  const paths = [{ title: 'Fluid Dynamics', href: '/fluids/' }]

  return (
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
  )
}

export default Fluids
