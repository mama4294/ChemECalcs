import { useRef } from 'react'
import { Stage, Layer, Rect, Shape, Group, Line, Circle } from 'react-konva'
import { State } from '../pages/geometry/tank'

type Props = {
  state: State
}

type ASMEType = {
  diameter: number
  dishDetails: {
    CR: number
    KR: number
    DH: number
  }
}

const ASMEDishEnds = {
  'ellipsoidal (2:1)': {
    CR: 0.9,
    KR: 0.17,
    DH: 0.25,
  },
  'ASME F&D': {
    CR: 1,
    KR: 0.1,
    DH: 0.194,
  },
  'ASME 80/10 F&D': {
    CR: 0.8,
    KR: 0.1,
    DH: 0.194 * 0.66,
  },
  'ASME 80/6 F&D': {
    CR: 0.9,
    KR: 0.06,
    DH: 0.194 * 0.66,
  },
}

const calculateASMEDishRadii = ({ diameter, dishDetails }: ASMEType) => {
  //https://whatispiping.com/dish-and-nozzle-centerline-distance-calculation/#:~:text=Crown%20Radius%20(CR)%20for%20Ellipsoidal,)%20of%20the%20shell%2Fdish.

  if (!dishDetails) {
    return {
      knuckleMid: { x: 0, y: 0 },
      knuckle: { x: 0, y: 0 },
      crown: { x: 0, y: 0 },
      crownRadius: 0,
      knuckleRadius: 0,
    }
  }
  const { CR, KR, DH } = dishDetails

  const crownRadius = diameter * CR
  const knuckleRadius = diameter * KR
  const dishHeight = diameter * DH
  const hypothenuse = crownRadius - knuckleRadius
  const opposite = diameter / 2 - knuckleRadius
  const crownAngle = Math.asin(opposite / hypothenuse)
  const adjusent = Math.cos(crownAngle) * hypothenuse

  const aToKnuckleY = Math.cos(crownAngle) * crownRadius
  const eToKnuckleY = aToKnuckleY - adjusent
  const eToKnuckleX = Math.sin(crownAngle) * crownRadius
  const eToCrownY = dishHeight

  const knucleAngle = Math.asin(eToKnuckleY / knuckleRadius)

  const knuckleMid = {
    x: opposite + Math.cos((45 * Math.PI) / 180) * knuckleRadius,
    y: Math.sin((45 * Math.PI) / 180) * knuckleRadius,
  }
  const knuckle = { x: eToKnuckleX, y: eToKnuckleY }
  const crown = { x: 0, y: eToCrownY }
  const knuckleCenter = { x: opposite, y: 0 }

  return {
    knuckleMid,
    knuckle,
    knuckleCenter,
    crown,
    crownRadius,
    knuckleRadius,
    knucleAngle,
  }
}

const CanvasTank = ({ state }: Props) => {
  const { diameter, height, bottom, bottomConeAngle } = state
  const containerRef = useRef<HTMLDivElement>(null)

  const canvasWidth = containerRef.current?.clientWidth || 500
  const canvasHight = canvasWidth

  const scale = Math.max(diameter.calculatedValue.value, height.calculatedValue.value) * 2
  const tankBodyDiameter = (diameter.calculatedValue.value / scale) * canvasWidth
  const tankBodyHeight = (height.calculatedValue.value / scale) * canvasHight

  //Dimesions of bottom cone
  const coneHeight = ({ diameter, angle }: { diameter: number; angle: number }) => {
    const radius = diameter / 2
    const height = radius * Math.tan(angle * (Math.PI / 180))
    return height
  }

  const bottomDishData = calculateASMEDishRadii({
    diameter: tankBodyDiameter,
    dishDetails: ASMEDishEnds[bottom as keyof typeof ASMEDishEnds],
  })

  console.table(bottomDishData)

  //center rectangle in the canvas
  const tankBodyX1 = (canvasWidth - tankBodyDiameter) / 2 //top left
  const tankBodyY1 = (canvasHight - tankBodyHeight) / 2

  const tankBodyX2 = tankBodyX1 // bottom left
  const tankBodyY2 = tankBodyY1 + tankBodyHeight

  const tankBodyX3 = tankBodyX1 + tankBodyDiameter // bottom right
  const tankBodyY3 = tankBodyY2

  const tankBodyX4 = tankBodyX1 + tankBodyDiameter // top right
  const tankBodyY4 = tankBodyY1

  const tankMidpointX = (tankBodyX1 + tankBodyX3) / 2
  const bottomKnuckleY = tankBodyY2 + tankBodyDiameter / 4
  const topKnuckleY = tankBodyY1 - 50

  const bottomConeX = tankBodyX1 + tankBodyDiameter / 2 //Bottom cone
  const bottomeConeY =
    tankBodyY2 +
    (coneHeight({ diameter: diameter.calculatedValue.value, angle: bottomConeAngle.calculatedValue.value }) / scale) *
      canvasHight

  let tankOutline = 'white'
  let tankFill = 'gray'
  if (containerRef.current) {
    tankOutline = window.getComputedStyle(containerRef.current).stroke
    tankFill = window.getComputedStyle(containerRef.current).fill
  }

  const hemisphereBezier = arcToBezier(tankBodyDiameter / 2)
  const bottomCrownBezier = arcToBezier(bottomDishData.crownRadius)
  const bottomcKnuckleBezier = arcToBezier(bottomDishData.knuckleRadius)

  //   console.table({ tankBodyDiameter, tankBodyY2 })
  console.table({ crownBezier: hemisphereBezier })

  return (
    <div className="h-full w-full fill-accent stroke-base-content" ref={containerRef}>
      <Stage width={canvasWidth} height={canvasHight}>
        <Layer>
          {/* Group for clipped out the level of liquid */}
          <Group
            clipFunc={context => {
              context.beginPath()
              context.moveTo(tankBodyX1, tankBodyY1) //top left
              context.lineTo(tankBodyX2, tankBodyY2) //bottom left

              if (bottom === 'flat') {
                context.lineTo(tankBodyX3, tankBodyY3)
              } else if (bottom === 'cone') {
                context.lineTo(bottomConeX, bottomeConeY)
                context.lineTo(tankBodyX3, tankBodyY3)
              } else if (
                bottom === 'ellipsoidal (2:1)' ||
                bottom === 'ASME F&D' ||
                bottom === 'ASME 80/10 F&D' ||
                bottom === 'ASME 80/6 F&D'
              ) {
                context._context.arcTo(
                  tankMidpointX - bottomDishData.knuckleMid.x,
                  tankBodyY2 + bottomDishData.knuckleMid.y,
                  tankMidpointX - bottomDishData.knuckle.x,
                  tankBodyY2 + bottomDishData.knuckle.y,
                  bottomDishData.knuckleRadius
                )
                context._context.arcTo(
                  tankMidpointX,
                  tankBodyY2 + bottomDishData.crown.y,
                  tankMidpointX + bottomDishData.knuckle.x,
                  tankBodyY2 + bottomDishData.knuckle.y,
                  bottomDishData.crownRadius
                )
                context._context.arcTo(
                  tankMidpointX + bottomDishData.knuckleMid.x,
                  tankBodyY2 + bottomDishData.knuckleMid.y,
                  tankBodyX3,
                  tankBodyY3,
                  bottomDishData.knuckleRadius
                )
                context.lineTo(tankBodyX3, tankBodyY3) //bottom left
              } else if (bottom === 'hemisphere') {
                context._context.arcTo(
                  tankMidpointX,
                  tankBodyY2 + tankBodyDiameter,
                  tankBodyX3,
                  tankBodyY3,
                  tankBodyDiameter / 2
                )
                context.lineTo(tankBodyX3, tankBodyY3)
              } else {
                context.quadraticCurveTo(tankMidpointX, bottomKnuckleY, tankBodyX3, tankBodyY3)
              }
              context.lineTo(tankBodyX4, tankBodyY4) //top right
              context.quadraticCurveTo(tankMidpointX, topKnuckleY, tankBodyX1, tankBodyY1)
              context.closePath()
            }}
          >
            {/* Liquid level rectangle */}
            <Rect
              x={tankBodyX1}
              y={tankBodyY1 - 10}
              width={tankBodyDiameter}
              height={tankBodyHeight + 100}
              fill={tankFill}
            />
          </Group>
          {/* Tank Shape*/}

          <Shape
            sceneFunc={(context, shape) => {
              context.beginPath()
              context.moveTo(tankBodyX1, tankBodyY1) //top left
              context.lineTo(tankBodyX2, tankBodyY2) //bottom left

              if (bottom === 'flat') {
                context.lineTo(tankBodyX3, tankBodyY3)
              } else if (bottom === 'cone') {
                context.lineTo(bottomConeX, bottomeConeY)
                context.lineTo(tankBodyX3, tankBodyY3)
              } else if (
                bottom === 'ellipsoidal (2:1)' ||
                bottom === 'ASME F&D' ||
                bottom === 'ASME 80/10 F&D' ||
                bottom === 'ASME 80/6 F&D'
              ) {
                context._context.bezierCurveTo(
                  tankMidpointX - bottomcKnuckleBezier.x,
                  tankBodyY2 + bottomcKnuckleBezier.y,
                  tankMidpointX + bottomcKnuckleBezier.x,
                  tankBodyY2 + bottomcKnuckleBezier.y,
                  tankMidpointX - bottomDishData.knuckle.x,
                  tankBodyY2 + bottomDishData.knuckle.y
                )

                context._context.bezierCurveTo(
                  tankMidpointX - bottomCrownBezier.x,
                  tankMidpointX + bottomCrownBezier.y,
                  tankMidpointX + bottomCrownBezier.x,
                  tankMidpointX + bottomCrownBezier.y,
                  tankMidpointX + bottomDishData.knuckle.x,
                  tankBodyY2 + bottomDishData.knuckle.y
                )
                // context._context.arcTo(
                //     tankMidpointX - bottomDishData.knuckleMid.x,
                //     tankBodyY2 + bottomDishData.knuckleMid.y,
                //     tankMidpointX - bottomDishData.knuckle.x,
                //     tankBodyY2 + bottomDishData.knuckle.y,
                //     bottomDishData.knuckleRadius
                //   )
                // context._context.arcTo(
                //   tankMidpointX,
                //   tankBodyY2 + bottomDishData.crown.y,
                //   tankMidpointX + bottomDishData.knuckle.x,
                //   tankBodyY2 + bottomDishData.knuckle.y,
                //   bottomDishData.crownRadius
                // )
                context._context.arcTo(
                  tankMidpointX + bottomDishData.knuckleMid.x,
                  tankBodyY2 + bottomDishData.knuckleMid.y,
                  tankBodyX3,
                  tankBodyY3,
                  bottomDishData.knuckleRadius
                )
                context.lineTo(tankBodyX3, tankBodyY3) //bottom left
              } else if (bottom === 'hemisphere') {
                context._context.bezierCurveTo(
                  tankMidpointX - hemisphereBezier.x,
                  tankBodyY2 + hemisphereBezier.y,
                  tankMidpointX + hemisphereBezier.x,
                  tankBodyY2 + hemisphereBezier.y,
                  tankBodyX3,
                  tankBodyY3
                )
                context.lineTo(tankBodyX3, tankBodyY3)
              } else {
                context.quadraticCurveTo(tankMidpointX, bottomKnuckleY, tankBodyX3, tankBodyY3)
              }
              context.lineTo(tankBodyX4, tankBodyY4) //top right
              context.quadraticCurveTo(tankMidpointX, topKnuckleY, tankBodyX1, tankBodyY1)
              context.closePath()
              context.fillStrokeShape(shape)
            }}
            fill="transparent"
            stroke={tankOutline}
            strokeWidth={4}
          />

          <Circle radius={10} x={tankMidpointX - hemisphereBezier.x} y={tankBodyY2 + hemisphereBezier.y} fill={'red'} />

          <Circle radius={10} x={tankMidpointX + hemisphereBezier.x} y={tankBodyY2 + hemisphereBezier.y} fill={'red'} />

          {/* <Line
            points={[tankBodyX1, tankBodyY1, tankBodyX4, tankBodyY4]}
            stroke="gray"
            strokeWidth={1}
            lineJoin="round"
          />
          <Line
            points={[tankBodyX2, tankBodyY2, tankBodyX3, tankBodyY3]}
            stroke="gray"
            strokeWidth={1}
            lineJoin="round"
          /> */}
        </Layer>
      </Stage>
    </div>
  )
}

const arcToBezier = (radius: number) => {
  const k = 0.5522848
  const controlPoint = { x: radius * k, y: radius }

  return controlPoint
}

export default CanvasTank
