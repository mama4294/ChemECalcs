import type { NextPage } from 'next'
import Head from 'next/head'
import { Breadcrumbs } from '../components/calculators/breadcrumbs'
import { PageContainer } from '../components/calculators/container'
import { CalcHeader } from '../components/calculators/header'
import { GridCard } from '../components/GridCard'

const UnitConversion: NextPage = () => {
  const paths = [{ title: 'Unit Conversion', href: '/conversion' }]
  return (
    <PageContainer>
      <Breadcrumbs paths={paths} />
      <CalcHeader title={'Unit Conversion'} text={'Convert between units'} />
    </PageContainer>
  )
}

export default UnitConversion
