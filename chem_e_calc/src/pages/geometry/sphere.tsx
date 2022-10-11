import { useState } from 'react'
import { convertUnits } from '../../../utils/units'
import { Breadcrumbs } from '../../components/calculators/breadcrumbs'
import { CalcBody } from '../../components/calculators/calcBody'
import { Calculator, InputType } from '../../components/calculators/calculator'
import { PageContainer } from '../../components/calculators/container'
import { CalcHeader } from '../../components/calculators/header'
import { OnChangeValueProps } from '../../components/inputs/inputField'
import { handleChangeSolveSelection, updateAnswer, updateArray } from '../../logic/logic'

const Sphere = () => {
  const paths = [
    { title: 'Geometry', href: '/geometry' },
    { title: 'Sphere', href: '/geometry/sphere' },
  ]

  const [values, setValues] = useState<InputType[]>([
    {
      id: 1,
      name: 'diameter',
      unitType: 'length',
      type: 'number',
      placeholder: 'enter value',
      label: 'Diameter',
      displayValue: { value: 1, unit: 'ft' },
      calculatedValue: {
        value: convertUnits({ value: 1, fromUnit: 'ft', toUnit: 'm' }),
        unit: 'm',
      },
      solveable: true,
      selectiontext: 'Solve for Diameter',
      equation: `d = 2 \\sqrt{\\frac{V}{\\pi*h}}`,
      selected: false,
      error: '',
    },
    {
      id: 2,
      name: 'volume',
      unitType: 'volume',
      type: 'number',
      placeholder: 'enter value',
      label: 'Volume',
      displayValue: { value: 14.83, unit: 'l' },
      calculatedValue: {
        value: convertUnits({ value: 14.83, fromUnit: 'l', toUnit: 'm3' }),
        unit: 'm3',
      },
      solveable: true,
      selectiontext: 'Solve for Volume',
      equation: `V = \\pi (\\frac{d}{2})^{2}h`,
      selected: true,
      error: '',
    },
  ])

  const onChangeSolveSelection = (id: number): void => {
    const newArr = handleChangeSolveSelection({ id: id, array: values })
    setValues(newArr)
  }

  const onChangeValue = ({ id, unit, number }: OnChangeValueProps): void => {
    //create a new values array with changed value
    //Update array with new input
    const updatedArr = updateArray({ id, number, unit, array: values })

    //Set answer
    const answerArr = calculateAnswer(updatedArr)
    if (answerArr) {
      setValues(answerArr)
    } else {
      setValues(updatedArr)
    }
  }

  const calculateAnswer = (inputArray: InputType[]) => {
    const solveSelection = inputArray.find(o => o.selected === true)?.name
    if (!solveSelection) return []
    if (solveSelection === 'volume') return calcVolume(inputArray)
    if (solveSelection === 'diameter') return calcDiameter(inputArray)
    return []
  }

  const calcVolume = (inputArray: InputType[]) => {
    const diameterObj = inputArray.find(o => o.name === 'diameter')

    if (!diameterObj) {
      alert('inputs to calculator undefined')
      return null
    }

    const diameter = diameterObj.calculatedValue.value

    let answerValue = 0
    if (diameter !== 0) {
      answerValue = (4 / 3) * Math.PI * (diameter / 2) ** 3
    }

    return updateAnswer(inputArray, answerValue, 'volume')
  }

  const calcDiameter = (inputArray: InputType[]) => {
    const volumeObj = inputArray.find(o => o.name === 'volume')

    if (!volumeObj) {
      alert('inputs to calculator undefined')
      return null
    }

    const volume = volumeObj.calculatedValue.value

    let answerValue = 0
    if (volume !== 0) {
      answerValue = 2 * (volume / ((4 / 3) * Math.PI)) ** (1 / 3)
    }

    return updateAnswer(inputArray, answerValue, 'diameter')
  }

  return (
    <PageContainer>
      <Breadcrumbs paths={paths} />
      <CalcHeader title={'Sphere'} text={'This calculates the volume of a sphere'} />
      <CalcBody>
        <Calculator
          title="Calculator"
          values={values}
          onChangeSolveSelection={onChangeSolveSelection}
          onChangeValue={onChangeValue}
        />
      </CalcBody>
    </PageContainer>
  )
}

export default Sphere
