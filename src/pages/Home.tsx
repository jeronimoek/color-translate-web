import { useMemo, useState } from 'react'
import './Home.scss'
import { ColorSlider } from 'components/ColorSlider'
import ColorTranslator, { Color } from 'color-translate'
import {
  PauseCircleFilled,
  PlayCircleFilled,
  WarningFilled,
} from '@ant-design/icons'
import { Input, Tooltip, Form, message, Button } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { propToPercentage, updateColor } from 'shared/utils'

export interface ITask {
  id: number
  title: string
  description?: string | null
  estimated_time?: number | null
  parent_task_id?: number | null
  parent_task?: ITask | null
}

export function Home() {
  const [formRef] = useForm()
  const [colorObject, setColorObject] = useState<{ color: ColorTranslator }>({
    color: new ColorTranslator({
      r: 255,
      g: 255,
      b: 123,
      alpha: 1,
    }),
  })
  const [animatedProp, setAnimatedProp] = useState<{
    format: string
    prop: string
    interval: NodeJS.Timer
  }>()

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

  function stopPropAnimation() {
    if (animatedProp) {
      clearInterval(animatedProp.interval)
      setAnimatedProp(undefined)
    }
  }

  const { color } = colorObject
  const formats = [
    {
      format: 'rgb',
      extraFormats: [
        'hex',
        // 'hex0x'
      ],
      propNames: ['r', 'g', 'b'],
    },
    { format: 'hsl', propNames: ['h', 's', 'l'] },
    { format: 'hwb', propNames: ['h', 'w', 'b'] },
    { format: 'cmyk', propNames: ['c', 'm', 'y', 'k'] },
    { format: 'lab', propNames: ['l', 'a', 'b'] },
    { format: 'lch', propNames: ['l', 'c', 'h'] },
    { format: 'oklab', propNames: ['l', 'a', 'b'] },
    { format: 'oklch', propNames: ['l', 'c', 'h'] },
  ] as Array<{
    format: keyof ColorTranslator
    extraFormats?: Array<keyof ColorTranslator>
    propNames: string[]
  }>

  function onClick<T extends keyof ColorTranslator>(
    percentage: number,
    format: T,
    prop: T[number],
  ) {
    stopPropAnimation()
    updateColor(percentage, format, prop, color)
    setColorObject({ color })
  }

  function onFinish({ color }: { color: string }): void {
    if (!color) return
    let newColor
    try {
      newColor = new ColorTranslator(color.trim())
    } catch (error: any) {
      void message.error({ content: error.toString() })
      return
    }
    setColorObject({ color: newColor })
    formRef.resetFields()
  }

  const sliders = useMemo(() => {
    return formats.map(({ format, extraFormats, propNames }) => {
      const colorString = (color[format] as ColorTranslator['rgb']).toString()
      const colorUncappedString = (
        color[format] as ColorTranslator['rgb']
      ).toString({ limitToColorSpace: false })

      const inColorSpace = colorString === colorUncappedString

      return (
        <>
          <div className="slider-header">
            <h1>{format.toLocaleUpperCase()}</h1>
            <div>
              <h4>{colorString}</h4>
              {extraFormats?.map(extraFormat => (
                <h4 key={extraFormat}>
                  {(color[extraFormat] as ColorTranslator['rgb']).toString()}
                </h4>
              ))}
            </div>
            {!inColorSpace && (
              <Tooltip
                color="white"
                title="The color doesn't fit in this color space"
              >
                <WarningFilled />
              </Tooltip>
            )}
          </div>
          <div>
            {propNames.map(propName => (
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
                <ColorSlider
                  onClick={percentage => {
                    onClick(percentage, format, propName)
                  }}
                  colorObject={colorObject}
                  format={format}
                  prop={propName}
                  smooth={!!animatedProp}
                />
              </div>
            ))}
          </div>
        </>
      )
    })
  }, [colorObject, animatedProp])

  return (
    <div className="home">
      <div className="home_container">
        <div className="header">
          <h4>Enter Color</h4>
          <Form form={formRef} onFinish={onFinish}>
            <Form.Item name="color">
              <Input size="small" className="color-input" />
            </Form.Item>
            <Button type="primary" htmlType="submit" className="color-submit">
              <span>OK</span>
            </Button>
          </Form>
        </div>
        <div className="sliders">{sliders}</div>
      </div>
    </div>
  )
}
