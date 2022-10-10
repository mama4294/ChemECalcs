import Link from 'next/link'

type Path = {
  title: string
  href: string
}

type Breadcrumbs = {
  paths: Path[]
}

export const Breadcrumbs = ({ paths }: Breadcrumbs) => {
  return (
    <div className="breadcrumbs text-sm">
      <ul>
        <li>
          <Link href={'/'}>
            <a>Home</a>
          </Link>
        </li>

        {paths.map((path, index) => {
          return (
            <li key={index}>
              <Link href={path.href}>
                <a>{path.title}</a>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
