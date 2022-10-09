import { CalcCard } from './calcCard'
import MathJax from 'react-mathjax'
// const MathJax = require('react-mathjax')

export const CodeContainer = ({ equation }: { equation: string }) => {
  return (
    <CalcCard title="Equation">
      <MathJax.Provider>
        <div>
          <MathJax.Node formula={equation} />
          <p>Where:</p>
          <p>
            <MathJax.Node inline formula={`V`} /> = Volume
          </p>
          <p>
            <MathJax.Node inline formula={`d`} /> = Diameter
          </p>
          <p>
            <MathJax.Node inline formula={`h`} /> = Height
          </p>
        </div>
      </MathJax.Provider>
    </CalcCard>
  )
}
