import { useState } from 'react'
import { convertUnits } from '../../../utils/units'
import { Breadcrumbs } from '../../components/calculators/breadcrumbs'
import { CalcBody } from '../../components/calculators/calcBody'
import { CalcCard } from '../../components/calculators/calcCard'
import { Calculator, InputType } from '../../components/calculators/calculator'
import { PageContainer } from '../../components/calculators/container'
import { CalcHeader } from '../../components/calculators/header'
import { Illustraion } from '../../components/calculators/illustration'
import { OnChangeValueProps } from '../../components/inputs/inputField'
import { IconBoxUnits } from '../../icons/IconBoxUnits'
import { IconContainer } from '../../icons/IconContainer'
import { handleChangeSolveSelection, updateAnswer, updateArray } from '../../logic/logic'

const Box = () => {
  const paths = [
    { title: 'Geometry', href: '/geometry' },
    { title: 'Box', href: '/geometry/box' },
  ]

  const [values, setValues] = useState<InputType[]>([
    {
      id: 1,
      name: 'width',
      unitType: 'length',
      type: 'number',
      placeholder: 'enter value',
      label: 'Width',
      displayValue: { value: 1, unit: 'ft' },
      calculatedValue: {
        value: convertUnits({ value: 1, fromUnit: 'ft', toUnit: 'm' }),
        unit: 'm',
      },
      solveable: true,
      selectiontext: 'Solve for Width',
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
      displayValue: { value: 1, unit: 'ft' },
      calculatedValue: {
        value: convertUnits({ value: 1, fromUnit: 'ft', toUnit: 'm' }),
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
      name: 'length',
      unitType: 'length',
      type: 'number',
      placeholder: 'enter value',
      label: 'Length',
      displayValue: { value: 1, unit: 'ft' },
      calculatedValue: {
        value: convertUnits({ value: 1, fromUnit: 'ft', toUnit: 'm' }),
        unit: 'm',
      },
      solveable: true,
      selectiontext: 'Solve for Length',
      equation: `h = \\frac{V}{\\pi (\\frac{d}{2})^{2}}`,
      selected: false,
      error: '',
    },
    {
      id: 4,
      name: 'volume',
      unitType: 'volume',
      type: 'number',
      placeholder: 'enter value',
      label: 'Volume',
      displayValue: { value: 1, unit: 'ft3' },
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
    if (solveSelection === 'height') return calcHeight(inputArray)
    if (solveSelection === 'width') return calcWidth(inputArray)
    if (solveSelection === 'length') return calcLength(inputArray)
    return []
  }

  const calcVolume = (inputArray: InputType[]) => {
    const widthObj = inputArray.find(o => o.name === 'width')
    const lengthObj = inputArray.find(o => o.name === 'length')
    const heightObj = inputArray.find(o => o.name === 'height')

    if (!widthObj || !heightObj || !lengthObj) {
      alert('inputs to calculator undefined')
      return null
    }

    const width = widthObj.calculatedValue.value
    const length = lengthObj.calculatedValue.value
    const height = heightObj.calculatedValue.value

    let answerValue = 0
    if (width !== 0 && height !== 0 && length !== 0) {
      answerValue = width * length * height
    }

    return updateAnswer(inputArray, answerValue, 'volume')
  }

  const calcHeight = (inputArray: InputType[]) => {
    const widthObj = inputArray.find(o => o.name === 'width')
    const lengthObj = inputArray.find(o => o.name === 'length')
    // const heightObj = inputArray.find(o => o.name === 'height')
    const volumeObj = inputArray.find(o => o.name === 'volume')

    if (!widthObj || !volumeObj || !lengthObj) {
      alert('inputs to calculator undefined')
      return null
    }

    const width = widthObj.calculatedValue.value
    const length = lengthObj.calculatedValue.value
    const volume = volumeObj.calculatedValue.value

    let answerValue = 0
    if (width !== 0 && volume !== 0 && length !== 0) {
      answerValue = volume / (width * length)
    }

    return updateAnswer(inputArray, answerValue, 'height')
  }

  const calcWidth = (inputArray: InputType[]) => {
    const volumeObj = inputArray.find(o => o.name === 'volume')
    const lengthObj = inputArray.find(o => o.name === 'length')
    const heightObj = inputArray.find(o => o.name === 'height')

    if (!heightObj || !volumeObj || !lengthObj) {
      alert('inputs to calculator undefined')
      return null
    }

    const height = heightObj.calculatedValue.value
    const length = lengthObj.calculatedValue.value
    const volume = volumeObj.calculatedValue.value

    let answerValue = 0
    if (height !== 0 && volume !== 0 && length !== 0) {
      answerValue = volume / (height * length)
    }

    return updateAnswer(inputArray, answerValue, 'width')
  }

  const calcLength = (inputArray: InputType[]) => {
    const widthObj = inputArray.find(o => o.name === 'width')
    const volumeObj = inputArray.find(o => o.name === 'volume')
    const heightObj = inputArray.find(o => o.name === 'height')

    if (!heightObj || !volumeObj || !widthObj) {
      alert('inputs to calculator undefined')
      return null
    }

    const height = heightObj.calculatedValue.value
    const width = widthObj.calculatedValue.value
    const volume = volumeObj.calculatedValue.value

    let answerValue = 0
    if (height !== 0 && volume !== 0 && width !== 0) {
      answerValue = volume / (height * width)
    }

    return updateAnswer(inputArray, answerValue, 'length')
  }

  return (
    <PageContainer>
      <Breadcrumbs paths={paths} />
      <CalcHeader title={'Box'} text={'This calculates the volume of a box'} />
      <CalcBody>
        <Calculator
          title="Calculator"
          values={values}
          onChangeSolveSelection={onChangeSolveSelection}
          onChangeValue={onChangeValue}
        />
        <CalcCard title="Box">
          <IconContainer>
            <IconBoxUnits />
          </IconContainer>

          {/* <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" className="fill-base-100 stroke-base-content">
            <rect
              x="39.698"
              y="106.239"
              width="314.617"
              height="318.944"
              fill="inherit"
              stroke="inherit"
              strokeWidth="2px"
            ></rect>
            <path
              fill="inherit"
              stroke="inherit"
              strokeWidth="2px"
              d="M 41.454 106.313 L 185.888 36.277 L 436.375 39.051 L 354.965 106.006"
            ></path>
            <path
              fill="inherit"
              stroke="inherit"
              strokeWidth="2px"
              d="M 354.753 107.694 L 354.419 425.163 L 435.005 345.789 L 435.885 40.331"
            ></path>
            <text
              fontSize="20px"
              fill="inherit"
              stroke="inherit"
              //   style="white-space: pre; fill: rgb(51, 51, 51); font-family: Arial, sans-serif; font-size: 19.5px;"
              x="212.879"
              y="391.758"
              transform="matrix(1.534268, 0, 0, 1.543303, -143.541901, -139.016495)"
            >
              W
            </text>
            <text
              fontSize="20px"
              fill="inherit"
              stroke="inherit"
              //   style="white-space: pre; fill: rgb(51, 51, 51); font-family: Arial, sans-serif; font-size: 19.5px;"
              x="355.98"
              y="362.195"
              transform="matrix(1.534268, 0, 0, 1.543303, -143.541901, -139.016495)"
            >
              L
            </text>
            <text
              fontSize="20px"
              fill="inherit"
              stroke="inherit"
              //   style="white-space: pre; fill: rgb(51, 51, 51); font-family: Arial, sans-serif; font-size: 19.5px;"
              x="425.746"
              y="387.389"
              transform="matrix(1.534268, 0, 0, 1.543303, -206.010208, -392.808075)"
            >
              H
              <tspan x="425.7460021972656" dy="1em">
                ​
              </tspan>
            </text>
          </svg> */}
        </CalcCard>
      </CalcBody>
    </PageContainer>
  )
}

export default Box
