const Footer = () => {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="footer flex h-16 w-full items-center justify-between bg-neutral px-4 text-xs text-neutral-content sm:text-sm">
      <div>Matthew Malone</div>
      <div className="flex">
        <p>Copyright © {currentYear}</p>
        <p>All right reserved</p>
      </div>
    </footer>
  )
}

export default Footer
