import { COLOR3D } from '../../constants/colors'

export const Box3D = () => {
  return (
    <mesh rotation={[0, Math.PI / 4, 0]}>
      <boxGeometry />
      <meshStandardMaterial color={COLOR3D} />
    </mesh>
  )
}

export const Sphere3D = () => {
  return (
    <mesh>
      <sphereGeometry />
      <meshStandardMaterial color={COLOR3D} />
    </mesh>
  )
}

export const Hemisphere3D = () => {
  return (
    <>
      <mesh>
        <sphereGeometry args={[, , , , , 0, Math.PI / 2]} />
        <meshStandardMaterial color={COLOR3D} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry />
        <meshStandardMaterial color={COLOR3D} />
      </mesh>
    </>
  )
}

export const Cylinder3D = () => {
  return (
    <mesh rotation={[0, Math.PI / 4, 0]}>
      <cylinderGeometry args={[0.75, 0.75, 1]} />
      <meshStandardMaterial color={COLOR3D} />
    </mesh>
  )
}

export const Cone3D = () => {
  return (
    <mesh rotation={[0, Math.PI / 4, 0]}>
      <cylinderGeometry args={[0, 0.5, 1]} />
      <meshStandardMaterial color={COLOR3D} />
    </mesh>
  )
}

export const Tank3D = () => {
  return (
    <mesh>
      <capsuleGeometry args={[0.5, 1.5]} />
      <meshStandardMaterial color={COLOR3D} />
    </mesh>
  )
}
