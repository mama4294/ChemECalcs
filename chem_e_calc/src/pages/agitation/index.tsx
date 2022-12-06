import { Breadcrumbs } from '../../components/calculators/breadcrumbs'
import { CalcBody } from '../../components/calculators/calcBody'
import { PageContainer } from '../../components/calculators/container'
import { CalcHeader } from '../../components/calculators/header'
import { GridCard } from '../../components/GridCard'

const Agitation = () => {
  const paths = [{ title: 'Agitation', href: '/agitation/' }]

  return (
    <PageContainer>
      <Breadcrumbs paths={paths} />
      <CalcHeader title={'Agitation'} text={'Calculators for vessel agitators'} />
      <CalcBody>
        <GridCard name="Tip Speed" description="Calculate impeller tip speed" link="/agitation/tipspeed" />
        <GridCard name="Agitation Scale Up" description="Scaleup to a larger vessel" link="/agitation/scaleup" />
      </CalcBody>
    </PageContainer>
  )
}

export default Agitation
