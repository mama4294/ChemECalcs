import { Canvas } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import { OrbitControls, useHelper } from '@react-three/drei'
import { PointLight, PointLightHelper } from 'three'

const Rectangle3D = ({ width, length, height }: { width: number; length: number; height: number }) => {
  // console.table({ width, length, height })

  console.log(scaleToFit({ width, length, height }))

  return (
    <div className="h-[500px]">
      <Canvas camera={{ position: [3, 3, 0], fov: 40 }}>
        <OrbitControls enableZoom={false} />
        <LightScene />
        {/* <axesHelper args={[10]} /> */}
        {/* <Suspense fallback={null}> */}
        <mesh rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={scaleToFit({ width, length, height })} />
          <meshStandardMaterial color={'orange'} />
          {/* <meshLambertMaterial attach="material" color={'hotpink'} /> */}
        </mesh>
        {/* </Suspense> */}
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

const scaleToFit = ({
  width,
  length,
  height,
}: {
  width: number
  length: number
  height: number
}):
  | [
      width?: number | undefined,
      height?: number | undefined,
      depth?: number | undefined,
      widthSegments?: number | undefined,
      heightSegments?: number | undefined,
      depthSegments?: number | undefined
    ]
  | undefined => {
  const max = Math.max(width, length, height)
  return [width / max, length / max, height / max]
}

// const box = () =>(
//   <mesh rotation={[90, 0, 20]}>
//   <boxBufferGeometry attach="geometry" args={[3, 3, 3]} />
//   <meshNormalMaterial attach="material" />
//   {/* <meshStandardMaterial map={colorMap} /> */}
// </mesh>
// )

export default Rectangle3D
