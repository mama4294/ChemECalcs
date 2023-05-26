import { useState, useRef } from 'react'
import { useRouter } from 'next/router'

const Search = () => {
  const pages = [
    { id: 0, title: 'Box', href: '/geometry/box', location: 'geometry' },
    { id: 1, title: 'Cone', href: '/geometry/cone', location: 'geometry' },
    { id: 2, title: 'Cylinder', href: '/geometry/cylinder', location: 'geometry' },
    { id: 3, title: 'Hemisphere', href: '/geometry/hemisphere', location: 'geometry' },
    { id: 4, title: 'Pyramid', href: '/geometry/pyramid', location: 'geometry' },
    { id: 5, title: 'Sphere', href: '/geometry/sphere', location: 'geometry' },
    { id: 6, title: 'Unit Conversion', href: '/conversion', location: 'home' },
    { id: 7, title: 'Fluid Flow', href: '/fluids/fluidflow', location: 'fluid dynamics' },
    { id: 8, title: 'Scale Up', href: '/fermentation/scaleup', location: 'fermentation' },
    { id: 9, title: 'Tip Speed', href: '/fermentation/tipspeed', location: 'fermentation' },
    { id: 10, title: 'Tanks', href: '/geometry/tank', location: 'geometry' },
    { id: 11, title: 'Pressure Drop', href: '/fluids/pressuredrop', location: 'fluid dynamics' },
    { id: 12, title: 'Reynolds Number', href: '/fluids/reynoldsnumber', location: 'fluid dynamics' },
    { id: 13, title: 'Friction Factor', href: '/fluids/frictionfactor', location: 'fluid dynamics' },
    { id: 14, title: '4-20mA Signals', href: '/controls/mA', location: 'controls' },
    { id: 15, title: 'Valve Sizing', href: '/fluids/valveSizing', location: 'fluid dynamics' },
    { id: 16, title: 'Oxygen Uptake Rate', href: '/fermentation/our', location: 'fermentation' },
  ]

  const router = useRouter()
  const [query, setQuery] = useState('')
  const closeModalBtnRef = useRef<HTMLInputElement>(null)
  const queryInput = useRef<HTMLInputElement>(null)

  const filteredPages = query ? pages.filter(page => page.title.toLowerCase().includes(query.toLowerCase())) : pages
  const [selectedNum, setSelectedNum] = useState(0)

  const changePage = (href: string | undefined) => {
    if (href) {
      router.push(href)
      closeModalBtnRef.current?.click()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedNum(selectedNum === filteredPages.length - 1 ? 0 : selectedNum + 1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedNum(selectedNum === 0 ? filteredPages.length - 1 : selectedNum - 1)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      changePage(filteredPages[selectedNum]?.href)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      closeModalBtnRef.current?.click()
    }
  }

  return (
    <>
      {/* Button to open modal */}
      <label htmlFor="search-modal" className="modal-button btn btn-circle">
        <SearchIcon />
      </label>

      {/* Modal */}
      <input
        type="checkbox"
        id="search-modal"
        className="modal-toggle"
        ref={closeModalBtnRef}
        onClick={() => queryInput.current?.focus()}
      />
      <label htmlFor="search-modal" className="modal cursor-pointer ">
        <label className="modal-box relative p-0 ring-1 ring-black/5" htmlFor="">
          <div className="flex items-center p-4">
            <SearchIcon />
            <input
              type="text"
              ref={queryInput}
              placeholder="Search..."
              className="input w-full border-0 bg-transparent focus:outline-0 focus:ring-0"
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          {query && filteredPages.length === 0 && <p className="px-4 pt-2 pb-6 text-sm">No results found</p>}
          {filteredPages.length > 0 && (
            <ul className="max-h-96 overflow-y-auto pb-4 text-sm">
              {filteredPages.map((page, index) => {
                const hovered = selectedNum === index
                return (
                  <li
                    key={page.href}
                    className="cursor-pointer"
                    onClick={() => changePage(page.href)}
                    onMouseOver={() => setSelectedNum(index)}
                  >
                    <div className={`group space-x-1 px-4 py-2 ${hovered ? 'bg-primary text-primary-content' : ''}`}>
                      <span className="font-bold"> {page.title}</span>
                      <span className="">in {page.location}</span>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </label>
      </label>
    </>
  )
}

const SearchIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  )
}

export default Search
