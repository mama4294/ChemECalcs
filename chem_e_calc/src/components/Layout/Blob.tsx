type Props = {
  children?: React.ReactNode
}

export const Blob = ({ children }: Props) => {
  return (
    <>
      <div className="absolute top-0 -left-4 -z-10 h-72 w-72 animate-blob rounded-full bg-purple-300 opacity-70 mix-blend-multiply blur-xl filter " />
      <div className="absolute top-0 -right-4 -z-10 h-72 w-72 animate-blob rounded-full bg-yellow-300 opacity-70 mix-blend-multiply blur-xl filter" />
      <div className="absolute left-24 top-8 -z-10 h-72 w-72 animate-blob rounded-full bg-pink-300 opacity-70 mix-blend-multiply blur-xl filter" />
    </>
  )
}
