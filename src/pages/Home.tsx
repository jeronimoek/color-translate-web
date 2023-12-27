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
  const formats = [
    { format: 'rgb', values: ['r', 'g', 'b'] },
    { format: 'hsl', values: ['h', 's', 'l'] },
    { format: 'hwb', values: ['h', 'w', 'b'] },
    { format: 'cmyk', values: ['c', 'm', 'y', 'k'] },
    { format: 'lab', values: ['l', 'a', 'b'] },
    { format: 'lch', values: ['l', 'c', 'h'] },
    { format: 'oklab', values: ['l', 'a', 'b'] },
    { format: 'oklch', values: ['l', 'c', 'h'] },
  ] as const

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
      case 'oklab':
        color.updateOklab(updateObject)
        break
      case 'oklch':
        color.updateOklch(updateObject)
        break
      case 'cmyk':
        color.updateCmyk(updateObject)
        break
      case 'rgb':
      default:
        color.updateRgb(updateObject)
        break
    }
    setColorObject({ color })
  }

  const sliders = useMemo(() => {
    return formats.map(({ format, values }) => (
      <div key={format} className="format">
        <h4>{color[format].toString()}</h4>
        {values.map(value => (
          <div key={value} className="prop">
            <ColorSlider
              onClick={percentage => {
                onClick(percentage, format, value)
              }}
              colorObject={colorObject}
              format={format}
              prop={value}
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
