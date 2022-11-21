import React, { useRef, useEffect } from 'react'
import { State } from '../pages/geometry/tank'
import { tankHeadParameters } from '../pages/geometry/tank'

const Canvas = ({ state }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const canvasWidth = containerRef.current?.clientWidth || 500
  const canvasHight = containerRef.current?.clientHeight || 500
  const limitingDimension = Math.min(canvasWidth, canvasHight)

  const calculateHeadHeight = ({ type, diameter, angle }: { type: string; diameter: number; angle: number }) => {
    if (type === 'cone') {
      //calculate height of cone from angle
      if (angle <= 0) return 0
      if (angle >= 90) return diameter / 2
      return diameter / 2 / Math.tan((angle * Math.PI) / 180)
    } else if (type === 'hemisphere') {
      return diameter / 2
    } else if (
      type == 'ellipsoidal (2:1)' ||
      type == 'ASME F&D' ||
      type == 'ASME 80/10 F&D' ||
      type == 'ASME 80/6 F&D'
    ) {
      const CR = tankHeadParameters[type as keyof typeof tankHeadParameters]?.CR
      const KR = tankHeadParameters[type as keyof typeof tankHeadParameters]?.KR
      if (!CR || !KR) {
        console.error('Error: CR or KR is undefined')
        return 0
      }
      const crownRadius = diameter * CR
      const knuckleRadius = diameter * KR
      const crownAngle = Math.asin((diameter / 2 - knuckleRadius) / (crownRadius - knuckleRadius)) //radians
      return crownRadius - (diameter / 2 - knuckleRadius) / Math.tan(crownAngle)
    } else return 0
  }

  //Determine max head dimensions for scaling
  const topHeadHeight = calculateHeadHeight({
    type: state.head,
    diameter: state.diameter.calculatedValue.value,
    angle: state.topConeAngle.calculatedValue.value,
  })
  const bottomeHeadHeight = calculateHeadHeight({
    type: state.bottom,
    diameter: state.diameter.calculatedValue.value,
    angle: state.bottomConeAngle.calculatedValue.value,
  })

  //Calculate scale factor
  const longestWidth = state.diameter.calculatedValue.value
  const longestHeight = state.height.calculatedValue.value + topHeadHeight + bottomeHeadHeight
  const maxLength = Math.max(longestWidth, longestHeight)
  const scaleFactor = limitingDimension / maxLength / 1.05

  //Calculate scaled body dimensions
  const tankDiameter = state.diameter.calculatedValue.value * scaleFactor
  const tankHeight = state.height.calculatedValue.value * scaleFactor

  console.table({ topHeadHeight, tankHeight, bottomeHeadHeight })

  //center tank
  // const tankTopLeft = { x: canvasWidth / 2 - tankDiameter / 2, y: canvasHight / 2 - tankHeight / 2 }
  const tankTopLeft = { x: canvasWidth / 2 - tankDiameter / 2, y: topHeadHeight * scaleFactor + 10 }
  const tankTopMiddle = { x: tankTopLeft.x + tankDiameter / 2, y: tankTopLeft.y }
  const tankBottomMiddle = { x: tankTopLeft.x + tankDiameter / 2, y: tankTopLeft.y + tankHeight }

  //Find colors
  let tankOutline = 'white'
  let tankFill = 'gray'
  if (containerRef.current) {
    tankOutline = window.getComputedStyle(containerRef.current).stroke
    tankFill = window.getComputedStyle(containerRef.current).fill
  }

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvasWidth, canvasHight)
    ctx.lineWidth = 5
    ctx.strokeStyle = tankOutline
    ctx.beginPath()
    drawHead({
      ctx: ctx,
      top: false,
      center: tankBottomMiddle,
      diameter: tankDiameter,
      type: state.bottom,
      angle: state.bottomConeAngle.calculatedValue.value,
    }) //bottom head
    ctx.rect(tankTopLeft.x, tankTopLeft.y, tankDiameter, tankHeight) //draw tank body
    drawHead({
      ctx: ctx,
      top: true,
      center: tankTopMiddle,
      diameter: tankDiameter,
      type: state.head,
      angle: state.topConeAngle.calculatedValue.value,
    }) //top head
    ctx.stroke()
  }

  interface HeadCtx {
    ctx: CanvasRenderingContext2D
    top: boolean
    center: { x: number; y: number }
    diameter: number
    type: string
    angle: number
  }

  const drawHead = ({ ctx, top, center, diameter, type, angle }: HeadCtx) => {
    if (type == 'hemisphere') {
      drawHemisphere({ ctx: ctx, top: top, center: center, diameter: diameter, type: type, angle: angle })
    } else if (type == 'cone') {
      drawCone({ ctx: ctx, top: top, center: center, diameter: diameter, type: type, angle: angle })
    } else if (
      type == 'ellipsoidal (2:1)' ||
      type == 'ASME F&D' ||
      type == 'ASME 80/10 F&D' ||
      type == 'ASME 80/6 F&D'
    ) {
      drawASMEHead({ ctx: ctx, top: top, center: center, diameter: diameter, type: type, angle: angle })
    }
  }

  const drawHemisphere = ({ ctx, top, center, diameter }: HeadCtx) => {
    ctx.arc(center.x, center.y, diameter / 2, top ? Math.PI : 0, top ? 0 : Math.PI)
  }

  const drawASMEHead = ({ ctx, top, center, diameter, type }: HeadCtx) => {
    const CR = tankHeadParameters[type as keyof typeof tankHeadParameters]?.CR
    const KR = tankHeadParameters[type as keyof typeof tankHeadParameters]?.KR

    if (!CR || !KR) {
      console.error('Error: CR or KR is undefined')
      return undefined
    }

    const crownRadus = diameter * CR
    const knuckleRadius = diameter * KR

    const crownAngle = Math.asin((diameter / 2 - knuckleRadius) / (crownRadus - knuckleRadius)) //radians
    const knuckleAngle = Math.PI / 2 - crownAngle // radians

    const knuckleCenter = { x: diameter / 2 - knuckleRadius, y: 0 }
    const crownCenter = { x: 0, y: (diameter / 2 - knuckleRadius) / Math.tan(crownAngle) }

    if (top) {
      ctx.arc(center.x - knuckleCenter.x, center.y, knuckleRadius, Math.PI, Math.PI + knuckleAngle, false) //knuckle
      ctx.arc(
        center.x,
        center.y + crownCenter.y,
        crownRadus,
        Math.PI * (3 / 2) - crownAngle,
        Math.PI * (3 / 2) + crownAngle,
        false
      ) //crown
      ctx.arc(center.x + knuckleCenter.x, center.y, knuckleRadius, 0 - knuckleAngle, 0, false) //knuckle
    } else {
      ctx.arc(center.x - knuckleCenter.x, center.y, knuckleRadius, Math.PI, Math.PI - knuckleAngle, true) //knuckle
      ctx.arc(center.x, center.y - crownCenter.y, crownRadus, Math.PI / 2 + crownAngle, Math.PI / 2 - crownAngle, true) //crown
      ctx.arc(center.x + knuckleCenter.x, center.y, knuckleRadius, 0 + knuckleAngle, 0, true) //knuckle
    }
  }

  const drawCone = ({ ctx, top, center, diameter, angle }: HeadCtx) => {
    const radius = diameter / 2
    const height = radius / Math.tan((angle * Math.PI) / 180)

    if (top) {
      ctx.moveTo(center.x + radius, center.y)
      ctx.lineTo(center.x, center.y - height)
      ctx.lineTo(center.x - radius, center.y)
    } else {
      ctx.moveTo(center.x - radius, center.y)
      ctx.lineTo(center.x, center.y + height)
      ctx.lineTo(center.x + radius, center.y)
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (context) {
      draw(context)
    }
  }, [state])

  return (
    <div className="h-full w-full fill-accent stroke-base-content" ref={containerRef}>
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHight} />
    </div>
  )
}

type Props = {
  state: State
}

export default Canvas
