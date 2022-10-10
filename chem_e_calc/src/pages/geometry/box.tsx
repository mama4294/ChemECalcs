import { Breadcrumbs } from '../../components/calculators/breadcrumbs'
import { PageContainer } from '../../components/calculators/container'
import { CalcHeader } from '../../components/calculators/header'

const Box = () => {
  const paths = [
    { title: 'Geometry', href: '/geometry' },
    { title: 'Box', href: '/geometry/box' },
  ]

  return (
    <PageContainer>
      <Breadcrumbs paths={paths} />
      <CalcHeader title={'Box'} text={'This calculates the volume of a box'} />
    </PageContainer>
  )
}

export default Box
