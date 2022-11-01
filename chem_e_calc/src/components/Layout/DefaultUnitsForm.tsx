import { useRef, useState, useContext } from 'react'
import { DefaultUnitContext, DefaultUnitContextType } from '../../contexts/defaultUnitContext'
import { unitOptions, UnitOptions, UnitOption } from '../../utils/units'

export const DefaultUnitsForm = () => {
  const { defaultUnits, setDefaultUnits } = useContext(DefaultUnitContext) as DefaultUnitContextType
  const [formData, setFormData] = useState(defaultUnits)

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setDefaultUnits(formData)
    localStorage.setItem('defaultUnits', JSON.stringify(formData))
    closeModalBtnRef.current?.click()
  }

  const handleChange = (e: React.SyntheticEvent) => {
    const { name, value } = e.target as HTMLInputElement
    const newArr = { ...formData, [name]: value }
    setFormData(newArr)
  }

  const closeModalBtnRef = useRef<HTMLInputElement>(null)

  return (
    <>
      {/* Button to open modal */}
      <label htmlFor="units-modal" className="modal-button btn btn-circle">
        <UnitsIcon />
      </label>

      {/* Modal */}
      <input type="checkbox" id="units-modal" className="modal-toggle" ref={closeModalBtnRef} />
      <label htmlFor="units-modal" className="modal cursor-pointer ">
        <label className="modal-box relative bg-base-200 p-6 ring-1 ring-black/5" htmlFor="">
          <h3 className="text-lg font-medium leading-6">Default Units</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4  p-4 pb-8 text-center md:grid-cols-3">
              <UnitInput
                label="Mass"
                value={formData.mass}
                onChange={handleChange}
                options={unitOptions['mass' as keyof UnitOptions]}
              />
              <UnitInput
                label="Volume"
                value={formData.volume}
                onChange={handleChange}
                options={unitOptions['volume' as keyof UnitOptions]}
              />
              <UnitInput
                label="Length"
                value={formData.length}
                onChange={handleChange}
                options={unitOptions['length' as keyof UnitOptions]}
              />
              <UnitInput
                label="Area"
                value={formData.area}
                onChange={handleChange}
                options={unitOptions['area' as keyof UnitOptions]}
              />
              <UnitInput
                label="Flowrate"
                value={formData.volumeFlowRate}
                onChange={handleChange}
                options={unitOptions['volumeFlowRate' as keyof UnitOptions]}
              />
              <UnitInput
                label="Temperature"
                value={formData.temperature}
                onChange={handleChange}
                options={unitOptions['temperature' as keyof UnitOptions]}
              />
              <UnitInput
                label="Speed"
                value={formData.speed}
                onChange={handleChange}
                options={unitOptions['speed' as keyof UnitOptions]}
              />
              <UnitInput
                label="Pressure"
                value={formData.pressure}
                onChange={handleChange}
                options={unitOptions['pressure' as keyof UnitOptions]}
              />
              <UnitInput
                label="Voltage"
                value={formData.voltage}
                onChange={handleChange}
                options={unitOptions['voltage' as keyof UnitOptions]}
              />
              <UnitInput
                label="Current"
                value={formData.current}
                onChange={handleChange}
                options={unitOptions['current' as keyof UnitOptions]}
              />
              <UnitInput
                label="Power"
                value={formData.power}
                onChange={handleChange}
                options={unitOptions['power' as keyof UnitOptions]}
              />
              <UnitInput
                label="Density"
                value={formData.density}
                onChange={handleChange}
                options={unitOptions['density' as keyof UnitOptions]}
              />
            </div>
            <div className="flex justify-between">
              <button className="btn btn-outline" type="button" onClick={() => closeModalBtnRef.current?.click()}>
                Cancel
              </button>
              <button className="btn btn-primary" type="submit">
                Save
              </button>
            </div>
          </form>
        </label>
      </label>
    </>
  )
}

type UnitInputType = {
  label: string
  value: string
  onChange: (e: React.SyntheticEvent) => void
  options: UnitOption[]
}

const UnitInput = ({ label, value, onChange, options }: UnitInputType) => {
  const name = label.toLocaleLowerCase()
  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <select className="select select-bordered" value={value} name={name} onChange={onChange}>
        {options?.map((unitOption: UnitOption, index) => {
          return (
            <option key={index} value={unitOption.value}>
              {unitOption.label}
            </option>
          )
        })}
      </select>
    </div>
  )
}

const UnitsIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="10 10 502 502"
      className="h-5 w-5"
      fill="currentColor"
      stroke="currentColor"
    >
      <path d="M424.5,216.5h-15.2c-12.4,0-22.8-10.7-22.8-23.4c0-6.4,2.7-12.2,7.5-16.5l9.8-9.6c9.7-9.6,9.7-25.3,0-34.9l-22.3-22.1  c-4.4-4.4-10.9-7-17.5-7c-6.6,0-13,2.6-17.5,7l-9.4,9.4c-4.5,5-10.5,7.7-17,7.7c-12.8,0-23.5-10.4-23.5-22.7V89.1  c0-13.5-10.9-25.1-24.5-25.1h-30.4c-13.6,0-24.4,11.5-24.4,25.1v15.2c0,12.3-10.7,22.7-23.5,22.7c-6.4,0-12.3-2.7-16.6-7.4l-9.7-9.6  c-4.4-4.5-10.9-7-17.5-7s-13,2.6-17.5,7L110,132c-9.6,9.6-9.6,25.3,0,34.8l9.4,9.4c5,4.5,7.8,10.5,7.8,16.9  c0,12.8-10.4,23.4-22.8,23.4H89.2c-13.7,0-25.2,10.7-25.2,24.3V256v15.2c0,13.5,11.5,24.3,25.2,24.3h15.2  c12.4,0,22.8,10.7,22.8,23.4c0,6.4-2.8,12.4-7.8,16.9l-9.4,9.3c-9.6,9.6-9.6,25.3,0,34.8l22.3,22.2c4.4,4.5,10.9,7,17.5,7  c6.6,0,13-2.6,17.5-7l9.7-9.6c4.2-4.7,10.2-7.4,16.6-7.4c12.8,0,23.5,10.4,23.5,22.7v15.2c0,13.5,10.8,25.1,24.5,25.1h30.4  c13.6,0,24.4-11.5,24.4-25.1v-15.2c0-12.3,10.7-22.7,23.5-22.7c6.4,0,12.4,2.8,17,7.7l9.4,9.4c4.5,4.4,10.9,7,17.5,7  c6.6,0,13-2.6,17.5-7l22.3-22.2c9.6-9.6,9.6-25.3,0-34.9l-9.8-9.6c-4.8-4.3-7.5-10.2-7.5-16.5c0-12.8,10.4-23.4,22.8-23.4h15.2  c13.6,0,23.3-10.7,23.3-24.3V256v-15.2C447.8,227.2,438.1,216.5,424.5,216.5z M336.8,256L336.8,256c0,44.1-35.7,80-80,80  c-44.3,0-80-35.9-80-80l0,0l0,0c0-44.1,35.7-80,80-80C301.1,176,336.8,211.9,336.8,256L336.8,256z" />
    </svg>
  )
}
