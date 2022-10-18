import type { NextPage } from 'next'
import { useState } from 'react'
// import Select from 'react-select'

import { InputType } from '../components/calculators/calculator'
import { Breadcrumbs } from '../components/calculators/breadcrumbs'
import { CalcBody } from '../components/calculators/calcBody'
import { CalcCard } from '../components/calculators/calcCard'
import { PageContainer } from '../components/calculators/container'
import { CalcHeader } from '../components/calculators/header'
import { convertUnits, roundTo2, unitTypes, units, Units } from '../utils/units'
import { InputField, OnChangeValueProps } from '../components/inputs/inputField'
import { updateArray } from '../logic/logic'

const UnitConversion: NextPage = () => {
  const paths = [{ title: 'Unit Conversion', href: '/conversion' }]

  const [unitType, setUnitType] = useState('mass')

  const handleChangeUnitType = (newType: string): void => {
    const newValues = values.map(obj => {
      const value = obj.displayValue.value
      const newUnit = units[newType as keyof Units][0] || 'm'
      return {
        ...obj,
        unitType: newType,
        displayValue: { value: value, unit: newUnit },
        calculatedValue: { value: value, unit: newUnit },
      }
    })
    setValues(newValues)
    setUnitType(newType)
  }

  const [values, setValues] = useState<InputType[]>([
    {
      id: 1,
      name: 'input',
      unitType: 'mass',
      type: 'number',
      placeholder: 'enter value',
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
      placeholder: 'enter value',
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

    const updatedArr = updateArray({ id, number, unit, array: values })
    const answerArr = calculateAnswer(updatedArr)
    if (answerArr) {
      setValues(answerArr)
    } else {
      setValues(updatedArr)
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
      value: inputObj.displayValue.value,
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
            value: roundTo2(answerValue),
            unit: o.displayValue.unit,
          },
          calculatedValue: { value: answerValue, unit: o.calculatedValue.unit },
        }
      } else return o
    })
  }

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
            <div className="mb-8 flex flex-col">
              {values.map(input => {
                console.log(input)
                return <InputField key={input.id} data={input} onChangeValue={handleChangeValue} />
              })}
            </div>
          </>
        </CalcCard>
      </CalcBody>
    </PageContainer>
  )
}

export default UnitConversion
