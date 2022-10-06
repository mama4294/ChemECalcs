import Link from "next/link"
import { type } from "os"
import { useState } from "react"

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
                <SectionContainer/>
                <SectionContainer/>
                <SectionContainer/>
             </div>

        </div>
    )
}

export default Geometry


const SectionContainer = () =>{

    const [solveSelection, setSolveSelection]=useState<SolveSelection[]>([
        {
            id:1,
            label:"Volume",
            active: false
        },
        {
            id:2,
            label:"Height",
            active: true
        },
        {
            id:3,
            label:"Diameter",
            active: false
        }
    ])

    const changeSolveSelection = (id: number):void =>{
        const newArr = solveSelection.map((option)=>{
            if(option.id === id) return {...option, active: true}
            else return {...option, active: false}
        })
        setSolveSelection(newArr)
    }

    const [data, setData] = useState([
    {
        id: 1,
        name: 'diameter',
        type: 'number',
        placeholder: 'enter value',
        label: "Diameter",
        value: 68,
        disabled: false,
    },
    {
        id: 2,
        name: 'height',
        type: 'number',
        placeholder: 'enter value',
        label: "Height",
        value: 12,
        disabled: false,
    },
    {
        id: 3,
        name: 'volume',
        type: 'number',
        placeholder: 'enter value',
        label: "Volume",
        value: 222,
        disabled: true,
    },
])


    return(
        <div className = "bg-base-100 p-4 rounded w-full md:w-[calc(50%_-_2rem)] lg:w-w-[calc(33.33%_-_2rem)] shadow-lg ">
        <div>
            <h2 className="mb-4 text-xl">Data</h2>
            <SolveFor options={solveSelection} onChange={changeSolveSelection}/>
            <div className="flex flex-col mb-8">
                {data.map((input)=>{
                    return(
                       <InputField key={input.id} {...input}/>
                    )
                })}       
            </div>
        </div>
    </div>
    )
}


type Input = {
    label: string,
    placeholder: string,
    type: string,
    [x:string]: any;
}

const InputField = ({label, placeholder, type, ...inputProps}:Input) =>{
    return(
    <div className="form-control w-full">
        <label className="label">
            <span className="label-text">{label}</span>
        </label>
        <label className="input-group">
            <input type={type} placeholder={placeholder} className="input input-bordered w-full" {...inputProps}/>
            {/* <span>L</span> */}
            <select className="select input-bordered bg-base-200 text-base-content">
                <option selected>ft</option>
                <option>in</option>
                <option>cm</option>
                <option>m</option>
            </select>
     </label>
    </div>
    
    )
}

type SolveSelection = {
    id: number
    label:string,
    active: boolean
}

type SolveForProps = {
    options: SolveSelection[],
    onChange: (id:number) => void,
}

const SolveFor = ({options, onChange}:SolveForProps) =>{

    return(
        <div>
            <div>Solve for</div>
            <div className="btn-group">
                {options.map((option)=>{
                    const {label, active, id} = option
                    return(
                        <button className={`btn ${active ? "btn-active": ""}`} onClick={()=>onChange(id)}>{label}</button>
                    )
                })}
            </div>
        </div>
    )
}