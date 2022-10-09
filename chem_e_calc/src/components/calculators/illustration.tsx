import { CalcCard } from './calcCard'

export const Illustraion = () => {
  return (
    <CalcCard title="Illustration">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        height="{100}"
        width="{100}"
        viewBox="-10 -10 236 350"
        className="fill-base-100 stroke-base-content"
      >
        <g text-rendering="geometricPrecision" transform="scale(1, 1)">
          <path
            fill="inherit"
            d="M0 27.18C-0 42.19 48.68 54.36 108.72 54.36 168.76 54.36 217.44 42.19 217.44 27.18L217.44 292.5 217.44 292.5C217.44 307.51 168.76 319.68 108.72 319.68 48.68 319.68 -0 307.51 0 292.5z"
          />
          <path
            fill="inherit"
            d="M0 27.18C0 12.17 48.68 0 108.72 0 168.76 -0 217.44 12.17 217.44 27.18L217.44 27.18C217.44 42.19 168.76 54.36 108.72 54.36 48.68 54.36 -0 42.19 0 27.18z"
          />
          <path
            stroke-width="2"
            stroke="inherit"
            fill="none"
            d="M217.44 27.18C217.44 42.19 168.76 54.36 108.72 54.36 48.68 54.36 -0 42.19 0 27.18L0 27.18C0 12.17 48.68 -0 108.72 -0 168.76 -0 217.44 12.17 217.44 27.18L217.44 292.5 217.44 292.5C217.44 307.51 168.76 319.68 108.72 319.68 48.68 319.68 -0 307.51 0 292.5L0 27.18"
          />
        </g>
      </svg>
    </CalcCard>
  )
}
