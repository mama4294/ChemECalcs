let Latex = require('react-latex')
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
    <div>
      <InlineEquation equation={equation} />
      <span className="ml-2">{definition}</span>
    </div>
  )
}
