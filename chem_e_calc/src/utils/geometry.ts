import { tankHeadParameters } from '../constants/ASME'
import { State } from '../pages/geometry/tank'

export const heightOfTriangle = ({ diameter, angle }: { diameter: number; angle: number }) => {
  if (angle <= 0) return 0
  if (angle >= 90) return Infinity
  return diameter / 2 / Math.tan(((90 - angle) * Math.PI) / 180)
}

export const volumeOfConeFromHeight = ({ diameter, height }: { diameter: number; height: number }) => {
  return (Math.PI * Math.pow(diameter, 2) * height) / 3
}

export const volumeOfConeFromAngle = ({ diameter, angle }: { diameter: number; angle: number }) => {
  const radius = diameter / 2
  const height = radius / Math.tan(angle * (Math.PI / 180))
  const volume = (1 / 3) * Math.PI * Math.pow(radius, 2) * height
  return volume
}

export const volumeOfCylinder = ({ diameter, height }: { diameter: number; height: number }) => {
  return (Math.PI * Math.pow(diameter, 2) * height) / 4
}

export const capacityOfASMEDish = ({ diameter, capacityFactor }: { diameter: number; capacityFactor: number }) => {
  return capacityFactor * Math.pow(diameter, 3) //m3
}

const calcV1 = ({ diameter, fd, a }: { diameter: number; fd: number; a: number }) => {
  return Math.PI * Math.pow(diameter, 3) * (fd * Math.pow(a, 2) - Math.pow(a, 3) * (1 / 3))
}

const calcV2 = ({ a, a1, a2, fk, diameter }: { a: number; a1: number; a2: number; fk: number; diameter: number }) => {
  const v2_1 = (Math.pow(0.5 - fk, 2) + Math.pow(fk, 2)) * (a - a1)
  const v2_2 = (-1 / 3) * (Math.pow(a - a2, 3) - Math.pow(a1 - a2, 3))
  const v2_3 =
    (0.5 - fk) *
    ((a - a2) * Math.sqrt(Math.pow(fk, 2) - Math.pow(a - a2, 2)) -
      (a1 - a2) * Math.sqrt(Math.pow(fk, 2) - Math.pow(a1 - a2, 2)) +
      Math.pow(fk, 2) * Math.asin((a - a2) / fk) -
      Math.pow(fk, 2) * Math.asin((a1 - a2) / fk))
  return Math.PI * Math.pow(diameter, 3) * (v2_1 + v2_2 + v2_3)
}

const calcV4 = ({
  a,
  a1,
  a2,
  a5,
  fk,
  diameter,
}: {
  a: number
  a1: number
  a2: number
  a5: number
  fk: number
  diameter: number
}) => {
  const v4_1 = (Math.pow(0.5 - fk, 2) + Math.pow(fk, 2)) * (a5 - a - a1)
  const v4_2 = (-1 / 3) * (Math.pow(a5 - a - a2, 3) - Math.pow(a1 - a2, 3))
  const v4_3 =
    (0.5 - fk) *
    ((a5 - a - a2) * Math.sqrt(Math.pow(fk, 2) - Math.pow(a5 - a - a2, 2)) -
      (a1 - a2) * Math.sqrt(Math.pow(fk, 2) - Math.pow(a1 - a2, 2)) +
      Math.pow(fk, 2) * Math.asin((a5 - a - a2) / fk) -
      Math.pow(fk, 2) * Math.asin((a1 - a2) / fk))

  return Math.PI * Math.pow(diameter, 3) * (v4_1 + v4_2 + v4_3)
}

const calcV5 = ({ diameter, fd, a, a5 }: { diameter: number; fd: number; a: number; a5: number }) => {
  return Math.PI * diameter ** 3 * (fd * Math.pow(a5 - a, 2) - (1 / 3) * Math.pow(a5 - a, 3))
}

export const calculateASMEVolumebyHeight = (
  state: State,
  liquidHeight: number,
  totalHeight: number,
  top: boolean
): number => {
  const a = liquidHeight / state.diameter.calculatedValue.value //m
  const diameter = state.diameter.calculatedValue.value //m

  if (top) {
    //Top Dish
    const dish = state.head
    const fd = tankHeadParameters[dish]?.fd || 0
    const fk = tankHeadParameters[dish]?.fk || 0
    const a1 = tankHeadParameters[dish]?.a1 || 0
    const a2 = tankHeadParameters[dish]?.a2 || 0
    const a5 = totalHeight / state.diameter.calculatedValue.value
    const a3 = a5 - a2
    const a4 = a5 - a1

    let v4 = 0
    if (a <= a3) v4 = 0
    else if (a >= a4) v4 = calcV2({ a: a2, a1, a2, diameter, fk }) - calcV4({ a: a4, a1, a2, a5, diameter, fk })
    else v4 = calcV2({ a: a2, a1, a2, diameter, fk }) - calcV4({ a: a, a1, a2, a5, diameter, fk })

    let v5 = 0
    if (a <= a4) v5 = 0
    else if (a >= a5) v5 = calcV1({ diameter, fd, a: a1 }) - calcV5({ diameter, fd, a: a5, a5 })
    else v5 = calcV1({ diameter, fd, a: a1 }) - calcV5({ diameter, fd, a, a5 })

    return v4 + v5
  } else {
    //Bottom Dish
    const dish = state.bottom
    const fd = tankHeadParameters[dish]?.fd || 0
    const fk = tankHeadParameters[dish]?.fk || 0
    const a1 = tankHeadParameters[dish]?.a1 || 0
    const a2 = tankHeadParameters[dish]?.a2 || 0

    let v1 = 0
    if (a <= 0) v1 = 0 //v1 is empty
    else if (a >= a1) v1 = calcV1({ diameter, fd, a: a1 }) //v1 completely filled
    else v1 = calcV1({ diameter, fd, a: a1 }) //v1 partially filled

    let v2 = 0
    if (a <= a1) v2 = 0 //v2 is empty
    else if (a >= a2) {
      //v2 is completely filled
      v2 = calcV2({ a: a2, a1, a2, diameter, fk })
    } else {
      //v2 is partially filled
      v2 = calcV2({ a, a1, a2, diameter, fk })
    }
    return v1 + v2
  }
}
