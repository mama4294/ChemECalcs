import Link from 'next/link'
import { motion } from 'framer-motion'

type GridCardProps = {
  name: string
  children?: React.ReactNode
  description?: string
  link: string
  span?: number
  animated?: boolean
}

export const GridCard = ({ name, children, description, link, span, animated = true }: GridCardProps) => {
  const getClassName = (span: number | undefined) => {
    if (!span) return ''
    switch (span) {
      case 1:
        return 'md:col-span-1'
      case 2:
        return 'md:col-span-2'
      case 3:
        return 'md:col-span-3'
      default:
        return ''
    }
  }

  const spanClass = getClassName(span)

  return (
    <Link href={link}>
      <motion.div
        className={`group relative grid cursor-pointer hover:scale-105 ${spanClass}`} //motion-safe:hover:scale-105
        layout
        initial={{ scale: animated ? 0 : 1 }}
        whileInView={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', duration: 0.5, bounce: 0.3, delay: 0 }}
        viewport={{ once: true }}
      >
        <div className="absolute -inset-0.5 rounded-xl bg-secondary opacity-75 blur duration-500 group-hover:-inset-1 group-hover:opacity-100"></div>
        <div className="relative rounded-xl bg-neutral p-6 text-left text-neutral-content">
          <h3 className="mb-3 flex items-center text-2xl font-semibold tracking-tight">{name}</h3>
          <p className="text-sm opacity-75">{description}</p>
          {children && <div className="flex justify-center">{children}</div>}
        </div>
      </motion.div>
    </Link>
  )
}
