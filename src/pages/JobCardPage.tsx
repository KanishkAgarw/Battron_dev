import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ToastProvider } from '../components/Toast'
import { JobCardProvider, useJobCard } from '../state/JobCardContext'
import { Header } from '../components/Header'
import { ActionBar } from '../components/ActionBar'
import { ScoreModal } from '../components/ScoreModal'
import { Section1JobCustomer } from '../sections/Section1JobCustomer'
import { Section2Financing } from '../sections/Section2Financing'
import { Section3BatteryId } from '../sections/Section3BatteryId'
import { Section4Complaint } from '../sections/Section4Complaint'
import { Section5Diagnostics } from '../sections/Section5Diagnostics'
import { Section6Diagnosis } from '../sections/Section6Diagnosis'
import { Section7Parts } from '../sections/Section7Parts'
import { Section8Result } from '../sections/Section8Result'

function JobCardContent() {
  const [scoreOpen, setScoreOpen] = useState(false)
  const { loading, saving } = useJobCard()

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-15 text-battron-slate">
        Loading job card…
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between gap-[8px] border-b border-battron-line bg-battron-card px-[12px] py-[8px]">
        <Link
          to="/dashboard"
          className="text-13 font-bold text-battron-greenDark transition-colors hover:text-battron-summary focus:outline focus:outline-2 focus:outline-battron-green"
        >
          ← Leads
        </Link>
        {saving && (
          <span className="text-11 font-semibold text-battron-muted">Autosaving…</span>
        )}
      </div>
      <Header />
      <div className="mx-auto max-w-container p-[12px]">
        <Section1JobCustomer />
        <Section2Financing />
        <Section3BatteryId />
        <Section4Complaint />
        <Section5Diagnostics />
        <Section6Diagnosis />
        <Section7Parts />
        <Section8Result />
      </div>
      <ActionBar onScore={() => setScoreOpen(true)} />
      <ScoreModal open={scoreOpen} onClose={() => setScoreOpen(false)} />
    </>
  )
}

export function JobCardPage() {
  const [searchParams] = useSearchParams()
  const jcno = searchParams.get('jcno')
  const isNew = searchParams.get('new') === '1'
  const providerKey = isNew ? 'new' : jcno ?? 'draft'

  return (
    <div className="job-card-layout pb-[84px]">
      <ToastProvider>
        <JobCardProvider
          key={providerKey}
          initialJcno={isNew ? null : jcno}
          forceNew={isNew}
        >
          <JobCardContent />
        </JobCardProvider>
      </ToastProvider>
    </div>
  )
}
