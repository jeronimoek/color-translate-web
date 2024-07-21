import ColorTranslator, { Color } from 'color-translate'
import { useMemo } from 'react'
import './ColorSliderInput.scss'
import { DEFAULT_STEPS_NUM } from 'shared/constants'
import { propToPercentage } from 'shared/utils'

export function ColorSliderInput<T extends keyof ColorTranslator>({
  colorObject,
  format,
  prop,
  stepsNum = DEFAULT_STEPS_NUM,
  onClick,
  smooth = false,
}: Readonly<{
  colorObject: { color: ColorTranslator }
  format: T
  prop: T[number]
  stepsNum?: number
  onClick: (percentage: number) => any
  smooth?: boolean
}>) {
  const { color } = colorObject

  const background = useMemo(() => {
    const steps = []

    for (let i = 0; i < stepsNum; i++) {
      let step: number
      if (format === 'a98') {
        step = i / (stepsNum - 1)
      } else if (
        (format === 'lab' || format === 'oklab') &&
        (prop === 'a' || prop === 'b')
      ) {
        step = (i / (stepsNum - 1)) * 200 - 100
      } else {
        step = (i / (stepsNum - 1)) * 100
      }

      const stringFormat = format !== 'cmyk' ? format : 'rgb'

      steps.push(
        (
          new ColorTranslator({
            ...(color[format] as Color),
            [prop]: `${step}%`,
          })[stringFormat] as { toString: () => string }
        ).toString(),
      )
    }

    return `linear-gradient(90deg, ${steps.join(', ')})`
  }, [stepsNum, colorObject])

  const propValue = (color[format] as Color)[prop as keyof Color] as number
  const propPercentage = propToPercentage(propValue, format, prop)

  function mouseDownHandler(ev: { target: EventTarget; clientX: number }) {
    function mouseMoveHandler(e: MouseEvent) {
      moveHandler(e.clientX)
    }

    function touchMoveHandler(e: TouchEvent) {
      moveHandler(e.touches[0].clientX)
    }

    function moveHandler(xCoord: number) {
      const rect = (ev.target as HTMLDivElement).getBoundingClientRect()
      let x = xCoord - rect.left
      if (x < 0) x = 0
      if (x > rect.width) x = rect.width
      let percentage = x / rect.width
      if (
        (format === 'lab' || format === 'oklab') &&
        (prop === 'a' || prop === 'b')
      ) {
        percentage = percentage * 2 - 1
      }
      onClick(percentage)
    }

    function mousemoveRemove() {
      document.removeEventListener('mousemove', mouseMoveHandler)
      document.removeEventListener('touchmove', touchMoveHandler)
      document.removeEventListener('mouseup', mousemoveRemove)
      document.removeEventListener('touchend', mousemoveRemove)
    }

    moveHandler(ev.clientX)

    document.addEventListener('mousemove', mouseMoveHandler)
    document.addEventListener('touchmove', touchMoveHandler)
    document.addEventListener('mouseup', mousemoveRemove)
    document.addEventListener('touchend', mousemoveRemove)
  }

  return (
    <div
      style={{
        background,
      }}
      className="color-slider"
      onMouseDown={mouseDownHandler}
      onTouchStart={e => {
        mouseDownHandler(e.touches[0])
      }}
    >
      <div
        className={`picker-container ${smooth ? 'smooth' : ''}`}
        style={{
          width: `calc(100% - ${propPercentage} * 100%)`,
        }}
      >
        <div className="picker" />
      </div>
    </div>
  )
}
