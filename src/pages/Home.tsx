import { useMemo, useState } from 'react'
import './Home.scss'
import { ColorSlider } from 'components/ColorSlider'
import ColorTranslator from 'color-translate'
import { DEFAULT_STEPS_NUM } from 'shared/constants'

export interface ITask {
  id: number
  title: string
  description?: string | null
  estimated_time?: number | null
  parent_task_id?: number | null
  parent_task?: ITask | null
}

export function Home() {
  const [stepsNum, setStepsNum] = useState<number>(DEFAULT_STEPS_NUM)
  const [colorObject, setColorObject] = useState<{ color: ColorTranslator }>({
    color: new ColorTranslator({
      r: 255,
      g: 255,
      b: 123,
      alpha: 1,
    }),
  })

  const { color } = colorObject

  const formats = ['rgb', 'hsl', 'hwb', 'lab', 'lch'] as const

  function onClick<T extends keyof ColorTranslator>(
    percentage: number,
    format: T,
    prop: T[number],
  ) {
    const updateObject = {
      [prop]: `${percentage * 100}%`,
    }

    switch (format) {
      case 'hsl':
        color.updateHsl(updateObject)
        break
      case 'hwb':
        color.updateHwb(updateObject)
        break
      case 'lab':
        color.updateLab(updateObject)
        break
      case 'lch':
        color.updateLch(updateObject)
        break
      case 'rgb':
      default:
        color.updateRgb(updateObject)
        break
    }
    setColorObject({ color })
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
              colorObject={colorObject}
              format={format}
              prop={prop}
              stepsNum={stepsNum}
            />
          </div>
        ))}
      </div>
    ))
  }, [stepsNum, colorObject])

  return (
    <div className="home">
      <div className="home_container">
        <h1>My Formats</h1>
        <div>
          <input
            type="number"
            value={stepsNum}
            min={0}
            max={100}
            onChange={e => {
              setStepsNum(parseInt(e.target.value))
            }}
          />
        </div>
        <div>{sliders}</div>
      </div>
    </div>
  )
}
