import { useState, useRef } from 'react'
import { useRouter } from 'next/router'

const Search = () => {
  const pages = [
    { title: 'Box', href: '/geometry/box', location: 'geometry' },
    { title: 'Cone', href: '/geometry/cone', location: 'geometry' },
    { title: 'Cylinder', href: '/geometry/cylinder', location: 'geometry' },
    { title: 'Hemisphere', href: '/geometry/hemisphere', location: 'geometry' },
    { title: 'Pyramid', href: '/geometry/pyramid', location: 'geometry' },
    { title: 'Sphere', href: '/geometry/sphere', location: 'geometry' },
    { title: 'Unit Conversion', href: '/geometry/conversion', location: 'home' },
  ]

  const router = useRouter()
  const [query, setQuery] = useState('')
  const closeModalBtnRef = useRef<HTMLInputElement>(null)
  const queryInput = useRef<HTMLInputElement>(null)

  const filteredPages = query ? pages.filter(page => page.title.toLowerCase().includes(query.toLowerCase())) : pages

  const changePage = (href: string) => {
    router.push(href)
    closeModalBtnRef.current?.click()
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
            />
          </div>
          {query && filteredPages.length === 0 && <p className="px-4 pt-2 pb-6 text-sm">No results found</p>}
          {filteredPages.length > 0 && (
            <ul className="max-h-96 overflow-y-auto pb-4 text-sm">
              {filteredPages.map(page => {
                return (
                  <li className="cursor-pointer" onClick={() => changePage(page.href)}>
                    <div className="group space-x-1 px-4 py-2 hover:bg-primary">
                      <span className="font-bold group-hover:text-primary-content"> {page.title}</span>
                      <span className="text-base-content group-hover:text-primary-content">in {page.location}</span>
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
