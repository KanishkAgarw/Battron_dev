import { Link } from 'react-router-dom'
import type { Lead } from '../lib/api/types'

interface LeadCardProps {
  lead: Lead
}

export function LeadCard({ lead }: LeadCardProps) {
  const gradeTextColor =
    lead.grade === 'C' ? 'text-battron-gradeCText' : 'text-battron-black'

  return (
    <Link
      to={`/job-card?jcno=${encodeURIComponent(lead.jcno)}`}
      className="block rounded-14 border border-battron-line bg-battron-card p-[14px] shadow-card transition-colors hover:bg-battron-inputBg focus:outline focus:outline-2 focus:outline-offset-0 focus:outline-battron-green"
    >
      <div className="flex items-start gap-[10px]">
        <div
          className={`flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-10 text-18 font-extrabold ${gradeTextColor}`}
          style={{ backgroundColor: lead.grade_color }}
        >
          {lead.grade}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate text-15 font-bold text-battron-summary">
              {lead.customer}
            </p>
            <span
              className={`shrink-0 rounded-pill px-[10px] py-[3px] text-11 font-bold ${
                lead.status === 'Done'
                  ? 'bg-battron-flagOkBg text-battron-flagOkText'
                  : 'bg-battron-readonlyBg text-battron-readonlyText'
              }`}
            >
              {lead.status}
            </span>
          </div>
          <p className="mt-[2px] text-12 font-semibold text-battron-greenBright">
            {lead.jcno}
          </p>
          <p className="mt-[6px] text-13 text-battron-slate">
            {lead.mobile}
            {lead.reg ? ` · ${lead.reg}` : ''}
          </p>
          <p className="mt-[2px] truncate text-13 text-battron-muted">
            {lead.vehicle}
          </p>
        </div>
      </div>
      <div className="mt-[10px] grid grid-cols-3 gap-[8px] border-t border-battron-line pt-[10px]">
        <div>
          <p className="text-11 font-bold uppercase tracking-wide text-battron-slate">
            SoH
          </p>
          <p className="mt-[2px] text-14 font-extrabold text-battron-summary">
            {lead.soh}
          </p>
        </div>
        <div>
          <p className="text-11 font-bold uppercase tracking-wide text-battron-slate">
            Score
          </p>
          <p className="mt-[2px] text-14 font-extrabold text-battron-summary">
            {lead.score}/100
          </p>
        </div>
        <div>
          <p className="text-11 font-bold uppercase tracking-wide text-battron-slate">
            Channel
          </p>
          <p className="mt-[2px] truncate text-12 font-semibold text-battron-summary">
            {lead.channel.split(' ')[0]}
          </p>
        </div>
      </div>
      {lead.complaints !== '—' && (
        <p className="mt-[8px] line-clamp-2 text-12 text-battron-muted">
          {lead.complaints}
        </p>
      )}
    </Link>
  )
}
