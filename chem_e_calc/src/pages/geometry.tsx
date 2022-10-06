import Link from "next/link"
import { useState } from "react"
import { units, Units, convertUnits } from "../../utils/units"



const Geometry = () =>{
    return(
        <div className="max-w-xs md:max-w-2xl lg:max-w-4xl 2xl:max-w-6xl mx-auto mb-24" > 
            {/* Breadcrumbs */}
            <div className="text-sm breadcrumbs">
                <ul>
                    <li><Link href={'/'}><a>Home</a></Link></li> 
                    <li><Link href={'/geometry'}><a>Geomentry</a></Link></li> 
                </ul>
            </div>

            {/* Page Title */}
            <div className="mt-4 mb-8">
                <h1 className="text-2xl">
                    Geometry
                </h1>
                <p>This calculates the volume of several geometric shapes with different units</p>
            </div>

             {/* Calculator */}
             <div className="flex flex-wrap gap-8">
                <SectionContainer/>
             </div>

        </div>
    )
}

export default Geometry


const SectionContainer = () =>{

    const [values, setValues] = useState<InputType[]>([
    {
        id: 1,
        name: 'diameter',
        unitType: 'length',
        type: 'number',
        placeholder: 'enter value',
        label: "Diameter",
        displayValue: {value: 68, unit: "ft"},
        convertedValue: {value: 0, unit: "m"},
        solveable: true,
        selectiontext: "Solve for Diameter",
        selected: false,
    },
    {
        id: 2,
        name: 'height',
        unitType: 'length',
        type: 'number',
        placeholder: 'enter value',
        label: "Height",
        displayValue: {value: 68, unit: "ft"},
        convertedValue: {value: 0, unit: "m"},
        solveable: true,
        selectiontext: "Solve for Height",
        selected: false,
    },
    {
        id: 3,
        name: 'volume',
        unitType: 'volume',
        type: 'number',
        placeholder: 'enter value',
        label: "Volume",
        displayValue: {value: 682, unit: "gal"},
        convertedValue: {value: 0, unit: "m3"},
        solveable: true,
        selectiontext: "Solve for Voluem",
        selected: true,
    },
])

const changeSolveSelection = (id: number):void =>{
    const newArr = values.map((o)=>{
        if(o.id === id) return {...o, selected: true}
        else return {...o, selected: false}
    })
    setValues(newArr)
}

const changeUnit = (id: number, unit: string):void =>{
    const newArr = values.map((o)=>{
        if(o.id === id){
            const existingValue = o.displayValue.value
            const convertedValue = convertUnits({value: existingValue, fromUnit: unit, toUnit: o.convertedValue.unit})
            console.log(`${existingValue} ${unit} is ${convertedValue} ${o.convertedValue.unit}`)
            return {...o, displayValue: {value: existingValue, unit: unit}}
        } 
        else return o;
    })
    setValues(newArr)
}

const changeValue = (id: number, value: number):void =>{
    const newArr = values.map((o)=>{
        if(o.id === id){
            const existingUnit = o.displayValue.unit
            return {...o, displayValue: {value: value, unit: existingUnit}}
        } 
        else return o;
    })
    setValues(newArr)
}


//Fix this
const updateConvertedValue = (id: number, value: number):void =>{
    const newArr = values.map((o)=>{
        if(o.id === id){
            const convertedUnit = o.convertedValue.unit
            return {...o, convertedValue: {value: value, unit: convertedUnit}}
        } 
        else return o;
    })
    setValues(newArr)
}

    return(
        <div className = "bg-base-100 p-4 rounded w-full md:w-[calc(50%_-_2rem)] lg:w-w-[calc(33.33%_-_2rem)] shadow-lg ">
        <div>
            <h2 className="mb-4 text-xl">Calculator</h2>
            <SolveForDropdown options={values} onChange={changeSolveSelection}/>
            <div className="flex flex-col mb-8">
                {values.map((input)=>{
                    return(
                       <InputField key={input.id} data={input} onChangeUnit={changeUnit} onChangeValue={changeValue} />
                    )
                })}       
            </div>
        </div>
    </div>
    )
}

type InputFieldProps = {
    data: InputType,
    onChangeUnit: (id: number, unit: string) => void,
    onChangeValue: (id: number, value: number) => void,
}


const InputField = ({data, onChangeUnit, onChangeValue}:InputFieldProps) =>{
    const {id, label, placeholder, type, selected, displayValue, unitType} = data
    const {value, unit} = displayValue;

    return(
    <div className="form-control w-full">
        <label className="label">
            <span className="label-text">{label}</span>
        </label>
        <label className="input-group">
            <input className="input input-bordered w-full" type={type} value={value} placeholder={placeholder} disabled={selected} onChange={(e)=>onChangeValue(id, Number(e.target.value))}/>
            <select className="select input-bordered bg-base-200 text-base-content" value={unit} onChange={(e)=>onChangeUnit(id, e.target.value)}>
                {units[unitType as keyof Units].map((unitOption: string)=>{
                    return <option>{unitOption}</option>
                })}
            </select>
     </label>
    </div>
    
    )
}

type InputType = {
    id: number
    name: string,
    unitType: string,
    type: string,
    placeholder: string,
    label: string,
    displayValue: 
    {
        value: number,
        unit: string
    },
    convertedValue: 
    {
        value: number,
        unit: string
    }
    solveable: boolean,
    selectiontext: string,
    selected: boolean,
}

type SolveForProps = {
    options: InputType[],
    onChange: (id:number) => void,
}


const SolveForDropdown = ({options, onChange}: SolveForProps) =>{

    const selectedValueId = options.find((option) => option.selected === true)?.id

    return(
        <select className="select input-bordered bg-base-200 text-base-content w-full" value={selectedValueId} onChange={(e)=>onChange(Number(e.target.value))}>
            {options.map((option)=>{
                if(option.solveable)return( <option key={option.id} value={option.id}>{option.label}</option>)
            })}
    </select>
    )
}