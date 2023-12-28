import { useMemo, useState } from 'react'
import './Home.scss'
import { ColorSlider } from 'components/ColorSlider'
import ColorTranslator from 'color-translate'
import { WarningFilled } from '@ant-design/icons'
import { Input, Tooltip, Form, message, Button } from 'antd'
import { useForm } from 'antd/es/form/Form'

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

  const { color } = colorObject
  const formats = [
    {
      format: 'rgb',
      extraFormats: [
        'hex',
        // 'hex0x'
      ],
      values: ['r', 'g', 'b'],
    },
    { format: 'hsl', values: ['h', 's', 'l'] },
    { format: 'hwb', values: ['h', 'w', 'b'] },
    { format: 'cmyk', values: ['c', 'm', 'y', 'k'] },
    { format: 'lab', values: ['l', 'a', 'b'] },
    { format: 'lch', values: ['l', 'c', 'h'] },
    { format: 'oklab', values: ['l', 'a', 'b'] },
    { format: 'oklch', values: ['l', 'c', 'h'] },
  ] as Array<{
    format: keyof ColorTranslator
    extraFormats?: Array<keyof ColorTranslator>
    values: string[]
  }>

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
    return formats.map(({ format, extraFormats, values }) => {
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
              <div>
                <b>{colorString}</b>
              </div>
              {extraFormats?.map(extraFormat => (
                <div key={extraFormat}>
                  <b>
                    {(color[extraFormat] as ColorTranslator['rgb']).toString()}
                  </b>
                </div>
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
            {values.map(value => (
              <div key={value} className="prop">
                <h4>{value.toLocaleUpperCase()}</h4>
                <ColorSlider
                  onClick={percentage => {
                    onClick(percentage, format, value)
                  }}
                  colorObject={colorObject}
                  format={format}
                  prop={value}
                />
              </div>
            ))}
          </div>
        </>
      )
    })
  }, [colorObject])

  return (
    <div className="home">
      <div className="home_container">
        <div className="sliders-header">
          <h4>Enter Color</h4>
          <Form
            form={formRef}
            onFinish={({ color }): void => {
              let newColor
              try {
                newColor = new ColorTranslator(color.trim())
              } catch (error: any) {
                void message.error({ content: error.toString() })
                return
              }
              setColorObject({ color: newColor })
              formRef.resetFields()
            }}
          >
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
