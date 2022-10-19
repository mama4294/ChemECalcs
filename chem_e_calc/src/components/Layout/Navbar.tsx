import Link from 'next/link'
import { DefaultUnits } from './DefaultUnits'
import Search from './Search'

const Navbar = () => {
  return (
    <div className="navbar bg-neutral">
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
              </ul>
            </li>
            <li>
              <Link href={'/fluidflow'}>
                <a className="hover:bg-neutral-focus">Fluid Flow</a>
              </Link>
            </li>
          </ul>
        </div>
        <Link href={'/'}>
          <a className="btn text-xl normal-case">ChemE Calcs</a>
        </Link>
      </div>
      {/* Desktop Menu */}
      <div className="navbar-center hidden text-neutral-content lg:flex">
        <ul className="menu menu-horizontal p-0 ">
          <li>
            <Link href={'/conversion'}>
              <a className="hover:bg-neutral-focus">Unit Conversion</a>
            </Link>
          </li>
          <li tabIndex={0}>
            <a className="hover:bg-neutral-focus">
              Geometry
              <svg
                className="fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
              </svg>
            </a>
            <ul className="dropdown-content rounded-box z-10 w-52 bg-neutral p-2 text-neutral-content shadow">
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
            </ul>
          </li>
          <li>
            <Link href={'/fluidflow'}>
              <a className="hover:bg-neutral-focus">Fluid Flow</a>
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <Search />
        <DefaultUnits />
      </div>
    </div>
  )
}

export default Navbar
