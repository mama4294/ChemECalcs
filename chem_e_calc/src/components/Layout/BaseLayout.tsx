import React from 'react'
import Footer from './Footer'
import Navbar from './Navbar'

type Props = {
  children?: React.ReactNode
}

const BaseLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex max-w-full flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

export default BaseLayout
