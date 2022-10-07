import '../styles/globals.css'
import type { AppType } from 'next/dist/shared/lib/utils'
import BaseLayout from '../components/Layout/BaseLayout'

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <BaseLayout>
      <Component {...pageProps} />
    </BaseLayout>
  )
}

export default MyApp
