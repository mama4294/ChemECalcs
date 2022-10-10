export const CalcHeader = ({ title, text }: { title: string; text: string }) => {
  return (
    <div className="mt-4 mb-8">
      <h1 className="text-2xl">{title}</h1>
      <p>{text}</p>
    </div>
  )
}
