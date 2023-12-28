import ColorTranslator, { Color } from 'color-translate'
import { useMemo } from 'react'
import './ColorSlider.scss'
import { DEFAULT_STEPS_NUM } from 'shared/constants'

function propToPercentage<T extends keyof ColorTranslator>(
  number: number,
  format: T,
  prop: T[number],
) {
  if (format === 'rgb') {
    return number / 255
  } else if (
    (format === 'hsl' ||
      format === 'hwb' ||
      format === 'lch' ||
      format === 'oklch') &&
    prop === 'h'
  ) {
    return number / 360
  } else if ((format === 'lab' || format === 'lch') && prop === 'l') {
    return number / 100
  } else if (format === 'lab' && (prop === 'a' || prop === 'b')) {
    return (number / 125 + 1) / 2
  } else if (format === 'lch' && prop === 'c') {
    return number / 150
  } else if (format === 'oklab' && (prop === 'a' || prop === 'b')) {
    return (number / 0.4 + 1) / 2
  } else if (format === 'oklch' && prop === 'c') {
    return number / 0.4
  }

  return number
}

export function ColorSlider<T extends keyof ColorTranslator>({
  colorObject,
  format,
  prop,
  stepsNum = DEFAULT_STEPS_NUM,
  onClick,
}: Readonly<{
  colorObject: { color: ColorTranslator }
  format: T
  prop: T[number]
  stepsNum?: number
  onClick: (percentage: number) => any
}>) {
  const { color } = colorObject

  const background = useMemo(() => {
    const steps = []

    for (let i = 0; i < stepsNum; i++) {
      let step: number
      if (
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
        className="picker-container"
        style={{
          width: `calc(100% - ${propPercentage} * 100%)`,
        }}
      >
        <div className="picker" />
      </div>
    </div>
  )
}
