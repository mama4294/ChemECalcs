export type TankHeadParameter = {
  [key: string]: {
    fd: number
    fk: number
    a1: number
    a2: number
    b1: number
    b2: number
    c: number
    CR: number
    KR: number
  }
}

export const tankHeadParameters: TankHeadParameter = {
  'ASME F&D': {
    fd: 1,
    fk: 0.06,
    a1: 0.1163166103,
    b1: 0.4680851064,
    a2: 0.1693376137,
    b2: 0.5,
    c: 0.080999,
    CR: 1,
    KR: 0.1,
  },
  'ASME 80/10 F&D': {
    fd: 0.8,
    fk: 0.1,
    a1: 0.1434785547,
    b1: 0.4571428571,
    a2: 0.2255437353,
    b2: 0.5,
    c: 0.109884,
    CR: 0.8,
    KR: 0.1,
  },
  'ASME 80/6 F&D': {
    fd: 0.8,
    fk: 0.06,
    a1: 0.1567794689,
    b1: 0.4756756757,
    a2: 0.2050210088,
    b2: 0.5,
    c: 0.0945365,
    CR: 0.8,
    KR: 0.06,
  },
  'ellipsoidal (2:1)': {
    fd: 0.875,
    fk: 0.17,
    a1: 0.101777034,
    b1: 0.4095744681,
    a2: 0.2520032103,
    b2: 0.5,
    c: 0.1337164,
    CR: 0.9,
    KR: 0.17,
  },
  hemisphere: {
    fd: 0.5,
    fk: 0.5,
    a1: 0.5,
    b1: 0.5,
    a2: 0.5,
    b2: 0.5,
    c: 0.2617994,
    CR: 1,
    KR: 0,
  },
}
