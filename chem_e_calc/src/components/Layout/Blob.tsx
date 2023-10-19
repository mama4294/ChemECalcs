export const Blob = () => {
  return (
    <>
      <div className="absolute top-5 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform animate-blob rounded-full bg-accent opacity-25 mix-blend-multiply blur-2xl filter  " />
      <div className="animation-delay-2000 absolute top-5 left-1/4 -z-10 h-96 w-96 -translate-x-1/4 -translate-y-1/2 animate-blob rounded-full bg-secondary opacity-25 mix-blend-multiply blur-2xl filter " />
      <div className="animation-delay-4000 absolute  -left-1/4  -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/4 animate-blob rounded-full bg-primary opacity-25 mix-blend-multiply blur-2xl filter" />
    </>
  )
}
