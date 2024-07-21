import ColorTranslator from 'color-translate'

export function propToPercentage<T extends keyof ColorTranslator>(
  number: number,
  format: T,
  prop: T[number],
) {
  if (prop === 'alpha' || format === 'a98') {
    return number
  } else if (format === 'rgb') {
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

export function updateColor<T extends keyof ColorTranslator>(
  percentage: number,
  format: T,
  prop: T[number],
  // color is mutated
  color: ColorTranslator,
) {
  const updateObject = {
    [prop]: format === 'a98' ? percentage : `${percentage * 100}%`,
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
    case 'a98':
      color.updateA98(updateObject)
      break
    case 'rgb':
    default:
      color.updateRgb(updateObject)
      break
  }
}
