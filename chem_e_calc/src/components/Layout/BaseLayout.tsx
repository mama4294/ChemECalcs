import React from 'react'
import Footer from "./Footer"
import Navbar from "./Navbar"

type Props = {
    children?: React.ReactNode
  };

const BaseLayout:React.FC<Props> = ({children}) =>{
    return(
        <>
        {/* <div data-theme="garden" className="min-h-screen flex flex-col"> */}
        <div  className="min-h-screen flex flex-col">
        <Navbar/>
            <main className="flex-grow ">
            {children}
            </main>
            <Footer/>
        </div>
        </>
    )
}

export default BaseLayout