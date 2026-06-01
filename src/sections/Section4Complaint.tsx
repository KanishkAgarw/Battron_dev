import { Section } from '../components/Section'
import { Field } from '../components/Field'
import { TextInput } from '../components/TextInput'
import { TextArea } from '../components/TextArea'
import { ChipGroup } from '../components/ChipGroup'
import { COMPLAINTS } from '../lib/constants'
import { useJobCard } from '../state/JobCardContext'

export function Section4Complaint() {
  const { data, setField } = useJobCard()
  const f = data.fields
  return (
    <Section number={4} title="Customer complaint">
      <label className="text-12 font-semibold text-battron-slate">
        What is the driver reporting? (tap all that apply)
      </label>
      <ChipGroup group="complaints" items={COMPLAINTS} className="mt-[8px]" />
      <div className="mt-[12px] grid grid-cols-1 gap-[10px]">
        <Field label="Reported backup now (km / charge)" htmlFor="repkm">
          <TextInput
            id="repkm"
            value={f.repkm}
            inputMode="numeric"
            onChange={(v) => setField('repkm', v)}
          />
        </Field>
        <Field label="Notes from driver" htmlFor="complaintNotes" full>
          <TextArea
            id="complaintNotes"
            value={f.complaintNotes}
            onChange={(v) => setField('complaintNotes', v)}
          />
        </Field>
      </div>
    </Section>
  )
}
