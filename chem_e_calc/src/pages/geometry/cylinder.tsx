import Link from 'next/link'
import { useState } from 'react'
import { convertUnits, roundTo2 } from '../../../utils/units'
import { Breadcrumbs } from '../../components/calculators/breadcrumbs'
import { Calculator, InputType } from '../../components/calculators/calculator'
import { CodeContainer } from '../../components/calculators/codeCard'
import { PageContainer } from '../../components/calculators/container'
import { CalcHeader } from '../../components/calculators/header'
import { Illustraion } from '../../components/calculators/illustration'
import { OnChangeValueProps } from '../../components/inputs/inputField'
import { handleChangeSolveSelection, updateAnswer, updateArray } from '../../logic/logic'

const Geometry = () => {
  const [values, setValues] = useState<InputType[]>([
    {
      id: 1,
      name: 'diameter',
      unitType: 'length',
      type: 'number',
      placeholder: 'enter value',
      label: 'Diameter',
      displayValue: { value: 68, unit: 'ft' },
      calculatedValue: {
        value: convertUnits({ value: 68, fromUnit: 'ft', toUnit: 'm' }),
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
      name: 'height',
      unitType: 'length',
      type: 'number',
      placeholder: 'enter value',
      label: 'Height',
      displayValue: { value: 68, unit: 'ft' },
      calculatedValue: {
        value: convertUnits({ value: 68, fromUnit: 'ft', toUnit: 'm' }),
        unit: 'm',
      },
      solveable: true,
      selectiontext: 'Solve for Height',
      equation: `h = \\frac{V}{\\pi (\\frac{d}{2})^{2}}`,
      selected: false,
      error: '',
    },
    {
      id: 3,
      name: 'volume',
      unitType: 'volume',
      type: 'number',
      placeholder: 'enter value',
      label: 'Volume',
      displayValue: { value: 682, unit: 'gal' },
      calculatedValue: {
        value: convertUnits({ value: 682, fromUnit: 'gal', toUnit: 'm3' }),
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

    //Validate new array
    const validatedArr = validate(updatedArr)

    //Set answer
    const answerArr = calculateAnswer(validatedArr)
    if (answerArr) {
      setValues(answerArr)
    } else {
      setValues(validatedArr)
    }
  }

  const validate = (inputArray: InputType[]): InputType[] => {
    let errors: { id: number; error: string }[] = []
    let validatedArray = inputArray.map(o => {
      return { ...o, error: '' }
    })

    //   const diameterObj = inputArray.find(o => o.name === 'diameter')
    //   const heightObj = inputArray.find(o => o.name === 'height')

    //   if (!diameterObj || !heightObj) {
    //     alert('validation failed')
    //     return inputArray
    //   }

    //   const diameter = diameterObj.calculatedValue.value
    //   const height = heightObj.calculatedValue.value

    //   //validation rules
    //   if (diameter < height) {
    //     errors.push({ id: diameterObj.id, error: 'Diameter must be larger than Height' })
    //   }

    //Add errors to validated array
    return validatedArray.map(o => {
      const errorObj = errors.find(e => e.id === o.id)
      if (errorObj) return { ...o, error: errorObj.error }
      else return o
    })
  }

  const calculateAnswer = (inputArray: InputType[]) => {
    const solveSelection = inputArray.find(o => o.selected === true)?.name
    if (!solveSelection) return []
    if (solveSelection === 'volume') return calcVolume(inputArray)
    if (solveSelection === 'height') return calcHeight(inputArray)
    if (solveSelection === 'diameter') return calcDiameter(inputArray)
    return []
  }

  const calcVolume = (inputArray: InputType[]) => {
    const diameterObj = inputArray.find(o => o.name === 'diameter')
    const heightObj = inputArray.find(o => o.name === 'height')

    if (!diameterObj || !heightObj) {
      alert('inputs to calculator undefined')
      return null
    }

    const diameter = diameterObj.calculatedValue.value
    const height = heightObj.calculatedValue.value

    let answerValue = 0
    if (diameter !== 0 && height !== 0) {
      answerValue = Math.PI * (diameter / 2) ** 2 * height
    }

    return updateAnswer(inputArray, answerValue, 'volume')
  }

  const calcHeight = (inputArray: InputType[]) => {
    const diameterObj = inputArray.find(o => o.name === 'diameter')
    const volumeObj = inputArray.find(o => o.name === 'volume')

    if (!diameterObj || !volumeObj) {
      alert('inputs to calculator undefined')
      return null
    }

    const diameter = diameterObj.calculatedValue.value
    const volume = volumeObj.calculatedValue.value

    let answerValue = 0
    if (diameter !== 0 && volume !== 0) {
      answerValue = volume / (Math.PI * (diameter / 2) ** 2)
    }

    return updateAnswer(inputArray, answerValue, 'height')
  }

  const calcDiameter = (inputArray: InputType[]) => {
    const heightObj = inputArray.find(o => o.name === 'height')
    const volumeObj = inputArray.find(o => o.name === 'volume')

    if (!heightObj || !volumeObj) {
      alert('inputs to calculator undefined')
      return null
    }

    const volume = volumeObj.calculatedValue.value
    const height = heightObj.calculatedValue.value

    let answerValue = 0
    if (volume !== 0 && height !== 0) {
      answerValue = 2 * Math.sqrt(volume / (Math.PI * height))
    }

    return updateAnswer(inputArray, answerValue, 'diameter')
  }

  const equation = values.find(item => item.selected === true)?.equation || ''

  const paths = [
    { title: 'Geometry', href: '/geometry' },
    { title: 'Cylinder', href: '/geometry/cylinder' },
  ]

  return (
    <PageContainer>
      <>
        <Breadcrumbs paths={paths} />
        <CalcHeader title={'Cylinder'} text={'This calculates the volume of a cylinder'} />

        {/* Calculator */}
        <div className="flex flex-wrap gap-8">
          <Calculator
            title="Calculator"
            values={values}
            onChangeSolveSelection={onChangeSolveSelection}
            onChangeValue={onChangeValue}
          />
          <Illustraion />
          <CodeContainer equation={equation} />
        </div>
      </>
    </PageContainer>
  )
}

export default Geometry
