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
import { IconPyramidUnits } from '../../icons/iconPyramidUnits'
import { handleChangeSolveSelection, updateAnswer, updateArray, validateNotBlank } from '../../logic/logic'
import { DefaultUnitContext, DefaultUnitContextType } from '../../contexts/defaultUnitContext'
import Metadata from '../../components/Layout/MetaData'

const Pyramid = () => {
  const { defaultUnits } = useContext(DefaultUnitContext) as DefaultUnitContextType
  const paths = [
    { title: 'Geometry', href: '/geometry' },
    { title: 'Box', href: '/geometry/pyramid' },
  ]

  const [values, setValues] = useState<InputType[]>([
    {
      id: 1,
      name: 'width',
      unitType: 'length',
      type: 'number',
      placeholder: 'Enter value',
      label: 'Width',
      displayValue: { value: 1, unit: defaultUnits.length },
      calculatedValue: {
        value: convertUnits({ value: 1, fromUnit: defaultUnits.length, toUnit: 'm' }),
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
      name: 'length',
      unitType: 'length',
      type: 'number',
      placeholder: 'Enter value',
      label: 'Length',
      displayValue: { value: 1, unit: defaultUnits.length },
      calculatedValue: {
        value: convertUnits({ value: 1, fromUnit: defaultUnits.length, toUnit: 'm' }),
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
      placeholder: 'Enter value',
      label: 'Volume',
      displayValue: { value: 0.33, unit: defaultUnits.volume },
      calculatedValue: {
        value: convertUnits({ value: 0.33, fromUnit: defaultUnits.volume, toUnit: 'm3' }),
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
      answerValue = (width * length * height) / 3
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
      answerValue = (3 * volume) / (width * length)
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
      answerValue = (3 * volume) / (height * length)
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
      answerValue = (3 * volume) / (height * width)
    }

    return updateAnswer(inputArray, answerValue, 'length')
  }

  return (
    <>
      <Metadata
        title="Pyramid Calculator"
        description="Chemical engineering calculations for process and plant engineers"
        keywords="box, volume, lenght, width, height, calculator, chemical engineering, process engineering, chemical engineering calculations, process engineering calculations"
      />
      <PageContainer>
        <Breadcrumbs paths={paths} />
        <CalcHeader title={'Pyramid'} text={'This calculates the volume of a pyramid'} />
        <CalcBody>
          <Calculator
            title="Calculator"
            values={values}
            onChangeSolveSelection={onChangeSolveSelection}
            onChangeValue={onChangeValue}
          />
          <CalcCard title="Pyramid">
            <IconContainer>
              <IconPyramidUnits />
            </IconContainer>
          </CalcCard>
        </CalcBody>
      </PageContainer>
    </>
  )
}

export default Pyramid
