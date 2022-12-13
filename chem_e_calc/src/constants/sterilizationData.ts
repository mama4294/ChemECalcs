export type MicrobeNames =
  | 'Escherichia coli'
  | 'Bacillus cereus'
  | 'Staphylococcus aureus'
  | 'Clostridium perfringens'
  | 'Salmonella enterica'
  | 'Custom'

export type MicrobialData = {
  value: MicrobeNames
  label: MicrobeNames
  zValue: number
  tRef: number
  dValue: number
}

export const microbialData: MicrobialData[] = [
  { value: 'Escherichia coli', label: 'Escherichia coli', zValue: 10, tRef: 121, dValue: 24 },
  { value: 'Bacillus cereus', label: 'Bacillus cereus', zValue: 10, tRef: 60, dValue: 3 },
  { value: 'Staphylococcus aureus', label: 'Staphylococcus aureus', zValue: 10, tRef: 60, dValue: 3 },
  { value: 'Clostridium perfringens', label: 'Clostridium perfringens', zValue: 7.2, tRef: 70, dValue: 3 },
  { value: 'Salmonella enterica', label: 'Salmonella enterica', zValue: 10, tRef: 60, dValue: 3 },
]
