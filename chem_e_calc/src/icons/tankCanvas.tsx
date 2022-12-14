import React, { useRef, useEffect } from 'react'
import { calculateHeadHeight, State } from '../pages/geometry/tank'
import { tankHeadParameters } from '../constants/ASME'

const Canvas = ({ state }: { state: State }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [canvasDimention, setCanvasDimention] = React.useState({
    width: containerRef.current?.clientWidth || 500,
    height: containerRef.current?.clientHeight || 500,
  })

  const limitingDimension = Math.min(canvasDimention.width, canvasDimention.height)

  //Determine max head dimensions for scaling
  const topHeadHeight = calculateHeadHeight({
    type: state.head,
    diameter: state.diameter.calculatedValue.value,
    angle: state.topConeAngle.calculatedValue.value,
  })
  const bottomHeadHeight = calculateHeadHeight({
    type: state.bottom,
    diameter: state.diameter.calculatedValue.value,
    angle: state.bottomConeAngle.calculatedValue.value,
  })

  //Calculate scale factor
  const longestWidth = state.diameter.calculatedValue.value
  const longestHeight = state.height.calculatedValue.value + topHeadHeight + bottomHeadHeight
  const maxLength = Math.max(longestWidth, longestHeight)
  const scaleFactor = limitingDimension / maxLength

  //Calculate scaled body dimensions
  const tankDiameter = state.diameter.calculatedValue.value * scaleFactor
  const tankHeight = state.height.calculatedValue.value * scaleFactor

  //center tank
  const tankTopLeft = { x: canvasDimention.width / 2 - tankDiameter / 2, y: topHeadHeight * scaleFactor }
  const tankTopMiddle = { x: tankTopLeft.x + tankDiameter / 2, y: tankTopLeft.y }
  const tankBottomMiddle = { x: tankTopLeft.x + tankDiameter / 2, y: tankTopLeft.y + tankHeight }

  const totalTankHeight = (topHeadHeight + state.height.calculatedValue.value + bottomHeadHeight) * scaleFactor
  const percentFill = state.liquidPercent / 100

  const fillheight = totalTankHeight - totalTankHeight * percentFill

  //Find colors
  let tankOutline = containerRef.current ? window.getComputedStyle(containerRef.current).stroke : 'black'
  let tankFill = containerRef.current ? window.getComputedStyle(containerRef.current).fill : 'black'

  useEffect(() => {
    if (containerRef.current) {
      tankOutline = window.getComputedStyle(containerRef.current).stroke
      tankFill = window.getComputedStyle(containerRef.current).fill
    }
  }, [])

  const draw = (ctx: CanvasRenderingContext2D) => {
    //clear canvas
    ctx.save()
    ctx.clearRect(0, 0, canvasDimention.width, canvasDimention.height)

    const clipPath = new Path2D()

    drawHead({
      ctx: clipPath,
      top: false,
      center: tankBottomMiddle,
      diameter: tankDiameter,
      type: state.bottom,
      angle: state.bottomConeAngle.calculatedValue.value,
    }) //bottom head
    clipPath.rect(tankTopLeft.x, tankTopLeft.y, tankDiameter, tankHeight) //draw tank body
    drawHead({
      ctx: clipPath,
      top: true,
      center: tankTopMiddle,
      diameter: tankDiameter,
      type: state.head,
      angle: state.topConeAngle.calculatedValue.value,
    }) //top head

    ctx.clip(clipPath)

    //draw liquid level
    ctx.fillStyle = `${tankFill}`
    ctx.fillRect(0, fillheight, canvasDimention.width, canvasDimention.height)

    //draw tank
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
    ctx.restore()
  }

  interface HeadCtx {
    ctx: CanvasRenderingContext2D | Path2D
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
    const height = radius / Math.tan(((90 - angle) * Math.PI) / 180)

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
    const handleResize = () => {
      setCanvasDimention({
        width: containerRef.current?.clientWidth || 500,
        height: containerRef.current?.clientHeight || 500,
      })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  })

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (context) {
      draw(context)
    }
  }, [state, limitingDimension])

  return (
    <div className="h-full w-full fill-accent stroke-base-content" ref={containerRef}>
      <canvas ref={canvasRef} width={canvasDimention.width} height={canvasDimention.height} />
    </div>
  )
}

export default Canvas
