import { useState } from 'react'
import { ToastProvider } from './components/Toast'
import { JobCardProvider } from './state/JobCardContext'
import { Header } from './components/Header'
import { ActionBar } from './components/ActionBar'
import { ScoreModal } from './components/ScoreModal'
import { Section1JobCustomer } from './sections/Section1JobCustomer'
import { Section2Financing } from './sections/Section2Financing'
import { Section3BatteryId } from './sections/Section3BatteryId'
import { Section4Complaint } from './sections/Section4Complaint'
import { Section5Diagnostics } from './sections/Section5Diagnostics'
import { Section6Diagnosis } from './sections/Section6Diagnosis'
import { Section7Parts } from './sections/Section7Parts'
import { Section8Result } from './sections/Section8Result'

export default function App() {
  const [scoreOpen, setScoreOpen] = useState(false)

  return (
    <ToastProvider>
      <JobCardProvider>
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
      </JobCardProvider>
    </ToastProvider>
  )
}
