type Props = {
    title?: string,
    children: JSX.Element,
  };

export const CalcCard:React.FC<Props> = ({title, children}) =>{
    return(
        <div className = "bg-base-100 p-4 rounded w-full md:w-[calc(50%_-_2rem)] lg:w-w-[calc(33.33%_-_2rem)] shadow-lg ">
        <div>
            {title  && <h2 className="mb-4 text-xl">{title}</h2>}
            {children}
        </div>
    </div>
    )
}