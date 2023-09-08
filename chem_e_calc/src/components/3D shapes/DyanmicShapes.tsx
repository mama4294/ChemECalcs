import { Canvas } from '@react-three/fiber'
import { useRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import { PointLight } from 'three'
import { COLOR3D } from '../../constants/colors'

const ShapeContainer = ({ orbit = true, children }: { orbit?: boolean; children: JSX.Element }) => {
  // console.table({ width, length, height })

  return (
    <>
      <Canvas camera={{ position: [3, 1, 0], fov: 60 }}>
        {orbit && <OrbitControls enableZoom={false} />}
        <LightScene />
        {children}
      </Canvas>
    </>
  )
}

const LightScene = () => {
  const pointLightRef = useRef<PointLight>(null!)
  // useHelper(pointLightRef, PointLightHelper, 1, 'white')
  return (
    <>
      <ambientLight />
      <pointLight position={[0, 2, 2]} intensity={20} color="#fff" />
      <pointLight ref={pointLightRef} position={[0, -2, -2]} intensity={5} color="#fff" />
    </>
  )
}

const scaleBoxToFit = ({ width, length, height }: { width: number; length: number; height: number }) => {
  const max = Math.max(width, length, height)
  return { width: width / max, length: length / max, height: height / max }
}

export const Box3D = ({ width, length, height }: { width: number; length: number; height: number }) => {
  const scaled = scaleBoxToFit({ width, length, height })
  return (
    <mesh rotation={[0, Math.PI / 4, 0]}>
      <boxGeometry args={[scaled.width, scaled.height, scaled.length]} />
      <meshStandardMaterial color={COLOR3D} />
    </mesh>
  )
}

export const Pyramid3D = ({ width, length, height }: { width: number; length: number; height: number }) => {
  const scaled = scaleBoxToFit({ width, length, height })
  return (
    <mesh rotation={[0, Math.PI / 4, 0]}>
      <cylinderGeometry args={[0, scaled.width, scaled.height, 4, 1]} />
      <meshStandardMaterial color={COLOR3D} />
    </mesh>
  )
}

export const Cylinder3D = ({
  topDiameter,
  bottomDiameter,
  height,
}: {
  topDiameter: number
  bottomDiameter: number
  height: number
}) => {
  const scale = ({
    topDiameter,
    bottomDiameter,
    height,
  }: {
    topDiameter: number
    bottomDiameter: number
    height: number
  }) => {
    const max = Math.max(topDiameter, bottomDiameter, height)
    return { topDiameter: topDiameter / max, bottomDiameter: bottomDiameter / max, height: height / max }
  }

  const scaled = scale({ topDiameter, bottomDiameter, height })
  return (
    <mesh rotation={[0, Math.PI / 4, 0]}>
      <cylinderGeometry args={[scaled.topDiameter / 2, scaled.bottomDiameter / 2, scaled.height]} />
      <meshStandardMaterial color={COLOR3D} />
    </mesh>
  )
}

export default ShapeContainer
