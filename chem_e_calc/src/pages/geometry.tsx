import Link from "next/link"
import { useState, useEffect} from "react"
import { units, Units, convertUnits, roundTo2 } from "../../utils/units"
import { CalcCard } from "../components/calculators/calcCard"



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
                <p>This calculates the volume of geometric shapes with various units</p>
            </div>

             {/* Calculator */}
             <div className="flex flex-wrap gap-8">
                <CalculatorContainer/>
                <CodeContainer/>
             </div>

        </div>
    )
}

export default Geometry


const CalculatorContainer = () =>{

    const [values, setValues] = useState<InputType[]>([
    {
        id: 1,
        name: 'diameter',
        unitType: 'length',
        type: 'number',
        placeholder: 'enter value',
        label: "Diameter",
        displayValue: {value: 68, unit: "ft"},
        calculatedValue: {value: convertUnits({value: 68, fromUnit:"ft", toUnit: "m" }), unit: "m"},
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
        calculatedValue: {value: convertUnits({value: 68, fromUnit:"ft", toUnit: "m" }), unit: "m"},
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
        calculatedValue: {value: convertUnits({value: 682, fromUnit:"gal", toUnit: "m3" }), unit: "m3"},
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
    //create a new values array with changed value
    const newArr = values.map((o)=>{
        if(o.id === id){
            const convertedValue = convertUnits({value: o.displayValue.value, fromUnit: unit, toUnit: o.calculatedValue.unit})
            return {...o, displayValue: {value: o.displayValue.value, unit: unit}, calculatedValue: {value: convertedValue, unit: o.calculatedValue.unit}}
        } 
        else return o;
    }) 
    
    //Set answer 
    const answerArr = calcVolume(newArr)
    if(answerArr){
        setValues(answerArr)
    } else{
        setValues(newArr)
    }
}

const changeValue = (id: number, number: number):void =>{
     //create a new values array with changed value
    const newArr = values.map((o)=>{
        if(o.id === id){
            const convertedValue = convertUnits({value: number, fromUnit: o.displayValue.unit, toUnit: o.calculatedValue.unit})
            return {...o, displayValue: {value: number, unit: o.displayValue.unit}, calculatedValue: {value: convertedValue, unit: o.calculatedValue.unit}}
        } 
        else return o;
    })
    //Set answer 
    const answerArr = calcVolume(newArr)
    if(answerArr){
        setValues(answerArr)
    } else{
        setValues(newArr)
    }
}


  //Calculate volume
  const calcVolume = (inputArray: InputType[]) =>{
    const diameterObj = inputArray.find((o)=> o.name === "diameter")
    const heightObj = inputArray.find((o)=> o.name === "height")

    const inputs = [{type: "diameter", value: diameterObj?.displayValue.value, unit: diameterObj?.displayValue.unit}, {type: "height", value: heightObj?.displayValue.value, unit: heightObj?.displayValue.unit},]
    console.table(inputs)

    if(!diameterObj || !heightObj) {
    alert("inputs to calculator undefined")
    return null}


    const answerValue = Math.PI*((diameterObj.calculatedValue.value/2)**2)*heightObj.calculatedValue.value;
    console.log("Calculated value: ", answerValue)
    return inputArray.map((o)=>{
        //convert calculed value to display value
        if(o.name==="volume"){
            const displayValue = convertUnits({value: answerValue, fromUnit: o.calculatedValue.unit, toUnit: o.displayValue.unit})
            console.log("Display value: ", displayValue)
            return {...o, displayValue: {value: roundTo2(displayValue), unit: o.displayValue.unit}, calculatedValue:{value: answerValue, unit: o.calculatedValue.unit}}
        }
            else return o;
    }
    )
}




    return(
        <CalcCard title="Cylinder">
            <>            
            <SolveForDropdown options={values} onChange={changeSolveSelection}/>
            <div className="flex flex-col mb-8">
                {values.map((input)=>{
                    return(
                       <InputField key={input.id} data={input} onChangeUnit={changeUnit} onChangeValue={changeValue} />
                    )
                })}       
            </div>
            </>
        </CalcCard>

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
                {units[unitType as keyof Units].map((unitOption: string, index)=>{
                    return <option key={index}>{unitOption}</option>
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
    calculatedValue: 
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

const CodeContainer = () =>{
    return(
        <CalcCard title="Equation">
            <div className="mockup-code min-w-full">
                <pre><code>V = PI()*r^2*h</code></pre> 
                <pre><code>V = lskfja</code></pre> 
                <pre className="text-success"><code>V = 234 gal</code></pre>
            </div>
        </CalcCard>
    )
}