export type MicrobeNames =
  | 'Escherichia coli'
  | 'Bacillus cereus'
  | 'Bacillus subtilis'
  | 'Staphylococcus aureus'
  | 'Clostridium perfringens'
  | 'Clostridium botulinum'
  | 'Clostridium sporogenes'
  | 'Salmonella enterica'
  | 'Custom'

export type MicrobialData = {
  value: MicrobeNames
  label: MicrobeNames
  zValue: number //C
  tRef: number //C
  dValue: number //seconds
}

export const microbialData: MicrobialData[] = [
  { value: 'Escherichia coli', label: 'Escherichia coli', zValue: 10, tRef: 121, dValue: 24 },
  { value: 'Bacillus cereus', label: 'Bacillus cereus', zValue: 10, tRef: 60, dValue: 3 },
  { value: 'Bacillus subtilis', label: 'Bacillus subtilis', zValue: 10, tRef: 121, dValue: 30 },
  { value: 'Staphylococcus aureus', label: 'Staphylococcus aureus', zValue: 10, tRef: 60, dValue: 3 },
  { value: 'Clostridium perfringens', label: 'Clostridium perfringens', zValue: 7.2, tRef: 70, dValue: 3 },
  { value: 'Clostridium botulinum', label: 'Clostridium botulinum', zValue: 10, tRef: 121, dValue: 12 },
  { value: 'Clostridium sporogenes', label: 'Clostridium sporogenes', zValue: 13, tRef: 121, dValue: 6.6 },
  { value: 'Salmonella enterica', label: 'Salmonella enterica', zValue: 10, tRef: 60, dValue: 3 },
]
