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
import { IconConeUnits } from '../../icons/iconConeUnits'
import { IconContainer } from '../../icons/IconContainer'
import { handleChangeSolveSelection, updateAnswer, updateArray } from '../../logic/logic'

const Cone = () => {
  const paths = [
    { title: 'Geometry', href: '/geometry' },
    { title: 'Cone', href: '/geometry/cone' },
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
      name: 'volume',
      unitType: 'volume',
      type: 'number',
      placeholder: 'enter value',
      label: 'Volume',
      displayValue: { value: 0.26, unit: 'ft3' },
      calculatedValue: {
        value: convertUnits({ value: 0.26, fromUnit: 'ft3', toUnit: 'm3' }),
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
    if (solveSelection === 'height') return calcHeight(inputArray)
    return []
  }

  const calcHeight = (inputArray: InputType[]) => {
    const diameterObj = inputArray.find(o => o.name === 'diameter')
    const volumeObj = inputArray.find(o => o.name === 'volume')

    if (!volumeObj || !diameterObj) {
      alert('inputs to calculator undefined')
      return null
    }

    const diameter = diameterObj.calculatedValue.value
    const volume = volumeObj.calculatedValue.value

    let answerValue = 0
    if (diameter !== 0 && volume !== 0) {
      answerValue = (volume * 3) / (Math.PI * (diameter / 2) ** 2)
    }

    return updateAnswer(inputArray, answerValue, 'height')
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
    if (diameter !== 0 && diameter !== 0) {
      answerValue = (Math.PI * (diameter / 2) ** 2 * height) / 3
    }

    return updateAnswer(inputArray, answerValue, 'volume')
  }

  const calcDiameter = (inputArray: InputType[]) => {
    const volumeObj = inputArray.find(o => o.name === 'volume')
    const heightObj = inputArray.find(o => o.name === 'height')

    if (!heightObj || !volumeObj) {
      alert('inputs to calculator undefined')
      return null
    }

    const height = heightObj.calculatedValue.value
    const volume = volumeObj.calculatedValue.value

    let answerValue = 0
    if (height !== 0 && volume !== 0) {
      answerValue = 2 * Math.sqrt((volume * 3) / (height * Math.PI))
    }

    return updateAnswer(inputArray, answerValue, 'diameter')
  }

  return (
    <PageContainer>
      <Breadcrumbs paths={paths} />
      <CalcHeader title={'Cone'} text={'This calculates the volume of a cone'} />
      <CalcBody>
        <Calculator
          title="Calculator"
          values={values}
          onChangeSolveSelection={onChangeSolveSelection}
          onChangeValue={onChangeValue}
        />
        <CalcCard title="Cone">
          <IconContainer>
            <IconConeUnits />
          </IconContainer>
        </CalcCard>
      </CalcBody>
    </PageContainer>
  )
}

export default Cone
