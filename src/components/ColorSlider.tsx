import { PauseCircleFilled, PlayCircleFilled } from '@ant-design/icons'
import ColorTranslator, { Color } from 'color-translate'
import { propToPercentage, updateColor } from 'shared/utils'
import { ColorSliderInput } from './ColorSliderInput'
import './ColorSlider.scss'

interface IProps {
  colorObject: { color: ColorTranslator }
  setColorObject: (input: { color: ColorTranslator }) => void
  animatedProp?: {
    format: string
    prop: string
    interval: NodeJS.Timer
  }
  setAnimatedProp: (input?: {
    format: string
    prop: string
    interval: NodeJS.Timer
  }) => void
  format: keyof ColorTranslator
  propName: string
  stopPropAnimation: () => void
}

export function ColorSlider(props: IProps) {
  const {
    colorObject,
    setColorObject,
    animatedProp,
    setAnimatedProp,
    format,
    propName,
    stopPropAnimation,
  } = props

  const { color } = colorObject

  function startPropAnimation<T extends keyof ColorTranslator>(
    format: T,
    prop: T[number],
  ) {
    stopPropAnimation()
    let increase = true
    const interval = setInterval(() => {
      const propValue = (color[format] as Color)[prop as keyof Color] as number
      let propPercentage = propToPercentage(propValue, format, prop)
      if (propPercentage > 1) {
        increase = false
      } else if (propPercentage < 0) {
        increase = true
      }
      propPercentage += 0.01 * (increase ? 1 : -1)
      if (
        (format === 'lab' || format === 'oklab') &&
        (prop === 'a' || prop === 'b')
      ) {
        propPercentage = propPercentage * 2 - 1
      }
      updateColor(propPercentage, format, prop, color)
      setColorObject({ color })
    }, 50)
    setAnimatedProp({ format, prop, interval })
  }

  function onClick<T extends keyof ColorTranslator>(
    percentage: number,
    format: T,
    prop: T[number],
  ) {
    stopPropAnimation()
    updateColor(percentage, format, prop, color)
    setColorObject({ color })
  }

  return (
    <div key={propName} className="prop">
      {animatedProp &&
      animatedProp.format === format &&
      animatedProp.prop === propName ? (
        <PauseCircleFilled
          onClick={() => {
            stopPropAnimation()
          }}
        />
      ) : (
        <PlayCircleFilled
          onClick={() => {
            startPropAnimation(format, propName)
          }}
        />
      )}
      <h4>{propName.toLocaleUpperCase()}</h4>
      <ColorSliderInput
        onClick={percentage => {
          onClick(percentage, format, propName)
        }}
        colorObject={colorObject}
        format={format}
        prop={propName}
        smooth={!!animatedProp}
      />
    </div>
  )
}
