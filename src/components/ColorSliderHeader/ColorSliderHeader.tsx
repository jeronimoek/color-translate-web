import { WarningFilled } from '@ant-design/icons'
import { Tooltip } from 'antd'
import ColorTranslator from 'color-translate'
import './ColorSliderHeader.scss'

interface IProps {
  color: ColorTranslator
  format: keyof ColorTranslator
  extraFormats?: Array<keyof ColorTranslator>
}

export function ColorSliderHeader(props: IProps) {
  const { color, format, extraFormats } = props

  const colorString = (color[format] as ColorTranslator['rgb']).toString()
  const colorUncappedString = (
    color[format] as ColorTranslator['rgb']
  ).toString({ limitToColorSpace: false })

  const inColorSpace = colorString === colorUncappedString

  return (
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
  )
}
