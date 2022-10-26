import Link from 'next/link'
import { useContext, useState } from 'react'
import { convertUnits } from '../../utils/units'
import { Breadcrumbs } from '../../components/calculators/breadcrumbs'
import { CalcBody } from '../../components/calculators/calcBody'
import { CalcCard } from '../../components/calculators/calcCard'
import { Calculator, InputType } from '../../components/calculators/calculator'
import { CodeContainer } from '../../components/calculators/codeCard'
import { PageContainer } from '../../components/calculators/container'
import { CalcHeader } from '../../components/calculators/header'
import { Illustraion } from '../../components/calculators/illustration'
import { OnChangeValueProps } from '../../components/inputs/inputField'
import { IconBox } from '../../icons/IconBox'
import { IconContainer } from '../../icons/IconContainer'
import { IconCylinderUnits } from '../../icons/iconCylinderUnits'
import { handleChangeSolveSelection, updateAnswer, updateArray, validateNotBlank } from '../../logic/logic'
import { DefaultUnitContext, DefaultUnitContextType } from '../../contexts/defaultUnitContext'

const Geometry = () => {
  const { defaultUnits } = useContext(DefaultUnitContext) as DefaultUnitContextType
  const [values, setValues] = useState<InputType[]>([
    {
      id: 1,
      name: 'diameter',
      unitType: 'length',
      type: 'number',
      placeholder: 'Enter value',
      label: 'Diameter',
      displayValue: { value: 1, unit: defaultUnits.length },
      calculatedValue: {
        value: convertUnits({ value: 1, fromUnit: defaultUnits.length, toUnit: 'm' }),
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
      placeholder: 'Enter value',
      label: 'Height',
      displayValue: { value: 1, unit: defaultUnits.length },
      calculatedValue: {
        value: convertUnits({ value: 1, fromUnit: defaultUnits.length, toUnit: 'm' }),
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
      placeholder: 'Enter value',
      label: 'Volume',
      displayValue: { value: 22.24, unit: defaultUnits.volume },
      calculatedValue: {
        value: convertUnits({ value: 22.24, fromUnit: defaultUnits.volume, toUnit: 'm3' }),
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
    const validatedArr = validateNotBlank(answerArr)
    if (validatedArr) {
      setValues(validatedArr)
    } else {
      setValues(updatedArr)
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
        <CalcBody>
          <Calculator
            title="Calculator"
            values={values}
            onChangeSolveSelection={onChangeSolveSelection}
            onChangeValue={onChangeValue}
          />
          <CalcCard title="Cylinder">
            <IconContainer>
              <IconCylinderUnits />
            </IconContainer>
          </CalcCard>
          <CodeContainer equation={equation} />
        </CalcBody>
      </>
    </PageContainer>
  )
}

export default Geometry
