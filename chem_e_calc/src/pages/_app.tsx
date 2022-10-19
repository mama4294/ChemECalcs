import '../styles/globals.css'
import type { AppType } from 'next/dist/shared/lib/utils'
import BaseLayout from '../components/Layout/BaseLayout'
import DefaultUnitProvider from '../contexts/defaultUnitContext'

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <BaseLayout>
      <DefaultUnitProvider>
        <Component {...pageProps} />
      </DefaultUnitProvider>
    </BaseLayout>
  )
}

export default MyApp
