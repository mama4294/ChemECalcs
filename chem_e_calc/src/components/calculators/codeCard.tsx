import { CalcCard } from './calcCard'
import MathJax from 'react-mathjax'
// const MathJax = require('react-mathjax')

export const CodeContainer = () => {
  const equation = `V = \\pi \\frac{d}{2}^{2}h`

  return (
    <CalcCard title="Equation">
      <MathJax.Provider>
        <div>
          <MathJax.Node formula={equation} />
        </div>
      </MathJax.Provider>
    </CalcCard>
  )
}
