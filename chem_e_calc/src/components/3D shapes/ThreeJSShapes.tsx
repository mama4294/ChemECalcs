import { Canvas } from '@react-three/fiber'
import { useRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import { PointLight } from 'three'
import { COLOR3D } from '../../constants/colors'

const ShapeContainer = ({ children }: { children: JSX.Element }) => {
  // console.table({ width, length, height })

  return (
    <div className="h-[500px]">
      <Canvas camera={{ position: [3, 3, 0], fov: 40 }}>
        <OrbitControls enableZoom={false} />
        <LightScene />
        {children}
      </Canvas>
    </div>
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

export const Box3D = ({ width, length, height }: { width: number; length: number; height: number }) => {
  const scaleBoxToFit = ({ width, length, height }: { width: number; length: number; height: number }) => {
    const max = Math.max(width, length, height)
    return { width: width / max, length: length / max, height: height / max }
  }

  const scaled = scaleBoxToFit({ width, length, height })
  return (
    <mesh rotation={[0, Math.PI / 4, 0]}>
      <boxGeometry args={[scaled.width, scaled.height, scaled.length]} />
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
