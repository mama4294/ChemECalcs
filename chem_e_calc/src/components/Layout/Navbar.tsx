import Link from "next/link"

const Navbar = () =>{
    return(
        <header className="h-16 flex items-center justify-between bg-neutral">
            <ul className="flex gap-4">
                <Link href={"/"}><a className="link-accent">Home</a></Link>
                <Link href={"/about"}><a className="link-accent">About</a></Link>
            </ul>
        </header>
    )
}

export default Navbar