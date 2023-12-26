import ColorTranslator, { Color } from 'color-translate'
import { useMemo } from 'react'
import './ColorSlider.scss'

function propToPercentage<T extends keyof ColorTranslator>(
  number: number,
  format: T,
  prop: T[number],
) {
  if (format === 'rgb') {
    return number / 255
  } else if (
    (format === 'hsl' || format === 'hwb' || format === 'lch') &&
    prop === 'h'
  ) {
    return number / 360
  } else if ((format === 'lab' || format === 'lch') && prop === 'l') {
    return number / 100
  } else if (format === 'lab' && (prop === 'a' || prop === 'b')) {
    return (number / 125 + 1) / 2
  } else if (format === 'lch' && prop === 'c') {
    return number / 150
  }

  return number
}

export function ColorSlider<T extends keyof ColorTranslator>({
  color,
  format,
  prop,
  stepsNum = 7,
  onClick,
}: Readonly<{
  color: ColorTranslator
  format: T
  prop: T[number]
  stepsNum?: number
  onClick: (percentage: number) => any
}>) {
  const background = useMemo(() => {
    const steps = []

    for (let i = 0; i < stepsNum; i++) {
      let step: number
      if (format === 'lab' && (prop === 'a' || prop === 'b')) {
        step = (i / (stepsNum - 1)) * 200 - 100
      } else {
        step = (i / (stepsNum - 1)) * 100
      }

      steps.push(
        (
          new ColorTranslator({
            ...(color[format] as Color),
            [prop]: `${step}%`,
          })[format] as { toString: () => string }
        ).toString(),
      )
    }

    return `linear-gradient(90deg, ${steps.join(', ')})`
  }, [stepsNum, color])

  const propValue = (color[format] as Color)[prop as keyof Color] as number
  const propPercentage = propToPercentage(propValue, format, prop)

  return (
    <div
      style={{
        background,
      }}
      className="color-slider"
      onMouseDown={ev => {
        function mousemoveHandler(e: MouseEvent) {
          const rect = (ev.target as Element).getBoundingClientRect()
          const x = e.clientX - rect.left
          if (x < 0 || x > rect.width) return
          let percentage = x / rect.width
          if (format === 'lab' && (prop === 'a' || prop === 'b')) {
            percentage = percentage * 2 - 1
          }
          onClick(percentage)
        }

        function mousemoveRemove() {
          document.removeEventListener('mousemove', mousemoveHandler)
          document.removeEventListener('mouseup', mousemoveRemove)
        }

        mousemoveHandler(ev as any)

        document.addEventListener('mousemove', mousemoveHandler)
        document.addEventListener('mouseup', mousemoveRemove)
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
