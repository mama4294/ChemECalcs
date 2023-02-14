import { Breadcrumbs } from '../../components/calculators/breadcrumbs'
import { CalcBody } from '../../components/calculators/calcBody'
import { PageContainer } from '../../components/calculators/container'
import { CalcHeader } from '../../components/calculators/header'
import { GridCard } from '../../components/GridCard'
import { Metadata } from '../../components/Layout/Metadata'

const Page = () => {
  const paths = [{ title: 'Controls', href: '/controls/' }]

  return (
    <>
      <Metadata
        title="Controls Engineering"
        description="Chemical engineering calculations for process and plant engineers"
        keywords="Controls Engineering, chemical, engineering, home, calculator, unit, conversion, geometry, fluid, dynamics, tank, volume, agitation, scaleup, efficiency, accuracy, process, engineers"
      />

      <PageContainer>
        <Breadcrumbs paths={paths} />
        <CalcHeader title={'Controls Engineering'} text={'Calculators for controls and instrumentation'} />
        <CalcBody>
          <GridCard name="Analog Signals" description="Calculations for 4-20mA analog signals" link="/controls/mA" />
        </CalcBody>
      </PageContainer>
    </>
  )
}

export default Page
