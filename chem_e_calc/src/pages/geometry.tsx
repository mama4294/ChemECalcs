import Link from 'next/link'
import { useState, useEffect } from 'react'
import { units, Units, convertUnits, roundTo2 } from '../../utils/units'
import { CalcCard } from '../components/calculators/calcCard'
import { CodeContainer } from '../components/calculators/codeCard'

type OnChangeValueProps = {
  id: number
  unit?: string
  number?: number
}

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
              <a>Geomentry</a>
            </Link>
          </li>
        </ul>
      </div>

      {/* Page Title */}
      <div className="mt-4 mb-8">
        <h1 className="text-2xl">Geometry</h1>
        <p>This calculates the volume of geometric shapes with various units</p>
      </div>

      {/* Calculator */}
      <div className="flex flex-wrap gap-8">
        <CalculatorContainer
          title="Cylinder"
          values={values}
          onChangeSolveSelection={onChangeSolveSelection}
          onChangeValue={onChangeValue}
        />
        <CodeContainer equation={equation} />
        <CalcCard title="Illustraion"> </CalcCard>
      </div>
    </div>
  )
}

export default Geometry

type CalcContainerProps = {
  title: string
  values: InputType[]
  onChangeSolveSelection: (id: number) => void
  onChangeValue: ({ id, unit, number }: OnChangeValueProps) => void
}

const CalculatorContainer = ({ title, values, onChangeSolveSelection, onChangeValue }: CalcContainerProps) => {
  return (
    <CalcCard title={title}>
      <>
        <SolveForDropdown options={values} onChange={onChangeSolveSelection} />
        <div className="mb-8 flex flex-col">
          {values.map(input => {
            return <InputField key={input.id} data={input} onChangeValue={onChangeValue} />
          })}
        </div>
      </>
    </CalcCard>
  )
}

type InputFieldProps = {
  data: InputType
  onChangeValue: ({ id, unit, number }: OnChangeValueProps) => void
}

const InputField = ({ data, onChangeValue }: InputFieldProps) => {
  const { id, label, placeholder, type, selected, displayValue, unitType, error } = data
  const { value, unit } = displayValue

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <label className="input-group">
        <input
          className={`input input-bordered w-full text-base-content ${
            error ? 'input-error text-error' : ' text-base-content'
          } disabled:cursor-text disabled:bg-base-300 disabled:text-base-content`}
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={selected}
          onChange={e => onChangeValue({ id, number: Number(e.target.value) })}
        />
        <select
          className={`select select-bordered bg-base-200 ${error ? 'select-error text-error' : ' text-base-content'}`}
          value={unit}
          onChange={e => onChangeValue({ id, unit: e.target.value })}
        >
          {units[unitType as keyof Units].map((unitOption: string, index) => {
            return <option key={index}>{unitOption}</option>
          })}
        </select>
      </label>
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  )
}

type InputType = {
  id: number
  name: string
  unitType: string
  type: string
  placeholder: string
  label: string
  displayValue: { value: number; unit: string }
  calculatedValue: { value: number; unit: string }
  solveable: boolean
  selectiontext: string
  equation: string
  selected: boolean
  error: string
}

type SolveForProps = {
  options: InputType[]
  onChange: (id: number) => void
}

const SolveForDropdown = ({ options, onChange }: SolveForProps) => {
  const selectedValueId = options.find(option => option.selected === true)?.id

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">Solve for</span>
      </label>
      <select
        className="select input-bordered w-full bg-base-200 text-base-content"
        value={selectedValueId}
        onChange={e => onChange(Number(e.target.value))}
      >
        {options.map(option => {
          if (option.solveable)
            return (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            )
        })}
      </select>
    </div>
  )
}
