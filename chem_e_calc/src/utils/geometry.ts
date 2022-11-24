export const heightOfTriangle = ({ base, angle }: { base: number; angle: number }) => {
  return base * Math.tan((angle * Math.PI) / 180)
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
