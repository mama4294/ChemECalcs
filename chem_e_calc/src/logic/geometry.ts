import { Dispatch, useReducer } from 'react'
import { ShortInputType } from '../types'
import { updateCalculatedValue } from './logic'

export enum ActionKind {
  CHANGE_VALUE = 'CHANGE_VALUE',
  CHANGE_SOLVE_SELECTION = 'CHANGE_SOLVE_SELECTION',
  REFRESH = 'REFRESH',
}

type Action<SolveOptionsT> =
  | {
      type: ActionKind.CHANGE_SOLVE_SELECTION
      payload: SolveOptionsT
    }
  | {
      type: ActionKind.CHANGE_VALUE
      payload: ShortInputType
    }
  | {
      type: ActionKind.REFRESH
    }

type State<T> = T

export function useGeomentryStateReducer<SolveOptionsT, DataT>(
  initialState: State<DataT>,
  calculation: (state: State<DataT>) => State<DataT>
) {
  function stateReducer(state: State<DataT>, action: Action<SolveOptionsT>): State<DataT> {
    switch (action.type) {
      case ActionKind.CHANGE_SOLVE_SELECTION:
        return {
          ...state,
          solveSelection: action.payload,
        }
      case ActionKind.CHANGE_VALUE:
        const payloadWithCalculatedValue = updateCalculatedValue(action.payload)
        return calculation({ ...state, [action.payload.name]: payloadWithCalculatedValue }) //calculate answer state
      case ActionKind.REFRESH:
        return calculation({ ...state }) //calculate answer state
      default:
        const neverEver: never = action
        console.error('Error: State reducer action not recognized', neverEver)
        return state
    }
  }
  return useReducer(stateReducer, initialState)
}

export const handleChangeSolveSelection =
  <SolveSelectionOptions>(dispatch: Dispatch<Action<SolveSelectionOptions>>) =>
  (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: ActionKind.CHANGE_SOLVE_SELECTION, payload: e.target.value as SolveSelectionOptions })
  }

export const handleChangeValue =
  <StateWithoutSolveSelection extends ShortInputType>(
    input: State<StateWithoutSolveSelection>,
    dispatch: Dispatch<Action<any>>
  ) =>
  (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const numericValue = value.replace(/[^\d.-]/g, '') //removes commas
    const unit = input.displayValue.unit
    const payload = { ...input, displayValue: { value: numericValue, unit } }
    dispatch({ type: ActionKind.CHANGE_VALUE, payload })
  }

export const handleChangeUnit =
  <StateWithoutSolveSelection extends ShortInputType>(
    input: State<StateWithoutSolveSelection>,
    dispatch: Dispatch<Action<any>>
  ) =>
  (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const existingValue = input.displayValue.value
    const payload = { ...input, displayValue: { value: existingValue, unit: value } }
    dispatch({ type: ActionKind.CHANGE_VALUE, payload })
  }
