import type { NextPage } from 'next'
import { useState } from 'react'
// import Select from 'react-select'

import { InputType } from '../components/calculators/calculator'
import { Breadcrumbs } from '../components/calculators/breadcrumbs'
import { CalcBody } from '../components/calculators/calcBody'
import { CalcCard } from '../components/calculators/calcCard'
import { PageContainer } from '../components/calculators/container'
import { CalcHeader } from '../components/calculators/header'
import { convertUnits, unitTypes, dynamicRound, unitOptions, UnitOptions, UnitOption } from '../utils/units'
import { InputField, OnChangeValueProps } from '../components/inputs/inputField'
import { updateArray } from '../logic/logic'

const UnitConversion: NextPage = () => {
  const paths = [{ title: 'Unit Conversion', href: '/conversion' }]

  const [unitType, setUnitType] = useState('mass')

  const handleChangeUnitType = (newType: string): void => {
    const newValues: InputType[] = state.map(obj => {
      const value = obj.displayValue.value as number
      const newUnit = unitOptions[newType as keyof UnitOptions][0] as UnitOption
      return {
        ...obj,
        unitType: newType,
        displayValue: { value: value, unit: newUnit.value },
        calculatedValue: { value: value, unit: newUnit.value },
      }
    })
    setState(newValues)
    setUnitType(newType)
  }

  const [state, setState] = useState<InputType[]>([
    {
      id: 1,
      name: 'input',
      unitType: 'mass',
      type: 'number',
      placeholder: 'Enter value',
      label: 'From',
      displayValue: { value: 1, unit: 'mg' },
      calculatedValue: { value: 1, unit: 'mg' },
      solveable: false,
      selectiontext: '',
      selected: false,
      error: '',
    },
    {
      id: 2,
      name: 'output',
      unitType: 'mass',
      type: 'number',
      placeholder: 'Enter value',
      label: 'To',
      displayValue: { value: 1, unit: 'mg' },
      calculatedValue: { value: 1, unit: 'mg' },
      solveable: true,
      selectiontext: '',
      selected: true,
      error: '',
    },
  ])

  const handleChangeValue = ({ id, unit, number }: OnChangeValueProps): void => {
    console.log('Update')

    const updatedArr = updateArray({ id, number, unit, array: state })
    const answerArr = calculateAnswer(updatedArr)
    if (answerArr) {
      setState(answerArr)
    } else {
      setState(updatedArr)
    }
  }

  const calculateAnswer = (inputArray: InputType[]) => {
    const inputObj = inputArray.find(o => o.name === 'input')
    const outputObj = inputArray.find(o => o.name === 'output')

    if (!inputObj || !outputObj) {
      alert('inputs to calculator undefined')
      return null
    }

    const answerValue = convertUnits({
      value: inputObj.displayValue.value as number,
      fromUnit: inputObj.displayValue.unit,
      toUnit: outputObj.displayValue.unit,
    })

    console.log(
      `input: ${inputObj.displayValue.value} ${inputObj.displayValue.unit}, output: ${outputObj.displayValue.value} ${outputObj.displayValue.unit}`
    )

    return inputArray.map(o => {
      //convert calculed value to display value
      if (o.name === 'output') {
        return {
          ...o,
          displayValue: {
            value: dynamicRound(answerValue),
            unit: o.displayValue.unit,
          },
          calculatedValue: { value: answerValue, unit: o.calculatedValue.unit },
        }
      } else return o
    })
  }

  const handleSwap = () => {
    if (state[0] && state[1]) {
      const newInput = { ...state[0], displayValue: state[1].displayValue, calculatedValue: state[1].calculatedValue }
      const newOutput = { ...state[1], displayValue: state[0].displayValue, calculatedValue: state[0].calculatedValue }
      setState([newInput, newOutput])
    }
  }

  const input = state[0]
  const output = state[1]

  return (
    <PageContainer>
      <Breadcrumbs paths={paths} />
      <CalcHeader title={'Unit Conversion'} text={'Convert between units'} />
      <CalcBody>
        <CalcCard title={'Calculator'}>
          <>
            <div className="form-control mb-2 w-full">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <select
                className="select input-bordered w-full"
                value={unitType}
                onChange={e => handleChangeUnitType(e.target.value)}
              >
                {unitTypes.map(type => {
                  return (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  )
                })}
              </select>
            </div>
            <div className="mb-0 flex flex-col">
              {input && <InputField key={input.id} data={input} onChangeValue={handleChangeValue} />}
              <div className="flex justify-center">
                <button className="btn btn-circle" onClick={handleSwap}>
                  <SwapIcon />
                </button>
              </div>
              {output && <InputField key={output.id} data={output} onChangeValue={handleChangeValue} />}
            </div>
          </>
        </CalcCard>
      </CalcBody>
    </PageContainer>
  )
}

export default UnitConversion

const SwapIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="inherit"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="h-6 w-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
    />
  </svg>
)
