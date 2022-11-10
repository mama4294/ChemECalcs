import Link from 'next/link'
import { Breadcrumbs } from '../../components/calculators/breadcrumbs'
import { CalcBody } from '../../components/calculators/calcBody'
import { PageContainer } from '../../components/calculators/container'
import { CalcHeader } from '../../components/calculators/header'
import { GridCard } from '../../components/GridCard'
import { IconBox } from '../../icons/IconBox'
import { IconCone } from '../../icons/iconCone'
import { IconCylinder } from '../../icons/iconCylinder'
import { IconHemisphere } from '../../icons/iconHemiphere'
import { IconPyramid } from '../../icons/iconPyramid'
import { IconSphere } from '../../icons/iconSphere'

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
