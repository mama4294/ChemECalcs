import Link from 'next/link'
import { DefaultUnitsForm } from './DefaultUnitsForm'
import Search from './Search'

const Navbar = () => {
  return (
    <div className="navbar bg-neutral">
      <MobileMenu />
      <DesktopMenu />

      <div className="navbar-end">
        <Search />
        <DefaultUnitsForm />
      </div>
    </div>
  )
}

export default Navbar

const DesktopMenu = () => {
  return (
    <div className="navbar-center hidden text-neutral-content lg:flex">
      <ul className="menu menu-horizontal p-0 ">
        {/* <li>
          <Link href={'/conversion'}>
            <a className="hover:bg-neutral-focus">Unit Conversion</a>
          </Link>
        </li> */}
        <li tabIndex={0}>
          <a className="hover:bg-neutral-focus">
            Basics
            <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
            </svg>
          </a>
          <ul className="dropdown-content rounded-box z-10 w-52 bg-neutral p-2 text-neutral-content shadow">
            <li>
              <Link href={'/conversion'}>
                <a className="hover:bg-neutral-focus">Unit Conversion</a>
              </Link>
            </li>
            <li>
              <Link href={'/geometry/cylinder'}>
                <a className="hover:bg-neutral-focus">Cylinder</a>
              </Link>
            </li>
            <li>
              <Link href={'/geometry/box'}>
                <a className="hover:bg-neutral-focus">Box</a>
              </Link>
            </li>
            <li>
              <Link href={'/geometry/cone'}>
                <a className="hover:bg-neutral-focus">Cone</a>
              </Link>
            </li>
            <li>
              <Link href={'/geometry/sphere'}>
                <a className="hover:bg-neutral-focus">Sphere</a>
              </Link>
            </li>
            <li>
              <Link href={'/geometry/pyramid'}>
                <a className="hover:bg-neutral-focus">Pyramid</a>
              </Link>
            </li>
            <li>
              <Link href={'/geometry/hemisphere'}>
                <a className="hover:bg-neutral-focus">Hemisphere</a>
              </Link>
            </li>
            <li>
              <Link href={'/geometry/tank'}>
                <a className="hover:bg-neutral-focus">Tank</a>
              </Link>
            </li>
          </ul>
        </li>
        <li tabIndex={0}>
          <a className="hover:bg-neutral-focus">
            Fermentation
            <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
            </svg>
          </a>
          <ul className="dropdown-content rounded-box z-10 w-52 bg-neutral p-2 text-neutral-content shadow">
            <li>
              <Link href={'/fermentation/tipspeed'}>
                <a className="hover:bg-neutral-focus">Tip Speed</a>
              </Link>
            </li>
            <li>
              <Link href={'/fermentation/scaleup'}>
                <a className="hover:bg-neutral-focus">Scale Up</a>
              </Link>
            </li>
            <li>
              <Link href={'/fermentation/our'}>
                <a className="hover:bg-neutral-focus">Respiration</a>
              </Link>
            </li>
            <li>
              <Link href={'/fermentation/biokinetics'}>
                <a className="hover:bg-neutral-focus">Biokinetics</a>
              </Link>
            </li>
          </ul>
        </li>
        <li tabIndex={0}>
          <a className="hover:bg-neutral-focus">
            Controls
            <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
            </svg>
          </a>
          <ul className="dropdown-content rounded-box z-10 w-52 bg-neutral p-2 text-neutral-content shadow">
            <li>
              <Link href={'/controls/mA'}>
                <a className="hover:bg-neutral-focus">Analog Signals</a>
              </Link>
            </li>
          </ul>
        </li>

        <li tabIndex={0}>
          <a className="hover:bg-neutral-focus">
            Fluid Dynamics
            <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
            </svg>
          </a>
          <ul className="dropdown-content rounded-box z-10 w-52 bg-neutral p-2 text-neutral-content shadow">
            <li>
              <Link href={'/fluids/fluidflow'}>
                <a className="hover:bg-neutral-focus">Fluid Flow</a>
              </Link>
            </li>
            <li>
              <Link href={'/fluids/reynoldsnumber'}>
                <a className="hover:bg-neutral-focus">Reynolds Number</a>
              </Link>
            </li>
            <li>
              <Link href={'/fluids/pressuredrop'}>
                <a className="hover:bg-neutral-focus">Pressure Drop</a>
              </Link>
            </li>
            <li>
              <Link href={'/fluids/frictionfactor'}>
                <a className="hover:bg-neutral-focus">Friction Factor</a>
              </Link>
            </li>
            <li>
              <Link href={'/fluids/valveSizing'}>
                <a className="hover:bg-neutral-focus">Valve Sizing</a>
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  )
}

const MobileMenu = () => {
  return (
    <div className="navbar-start">
      <div className="dropdown">
        <label tabIndex={0} className="btn lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </label>
        {/* Mobile Menu */}
        <ul
          tabIndex={0}
          className="dropdown-content menu rounded-box menu-compact z-10 mt-3 w-52 bg-neutral p-2 text-neutral-content shadow"
        >
          <li>
            <Link href={'/conversion'}>
              <a className="hover:bg-neutral-focus">Unit Conversion</a>
            </Link>
          </li>
          <li tabIndex={0}>
            <a className="justify-between hover:bg-neutral-focus">
              Geometry
              <svg
                className="fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
              </svg>
            </a>
            <ul className="rounded-box bg-neutral p-2 text-neutral-content shadow">
              <li>
                <Link href={'/geometry/cylinder'}>
                  <a className="hover:bg-neutral-focus">Cylinder</a>
                </Link>
              </li>
              <li>
                <Link href={'/geometry/box'}>
                  <a className="hover:bg-neutral-focus">Box</a>
                </Link>
              </li>
              <li>
                <Link href={'/geometry/cone'}>
                  <a className="hover:bg-neutral-focus">Cone</a>
                </Link>
              </li>
              <li>
                <Link href={'/geometry/sphere'}>
                  <a className="hover:bg-neutral-focus">Sphere</a>
                </Link>
              </li>
              <li>
                <Link href={'/geometry/pyramid'}>
                  <a className="hover:bg-neutral-focus">Pyramid</a>
                </Link>
              </li>
              <li>
                <Link href={'/geometry/hemisphere'}>
                  <a className="hover:bg-neutral-focus">Hemisphere</a>
                </Link>
              </li>
              <li>
                <Link href={'/geometry/tank'}>
                  <a className="hover:bg-neutral-focus">Tank</a>
                </Link>
              </li>
            </ul>
          </li>
          <li tabIndex={0}>
            <a className="justify-between hover:bg-neutral-focus">
              Fermentation
              <svg
                className="fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
              </svg>
            </a>
            <ul className="rounded-box bg-neutral p-2 text-neutral-content shadow">
              <li>
                <Link href={'/fermentation/tipspeed'}>
                  <a className="hover:bg-neutral-focus">Tip Speed</a>
                </Link>
              </li>
              <li>
                <Link href={'/fermentation/scaleup'}>
                  <a className="hover:bg-neutral-focus">Scale Up</a>
                </Link>
              </li>
              <li>
                <Link href={'/fermentation/our'}>
                  <a className="hover:bg-neutral-focus">Respiration</a>
                </Link>
              </li>
              <li>
                <Link href={'/fermentation/biokinetics'}>
                  <a className="hover:bg-neutral-focus">Biokinetics</a>
                </Link>
              </li>
            </ul>
          </li>
          <li tabIndex={0}>
            <a className="justify-between hover:bg-neutral-focus">
              Controls
              <svg
                className="fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
              </svg>
            </a>
            <ul className="rounded-box bg-neutral p-2 text-neutral-content shadow">
              <li>
                <Link href={'/controls/mA'}>
                  <a className="hover:bg-neutral-focus">Analog Signals</a>
                </Link>
              </li>
            </ul>
          </li>
          <li tabIndex={0}>
            <a className="justify-between hover:bg-neutral-focus">
              Fluid Flow
              <svg
                className="fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
              </svg>
            </a>
            <ul className="rounded-box bg-neutral p-2 text-neutral-content shadow">
              <li>
                <Link href={'/fluids/fluidflow'}>
                  <a className="hover:bg-neutral-focus">Fluid Flow</a>
                </Link>
              </li>
              <li>
                <Link href={'/fluids/reynoldsnumber'}>
                  <a className="hover:bg-neutral-focus">Reynolds Number</a>
                </Link>
              </li>
              <li>
                <Link href={'/fluids/pressuredrop'}>
                  <a className="hover:bg-neutral-focus">Pressure Drop</a>
                </Link>
              </li>
              <li>
                <Link href={'/fluids/frictionfactor'}>
                  <a className="hover:bg-neutral-focus">Friction Factor</a>
                </Link>
              </li>
              <li>
                <Link href={'/fluids/valveSizing'}>
                  <a className="hover:bg-neutral-focus">Valve Sizing</a>
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <Link href={'/'}>
        <a className="btn text-xl normal-case">ChemE Calcs</a>
      </Link>
    </div>
  )
}
