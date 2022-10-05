import Link from "next/link"
import { type } from "os"

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
    return(
        <div className = "bg-base-200 p-4 rounded w-full md:w-[calc(50%_-_2rem)] lg:w-w-[calc(33.33%_-_2rem)] shadow-lg ">
        <div>
            <h2 className="mb-4 text-xl">Data</h2>
            <div className="flex flex-col mb-8">
                <InputField title="Diameter" placeholder="type here" type="number" min="0"/>
                <InputField title="Height" placeholder="type here" type="number" min="0"/>
                <InputField title="Volume" placeholder="type here" type="number" min="0" disabled={true}/>
            </div>
        </div>
    </div>
    )
}


type Input = {
    title: string,
    placeholder: string,
    type: string,
    [x:string]: any;
}

const InputField = ({title, placeholder, type, ...inputProps}:Input) =>{
    return(
    <div className="form-control w-full">
        <label className="label">
            <span className="label-text">{title}</span>
        </label>
        <input type={type} placeholder={placeholder} className="input input-bordered w-full" {...inputProps}/>
    </div>
    )
}