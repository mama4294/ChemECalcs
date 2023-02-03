import Latex from 'react-latex'
import 'katex/dist/katex.min.css'

type Equation = {
  equation: string
}

export const Equation = ({ equation }: Equation) => {
  return (
    <div className="text-md my-2 flex justify-center">
      <Latex>{equation}</Latex>
    </div>
  )
}

export const InlineEquation = ({ equation }: Equation) => {
  return (
    <div className="text-md my-2 inline">
      <Latex>{equation}</Latex>
    </div>
  )
}

type VariableDefinition = {
  equation: string
  definition: string
}

export const VariableDefinition = ({ equation, definition }: VariableDefinition) => {
  return (
    <div className="badge badge-outline badge-lg mr-2 mb-2">
      <InlineEquation equation={equation} />
      <span className="ml-2">{definition}</span>
    </div>
  )
}
