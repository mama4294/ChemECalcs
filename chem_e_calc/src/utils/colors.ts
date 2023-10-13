'use client'

export interface ThemeColors {
  primary: string
  primaryFocus: string
  primaryContent: string
  secondary: string
  secondaryFocus: string
  secondaryContent: string
  accent: string
  accentFocus: string
  accentContent: string
  neutral: string
  neutralFocus: string
  neutralContent: string
  base100: string
  base200: string
  base300: string
  baseContent: string
  info: string
  infoContent: string
  success: string
  successContent: string
  warning: string
  warningContent: string
  error: string
  errorContent: string
}
export function extractThemeColorsFromDOM(): ThemeColors {
  const computedStyles = getComputedStyle(document.querySelector(':root')!)
  return {
    primary: `hsl(${computedStyles.getPropertyValue('--p')}`,
    primaryFocus: `hsl(${computedStyles.getPropertyValue('--pf')}`,
    primaryContent: `hsl(${computedStyles.getPropertyValue('--pc')}`,
    secondary: `hsl(${computedStyles.getPropertyValue('--s')}`,
    secondaryFocus: `hsl(${computedStyles.getPropertyValue('--sf')}`,
    secondaryContent: `hsl(${computedStyles.getPropertyValue('--sc')}`,
    accent: `hsl(${computedStyles.getPropertyValue('--a')}`,
    accentFocus: `hsl(${computedStyles.getPropertyValue('--af')}`,
    accentContent: `hsl(${computedStyles.getPropertyValue('--ac')}`,
    neutral: `hsl(${computedStyles.getPropertyValue('--n')}`,
    neutralFocus: `hsl(${computedStyles.getPropertyValue('--nf')}`,
    neutralContent: `hsl(${computedStyles.getPropertyValue('--nc')}`,
    base100: `hsl(${computedStyles.getPropertyValue('--b1')}`,
    base200: `hsl(${computedStyles.getPropertyValue('--b2')}`,
    base300: `hsl(${computedStyles.getPropertyValue('--b3')}`,
    baseContent: `hsl(${computedStyles.getPropertyValue('--bc')}`,
    info: `hsl(${computedStyles.getPropertyValue('--in')}`,
    infoContent: `hsl(${computedStyles.getPropertyValue('--inc')}`,
    success: `hsl(${computedStyles.getPropertyValue('--su')}`,
    successContent: `hsl(${computedStyles.getPropertyValue('--suc')}`,
    warning: `hsl(${computedStyles.getPropertyValue('--wa')}`,
    warningContent: `hsl(${computedStyles.getPropertyValue('--wac')}`,
    error: `hsl(${computedStyles.getPropertyValue('--er')}`,
    errorContent: `hsl(${computedStyles.getPropertyValue('--erc')}`,
  }
}

//extract color from CSS
export const extractColorFromCSS = (color: string) => {
  if (typeof window == 'undefined') {
    return 'hsl(215 28% 17%)'
  }

  const styles = getComputedStyle(document.querySelector(':root')!)
  const computedColor = `hsl(${styles.getPropertyValue(color)})`

  return computedColor || 'hsl(215 28% 17%)'
}
