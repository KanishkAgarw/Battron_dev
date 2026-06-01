interface MetricCardProps {
  label: string
  value: string
}

export function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="rounded-12 border border-battron-line p-[12px]">
      <div className="text-11 font-bold uppercase text-battron-slate">{label}</div>
      <div className="mt-[3px] text-18 font-extrabold text-battron-summary">{value}</div>
    </div>
  )
}
