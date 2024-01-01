import { useMemo, useState } from 'react'
import './Home.scss'
import ColorTranslator from 'color-translate'
import { Input, Form, message, Button } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { ColorSlider } from 'components/ColorSlider/ColorSlider'
import { ColorSliderHeader } from 'components/ColorSliderHeader/ColorSliderHeader'
import { GithubLogo } from 'components/GithubLogo/GithubLogo'

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
      r: 0,
      g: 200,
      b: 200,
    }),
  })
  const [animatedProp, setAnimatedProp] = useState<{
    format: string
    prop: string
    interval: NodeJS.Timer
  }>()

  const { color } = colorObject

  function stopPropAnimation() {
    if (animatedProp) {
      clearInterval(animatedProp.interval)
      setAnimatedProp(undefined)
    }
  }

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

  function onFinish({ color }: { color: string }): void {
    if (!color) return
    let newColor
    try {
      newColor = new ColorTranslator(color.trim())
    } catch (error: any) {
      void message.error({
        content: error.toString(),
        duration: 1,
      })
      return
    }
    stopPropAnimation()
    setColorObject({ color: newColor })
    formRef.resetFields()
  }

  const sliders = useMemo(() => {
    return formats.map(({ format, extraFormats, propNames }) => (
      <>
        <ColorSliderHeader
          color={color}
          format={format}
          extraFormats={extraFormats}
        />
        <div>
          {propNames.map(propName => (
            <ColorSlider
              key={propName}
              colorObject={colorObject}
              setColorObject={setColorObject}
              animatedProp={animatedProp}
              setAnimatedProp={setAnimatedProp}
              format={format}
              propName={propName}
              stopPropAnimation={stopPropAnimation}
            />
          ))}
        </div>
      </>
    ))
  }, [colorObject, animatedProp])

  const alphaSlider = useMemo(() => {
    return (
      <div>
        <ColorSlider
          colorObject={colorObject}
          setColorObject={setColorObject}
          animatedProp={animatedProp}
          setAnimatedProp={setAnimatedProp}
          format="rgb"
          propName="alpha"
          stopPropAnimation={stopPropAnimation}
        />
      </div>
    )
  }, [colorObject, animatedProp])

  return (
    <>
      <div className="home">
        <div className="home_container">
          <h2 className="title">Color Translator and Picker</h2>
          <div className="header">
            <Form form={formRef} onFinish={onFinish} className="color-form">
              <Form.Item name="color">
                <Input
                  size="small"
                  className="color-input"
                  placeholder={color.rgb.toString()}
                />
              </Form.Item>
              <Button type="primary" htmlType="submit" className="color-submit">
                SET
              </Button>
            </Form>
          </div>
          <div
            className="selected-color"
            style={{ backgroundColor: color.oklch.toString() }}
          />
          <div className="alpha-slider">{alphaSlider}</div>
          <div className="sliders">{sliders}</div>
        </div>
      </div>
      <GithubLogo />
    </>
  )
}
