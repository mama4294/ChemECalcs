import { NextPage } from 'next'
import React, { useContext, useReducer } from 'react'
import { Breadcrumbs } from '../../components/calculators/breadcrumbs'
import { CalcBody } from '../../components/calculators/calcBody'
import { CalcCard } from '../../components/calculators/calcCard'
import { PageContainer } from '../../components/calculators/container'
import { CalcHeader } from '../../components/calculators/header'
import { ShortInputType } from '../../types'
import { InputFieldConstant } from '../../components/inputs/inputField'
import { Equation } from '../../components/Layout/Equation'
import { Metadata } from '../../components/Layout/Metadata'

const TipSpeedPage: NextPage = () => {
  const paths = [
    { title: 'Fermentation', href: '/fermentation' },
    { title: 'Log Reduction', href: '/fermentation/logreduction' },
  ]

  type State = {
    initial: ShortInputType
    final: ShortInputType
    logReduction: ShortInputType
    percentReduction: ShortInputType
  }

  const initialState: State = {
    initial: {
      name: 'initial',
      label: 'Initial CFU',
      placeholder: '0',
      unitType: 'length',
      displayValue: { value: '1000', unit: 'CFU' },
      calculatedValue: { value: 1000, unit: 'CFU' },
      selectiontext: '',
      focusText: 'The quantity of Colony Forming Units (CFU) before treatment',
      error: '',
    },
    final: {
      name: 'final',
      label: 'Final CFU',
      placeholder: '0',
      unitType: 'length',
      displayValue: { value: '10', unit: 'CFU' },
      calculatedValue: { value: 10, unit: 'CFU' },
      selectiontext: '',
      focusText: 'The quantity of Colony Forming Units (CFU) after treatment',
      error: '',
    },
    logReduction: {
      name: 'logReduction',
      label: 'Log Reduction',
      placeholder: '0',
      unitType: 'speed',
      displayValue: { value: '2', unit: '' },
      calculatedValue: { value: 2, unit: '' },
      selectiontext: '',
      focusText: 'The logrithmic scale of reduction',
      error: '',
    },
    percentReduction: {
      name: 'percentReduction',
      label: 'Percent Reduction',
      placeholder: '0',
      unitType: 'speed',
      displayValue: { value: '99', unit: '%' },
      calculatedValue: { value: 99, unit: '%' },
      selectiontext: '',
      focusText: 'The percent reduction after treatment',
      error: '',
    },
  }

  const logReduc = ({ initial, final }: { initial: number; final: number }) => {
    return Math.log10(initial / final)
  }

  enum ActionKind {
    CHANGE_VALUE = 'CHANGE_VALUE',
    CHANGE_REDUCTION = 'CHANGE_REDUCTION',
    CHANGE_PERCENT = 'CHANGE_PERCENT',
  }

  type Action = {
    type: ActionKind.CHANGE_VALUE | ActionKind.CHANGE_REDUCTION | ActionKind.CHANGE_PERCENT
    payload: { name: string; value: string }
  }

  const stateReducer = (state: State, action: Action) => {
    const { initial, final, logReduction, percentReduction } = state
    let Ci = initial.calculatedValue.value
    let Cf = final.calculatedValue.value
    const name = action.payload.name

    const updateDisplayedValues = ({
      state,
      Ci,
      Cf,
      LR,
      Perc,
    }: {
      state: State
      Ci: number
      Cf: number
      LR: number
      Perc: number
    }): State => {
      const initialObject = {
        ...initial,
        displayValue: { value: Ci.toLocaleString(), unit: 'CFU' },
        calculatedValue: { value: Ci, unit: 'CFU' },
      }

      const finalObject = {
        ...final,
        displayValue: { value: Cf.toLocaleString(), unit: 'CFU' },
        calculatedValue: { value: Cf, unit: 'CFU' },
      }

      const lrObject = {
        ...logReduction,
        displayValue: { value: LR.toLocaleString(), unit: '' },
        calculatedValue: { value: LR, unit: '' },
      }

      const percentDecimalPlaces = Math.min(Math.max(Math.ceil(LR - 2), 0), 10)

      const percentObject = {
        ...percentReduction,
        displayValue: { value: Perc.toFixed(percentDecimalPlaces), unit: '%' },
        calculatedValue: { value: Perc, unit: '%' },
      }

      return {
        ...state,
        initial: initialObject,
        final: finalObject,
        logReduction: lrObject,
        percentReduction: percentObject,
      }
    }

    switch (action.type) {
      case ActionKind.CHANGE_VALUE:
        //If the user changed the initial or final concentration
        if (name == initial.name) {
          Ci = Number(action.payload.value.replace(/[^\d.-]/g, ''))
        }
        if (name == final.name) {
          Cf = Number(action.payload.value.replace(/[^\d.-]/g, ''))
        }
        //calcuate log reduction and percent reduction
        let LR = logReduc({ initial: Ci, final: Cf })
        let Perc = ((Ci - Cf) * 100) / Ci

        //convert calculated values to displayed values
        return updateDisplayedValues({ state, Ci, Cf, LR, Perc })

      case ActionKind.CHANGE_REDUCTION:
        LR = Number(action.payload.value.replace(/[^\d.-]/g, ''))

        //calculate the inital concentration that would be required to make this happen
        Ci = 10 ** LR * Cf
        Perc = ((Ci - Cf) * 100) / Ci

        //convert calculated values to displayed values
        return updateDisplayedValues({ state, Ci, Cf, LR, Perc })
      case ActionKind.CHANGE_PERCENT:
        Perc = Number(action.payload.value.replace(/[^\d.-]/g, ''))

        //calculate the inital concentration that would be required to make this happen
        Ci = (-100 * Cf) / (Perc - 100)
        LR = logReduc({ initial: Ci, final: Cf })

        //convert calculated values to displayed values
        return updateDisplayedValues({ state, Ci, Cf, LR, Perc })

      default:
        alert('Error: State reducer action not recognized')
        return state
    }
  }

  const [state, dispatch] = useReducer(stateReducer, initialState)

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case initial.name:
      case final.name:
        dispatch({
          type: ActionKind.CHANGE_VALUE,
          payload: { name: e.target.name, value: e.target.value },
        })
        break
      case logReduction.name:
        dispatch({
          type: ActionKind.CHANGE_REDUCTION,
          payload: { name: e.target.name, value: e.target.value },
        })
        break
      case percentReduction.name:
        dispatch({
          type: ActionKind.CHANGE_PERCENT,
          payload: { name: e.target.name, value: e.target.value },
        })
        break
      default:
        break
    }
  }

  const { initial, final, logReduction, percentReduction } = state

  return (
    <>
      <Metadata
        title="Log Reudction Calculator"
        description="Chemical engineering calculations for process and plant engineers"
        keywords="Agitation, chemical, engineering, home, calculator, unit, conversion, geometry, fluid, dynamics, tank, volume, agitation, scaleup, efficiency, accuracy, process, engineers"
      />
      <PageContainer>
        <Breadcrumbs paths={paths} />
        <CalcHeader title={'Log Reduction'} text={'Calculate the impact of a disinfectant technique'} />
        <CalcBody>
          <CalcCard title={'Calculator'}>
            <>
              <div className="mb-0 flex flex-col">
                <InputFieldConstant
                  key={initial.name}
                  name={initial.name}
                  label={initial.label}
                  placeholder={initial.placeholder}
                  selected={false}
                  displayValue={initial.displayValue}
                  error={initial.error}
                  unitType={initial.unitType}
                  focusText={initial.focusText}
                  onChangeValue={handleChangeValue}
                />
                <InputFieldConstant
                  key={final.name}
                  name={final.name}
                  label={final.label}
                  placeholder={final.placeholder}
                  selected={false}
                  displayValue={final.displayValue}
                  error={final.error}
                  unitType={final.unitType}
                  focusText={final.focusText}
                  onChangeValue={handleChangeValue}
                />
                <InputFieldConstant
                  key={logReduction.name}
                  name={logReduction.name}
                  label={logReduction.label}
                  placeholder={logReduction.placeholder}
                  selected={false}
                  displayValue={logReduction.displayValue}
                  error={logReduction.error}
                  unitType={logReduction.unitType}
                  focusText={logReduction.focusText}
                  onChangeValue={handleChangeValue}
                />
                <InputFieldConstant
                  key={percentReduction.name}
                  name={percentReduction.name}
                  label={percentReduction.label}
                  placeholder={percentReduction.placeholder}
                  selected={false}
                  displayValue={percentReduction.displayValue}
                  error={percentReduction.error}
                  unitType={percentReduction.unitType}
                  focusText={percentReduction.focusText}
                  onChangeValue={handleChangeValue}
                />
              </div>
            </>
          </CalcCard>
          <EquationCard />
        </CalcBody>
      </PageContainer>
    </>
  )
}

const EquationCard = () => {
  return (
    <CalcCard title="Governing Equation">
      <>
        <p>To calculate log reduction use the following formula:</p>
        <br />
        <Equation equation={`$$Log Reduction = \\log_{10}{\\frac{CFU_{initial}}{CFU_{final}}}  $$`} />
        <Equation equation={`$$Percent Reduction = \\frac{CFU_{initial}-CFU_{final}}{CFU_{initial}}$$`} />
        <table className="table-compact mt-6 table w-full">
          <thead>
            <tr>
              <th>Log Reduction</th>
              <th>Reduction</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1 Log Reduction</td>
              <td>90%</td>
            </tr>
            <tr>
              <td>2 Log Reduction</td>
              <td>99%</td>
            </tr>
            <tr>
              <td>3 Log Reduction</td>
              <td>99.9%</td>
            </tr>
            <tr>
              <td>4 Log Reduction</td>
              <td>99.99%</td>
            </tr>
            <tr>
              <td>5 Log Reduction</td>
              <td>99.999%</td>
            </tr>
            <tr>
              <td>6 Log Reduction</td>
              <td>99.9999%</td>
            </tr>
          </tbody>
        </table>
      </>
    </CalcCard>
  )
}

export default TipSpeedPage
