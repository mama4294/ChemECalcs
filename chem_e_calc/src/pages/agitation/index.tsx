import { Breadcrumbs } from '../../components/calculators/breadcrumbs'
import { CalcBody } from '../../components/calculators/calcBody'
import { PageContainer } from '../../components/calculators/container'
import { CalcHeader } from '../../components/calculators/header'
import { GridCard } from '../../components/GridCard'
import { Metadata } from '../../components/Layout/Metadata'

const Agitation = () => {
  const paths = [{ title: 'Agitation', href: '/agitation/' }]

  return (
    <>
      <Metadata
        title="Agiation"
        description="Chemical engineering calculations for process and plant engineers"
        keywords="Agitation, chemical, engineering, home, calculator, unit, conversion, geometry, fluid, dynamics, tank, volume, agitation, scaleup, efficiency, accuracy, process, engineers"
      />
      <PageContainer>
        <Breadcrumbs paths={paths} />
        <CalcHeader title={'Agitation'} text={'Calculators for vessel agitators'} />
        <CalcBody>
          <GridCard name="Tip Speed" description="Calculate impeller tip speed" link="/agitation/tipspeed" />
          <GridCard name="Agitation Scale Up" description="Scaleup to a larger vessel" link="/agitation/scaleup" />
        </CalcBody>
      </PageContainer>
    </>
  )
}

export default Agitation
