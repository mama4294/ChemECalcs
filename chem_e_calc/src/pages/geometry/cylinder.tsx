import Link from 'next/link'
import { useState } from 'react'
import { convertUnits, roundTo2 } from '../../../utils/units'
import { CalculatorContainer, InputType } from '../../components/calculators/calculatorContainer'
import { CodeContainer } from '../../components/calculators/codeCard'
import { Illustraion } from '../../components/calculators/illustration'
import { OnChangeValueProps } from '../../components/inputs/inputField'

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
    const newArr = values.map(o => {
      if (o.id === id) return { ...o, selected: true }
      else return { ...o, selected: false }
    })
    setValues(newArr)
  }

  const onChangeValue = ({ id, unit, number }: OnChangeValueProps): void => {
    //create a new values array with changed value

    const updateArray = () => {
      if (unit) {
        return values.map(o => {
          if (o.id === id) {
            const convertedValue = convertUnits({
              value: o.displayValue.value,
              fromUnit: unit,
              toUnit: o.calculatedValue.unit,
            })
            return {
              ...o,
              displayValue: { value: o.displayValue.value, unit: unit },
              calculatedValue: {
                value: convertedValue,
                unit: o.calculatedValue.unit,
              },
            }
          } else return o
        })
      }
      if (number) {
        return values.map(o => {
          if (o.id === id) {
            const convertedValue = convertUnits({
              value: number,
              fromUnit: o.displayValue.unit,
              toUnit: o.calculatedValue.unit,
            })
            return {
              ...o,
              displayValue: { value: number, unit: o.displayValue.unit },
              calculatedValue: {
                value: convertedValue,
                unit: o.calculatedValue.unit,
              },
            }
          } else return o
        })
      }
      return values
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

    //Update array with new input
    const updatedArr = updateArray()

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

  const updateAnswer = (inputArray: InputType[], answerValue: number, answerName: string) => {
    return inputArray.map(o => {
      //convert calculed value to display value
      if (o.name === answerName) {
        const displayValue = convertUnits({
          value: answerValue,
          fromUnit: o.calculatedValue.unit,
          toUnit: o.displayValue.unit,
        })
        return {
          ...o,
          displayValue: {
            value: roundTo2(displayValue),
            unit: o.displayValue.unit,
          },
          calculatedValue: { value: answerValue, unit: o.calculatedValue.unit },
        }
      } else return o
    })
  }

  const equation = values.find(item => item.selected === true)?.equation || ''

  return (
    <div className="mx-auto mb-24 max-w-xs md:max-w-2xl lg:max-w-4xl 2xl:max-w-6xl">
      {/* Breadcrumbs */}
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link href={'/'}>
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link href={'/geometry'}>
              <a>Geometry</a>
            </Link>
          </li>
          <li>
            <Link href={'/geometry/cylinder'}>
              <a>Cylinder</a>
            </Link>
          </li>
        </ul>
      </div>

      {/* Page Title */}
      <div className="mt-4 mb-8">
        <h1 className="text-2xl">Cylinder</h1>
        <p>This calculates the volume of a cylinder</p>
      </div>

      {/* Calculator */}
      <div className="flex flex-wrap gap-8">
        <CalculatorContainer
          title="Calculator"
          values={values}
          onChangeSolveSelection={onChangeSolveSelection}
          onChangeValue={onChangeValue}
        />
        <Illustraion />
        <CodeContainer equation={equation} />
      </div>
    </div>
  )
}

export default Geometry
