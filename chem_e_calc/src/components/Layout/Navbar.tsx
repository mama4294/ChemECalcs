import Link from "next/link"

const Navbar = () =>{
    return(
        <div className="navbar bg-neutral">
        <div className="navbar-start">
            <div className="dropdown">
            <label tabIndex={0} className="btn lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
            </label>
            {/* Mobile Menu */}
            <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-neutral text-neutral-content rounded-box w-52">
                <li><a>Fluid Flow</a></li>
                <li tabIndex={0}>
                <a className="justify-between">
                    Heat Transfer
                    <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/></svg>
                </a>
                <ul className="p-2 shadow bg-neutral text-neutral-content rounded-box">
                    <li>
                        <Link href={"/heatexchangers"}>
                        <a>Heat Exchangers</a>
                        </Link>
                    </li>
                    <li>
                    <Link href={"/thermo"}>
                        <a>Thermodynamics</a>
                        </Link>
                        </li>
                </ul>
                </li>
                <li><a>Equipment</a></li>
            </ul>
            </div>
            <a className="btn normal-case text-xl">ChemE Calcs</a>
        </div>
         {/* Desktop Menu */}
        <div className="navbar-center hidden lg:flex text-neutral-content">
            <ul className="menu menu-horizontal p-0">
            <li>
                <a>Fluid Flow</a>
            </li>
            <li tabIndex={0}>
                <a>
                Heat Transfer
                <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                </a>
                <ul className="p-2 shadow dropdown-content rounded-box w-52 bg-neutral text-neutral-content">
                    <li><a>Heat Exchangers</a></li>
                    <li><a>Thermodynamics</a></li>
                </ul>
            </li>
            <li><a>Equipment</a></li>
            </ul>
        </div>
        <div className="navbar-end">
            <button className="btn btn-circle">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </button>
        </div>
        </div>
    )
}

export default Navbar