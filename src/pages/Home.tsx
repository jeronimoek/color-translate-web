import { useMemo, useState } from 'react'
import './Home.scss'
import { ColorSlider } from 'components/ColorSlider'
import ColorTranslator, { Color } from 'color-translate'

export interface ITask {
  id: number
  title: string
  description?: string | null
  estimated_time?: number | null
  parent_task_id?: number | null
  parent_task?: ITask | null
}

export function Home() {
  const [color, setColor] = useState<ColorTranslator>(
    new ColorTranslator({
      r: 255,
      g: 255,
      b: 123,
      alpha: 1,
    }),
  )

  const formats = [
    'rgb',
    'hsl',
    // 'hwb',
    'lab',
    'lch',
  ] as const

  function onClick<T extends keyof ColorTranslator>(
    percentage: number,
    format: T,
    prop: T[number],
  ) {
    setColor(
      new ColorTranslator({
        ...(color[format] as Color),
        [prop]: `${percentage * 100}%`,
      }),
    )
  }

  const sliders = useMemo(() => {
    return formats.map(format => (
      <div key={format} className="format">
        <h4>{color[format].toString()}</h4>
        {[...format.split('')].map(prop => (
          <div key={prop} className="prop">
            <ColorSlider
              onClick={percentage => {
                onClick(percentage, format, prop)
              }}
              color={color}
              format={format}
              prop={prop}
            />
          </div>
        ))}
      </div>
    ))
  }, [color, setColor])

  return (
    <div className="home">
      <div className="home_container">
        <h1>My Formats</h1>
        <div>{sliders}</div>
      </div>
    </div>
  )
}
