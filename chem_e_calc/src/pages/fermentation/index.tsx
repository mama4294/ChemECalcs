import { Breadcrumbs } from '../../components/calculators/breadcrumbs'
import { CalcBody } from '../../components/calculators/calcBody'
import { PageContainer } from '../../components/calculators/container'
import { CalcHeader } from '../../components/calculators/header'
import { GridCard } from '../../components/Layout/GridCard'
import { Metadata } from '../../components/Layout/Metadata'

const Page = () => {
  const paths = [{ title: 'Fermentation', href: '/fermentation' }]

  return (
    <div className="flex-grow bg-gradient-to-b from-transparent to-neutral">
      <Metadata
        title="Fermentation"
        description="Chemical engineering calculations for process and plant engineers"
        keywords="Agitation, chemical, engineering, home, calculator, unit, conversion, geometry, fluid, dynamics, tank, volume, agitation, scaleup, efficiency, accuracy, process, engineers"
      />
      <PageContainer>
        <Breadcrumbs paths={paths} />
        <CalcHeader title={'Fermentation'} text={'Calculators for fermenters and bioreactors'} />
        <CalcBody>
          <GridCard name="Tip Speed" description="Calculate impeller tip speed" link="/fermentation/tipspeed" />
          <GridCard name="Agitation Scale Up" description="Scaleup to a larger vessel" link="/fermentation/scaleup" />
          <GridCard name="Respiration" description="Calculate OUR, CER, and RQ" link="/fermentation/our" />
          <GridCard
            name="Molarity"
            description="Calculate molarity of chemical solutions"
            link="/fermentation/molarity"
          />
          <GridCard
            name="Biokinetics"
            description="Model fermentation growth rate and substrate consumption"
            link="/fermentation/biokinetics"
          />
        </CalcBody>
      </PageContainer>
    </div>
  )
}

export default Page
