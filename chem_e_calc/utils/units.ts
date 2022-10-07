let convert = require('convert-units')

export const convertUnits = ({value, fromUnit, toUnit}:{value:number, fromUnit:string, toUnit:string}) =>{
    return convert(value).from(fromUnit).to(toUnit)
}

export const roundTo2 = (num: number) =>{
    return Math.round(num * 100) / 100
}


export interface Units {
    mass: string[],
    volume: string[],
    length: string[],
    area: string[],
    flowrate: string[],
    temperature: string[],
    speed: string[],
    pressure: string[],
    voltage: string[],
    current: string[],
    power: string[],
}

export const units = {
    mass: [
        "mg",
        "g",
        "kg",
        "oz",
        "lb",
        "mt",
        "t",
    ],
    volume: [
        "mm3",
        "cm3",
        "ml",
        "l",
        "m3",
        "km3",
        "tsp",
        "Tbs",
        "in3",
        "fl-oz",
        "cup",
        "pnt",
        "qt",
        "gal",
        "ft3",
        "yd3",
    ],
    length: [
        "mm",
        "cm",
        "m",
        "in",
        "ft",
        "mi",
    ],
    area:[
        "mm2",
        "cm2",
        "m2",
        "ha",
        "km2",
        "in2",
        "ft2",
        "mi2",
    ],
    flowrate:[
        "mm3/s",
        "cm3/s",
        "ml/s",
        "l/s",
        "l/min",
        "l/h",
        "kl/s",
        "kl/min",
        "kl/h",
        "m3/s",
        "m3/min",
        "m3/h",
        "km3/s",
        "tsp/s",
        "Tbs/s",
        "in3/s",
        "in3/min",
        "in3/h",
        "fl-oz/s",
        "fl-oz/min",
        "fl-oz/h",
        "cup/s",
        "pnt/s",
        "pnt/min",
        "pnt/h",
        "qt/s",
        "gal/s",
        "gal/min",
        "gal/h",
        "ft3/s",
        "ft3/min",
        "ft3/h",
        "yd3/s",
        "yd3/min",
        "yd3/h'",
    ],
    temperature: [
        "C",
        "F",
        "K",
        "R",
    ],
    speed: [
        "m/s",
        "km/h",
        "m/h",
        "knot",
        "ft/s",
            ],
    pressure: [
        "Pa",
        "hPa",
        "kPa",
        "MPa",
        "bar",
        "torr",
        "psi",
        "ksi",
    ],
    voltage: [
        "V",
        "mV",
        "kV",
    ],
    current: [
        "A",
        "mA",
        "kA",
    ],
    power: [
        "W",
        "mW",
        "kW",
        "MW",
        "GW",
    ]      

}