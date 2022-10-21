import { useContext, useState } from 'react'
import { convertUnits } from '../../utils/units'
import { Breadcrumbs } from '../../components/calculators/breadcrumbs'
import { CalcBody } from '../../components/calculators/calcBody'
import { CalcCard } from '../../components/calculators/calcCard'
import { Calculator, InputType } from '../../components/calculators/calculator'
import { PageContainer } from '../../components/calculators/container'
import { CalcHeader } from '../../components/calculators/header'
import { OnChangeValueProps } from '../../components/inputs/inputField'
import { IconContainer } from '../../icons/IconContainer'
import { IconHemisphereUnits } from '../../icons/iconHemiphereUnits'
import { handleChangeSolveSelection, updateAnswer, updateArray, validateNotBlank } from '../../logic/logic'
import { DefaultUnitContext, DefaultUnitContextType } from '../../contexts/defaultUnitContext'

const Hemisphere = () => {
  const { defaultUnits } = useContext(DefaultUnitContext) as DefaultUnitContextType
  const paths = [
    { title: 'Geometry', href: '/geometry' },
    { title: 'Sphere', href: '/geometry/hemisphere' },
  ]

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
      name: 'volume',
      unitType: 'volume',
      type: 'number',
      placeholder: 'Enter value',
      label: 'Volume',
      displayValue: { value: 7.41, unit: defaultUnits.volume },
      calculatedValue: {
        value: convertUnits({ value: 7.41, fromUnit: defaultUnits.volume, toUnit: 'm3' }),
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
      answerValue = (1 / 2) * (4 / 3) * Math.PI * (diameter / 2) ** 3
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
      answerValue = 2 * (volume / ((1 / 2) * (4 / 3) * Math.PI)) ** (1 / 3)
    }

    return updateAnswer(inputArray, answerValue, 'diameter')
  }

  return (
    <PageContainer>
      <Breadcrumbs paths={paths} />
      <CalcHeader title={'Hemisphere'} text={'This calculates the volume of a hemisphere'} />
      <CalcBody>
        <Calculator
          title="Calculator"
          values={values}
          onChangeSolveSelection={onChangeSolveSelection}
          onChangeValue={onChangeValue}
        />
        <CalcCard title="Hemisphere">
          <IconContainer>
            <IconHemisphereUnits />
          </IconContainer>
        </CalcCard>
      </CalcBody>
    </PageContainer>
  )
}

export default Hemisphere
