import { useRef } from 'react'
import { Stage, Layer, Rect, Shape } from 'react-konva'
import { State } from '../pages/geometry/tank'

type Props = {
  state: State
}

const CanvasTank = ({ state }: Props) => {
  const { diameter, height } = state
  const containerRef = useRef<HTMLDivElement>(null)

  const canvasWidth = containerRef.current?.clientWidth || 500
  const canvasHight = containerRef.current?.clientWidth || 500

  const scale = Math.max(diameter.calculatedValue.value, height.calculatedValue.value) * 1.5
  const tankBodyDiameter = (diameter.calculatedValue.value / scale) * canvasWidth
  const tankBodyHeight = (height.calculatedValue.value / scale) * canvasHight

  //center rectangle in the canvas
  const tankBodyX = (canvasWidth - tankBodyDiameter) / 2
  const tankBodyY = (canvasHight - tankBodyHeight) / 2

  let tankOutline = 'white'
  if (containerRef.current) {
    tankOutline = window.getComputedStyle(containerRef.current).stroke
  }
  console.log('Tank Fill', tankOutline)

  return (
    <div className="h-full w-full stroke-accent" ref={containerRef}>
      <Stage width={canvasWidth} height={canvasHight}>
        <Layer>
          <Shape
            sceneFunc={(context, shape) => {
              context.beginPath()
              context.moveTo(tankBodyX, tankBodyY)
              context.lineTo(tankBodyX, tankBodyY + tankBodyHeight)
              context.quadraticCurveTo(
                tankBodyX + tankBodyDiameter / 2,
                tankBodyY + tankBodyHeight + 50,
                tankBodyX + tankBodyDiameter,
                tankBodyY + tankBodyHeight
              )
              context.lineTo(tankBodyX + tankBodyDiameter, tankBodyY)
              context.quadraticCurveTo(tankBodyX + tankBodyDiameter / 2, tankBodyY - 50, tankBodyX, tankBodyY)
              context.closePath()
              // (!) Konva specific method, it is very important
              context.fillStrokeShape(shape)
            }}
            fill="transparent"
            stroke="white"
            strokeWidth={4}
          />
          {/* <Rect
            x={tankBodyX}
            y={tankBodyY}
            width={tankBodyDiameter}
            height={tankBodyHeight}
            strokeWidth={2}
            cornerRadius={1}
            stroke={tankOutline}
            shadowColor="white"
            shadowBlur={10}
            shadowOpacity={0.5}
          /> */}
        </Layer>
      </Stage>
    </div>
  )
}

export default CanvasTank
