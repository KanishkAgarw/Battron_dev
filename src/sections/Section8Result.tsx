import { Section } from '../components/Section'
import { Field } from '../components/Field'
import { TextInput } from '../components/TextInput'
import { SelectInput } from '../components/SelectInput'
import { TextArea } from '../components/TextArea'
import { TimeField } from '../components/TimeField'
import { localISO } from '../lib/calc'
import { useJobCard } from '../state/JobCardContext'
import { useMeta } from '../state/MetaContext'

export function Section8Result() {
  const meta = useMeta()
  const { data, setField } = useJobCard()
  const f = data.fields
  return (
    <Section number={8} title="Result & handover">
      <div className="grid grid-cols-2 gap-[10px] xs:grid-cols-1">
        <Field label="Date / time OUT" htmlFor="dateout" full>
          <TimeField
            id="dateout"
            value={f.dateout}
            onChange={(v) => setField('dateout', v)}
            onNow={() => setField('dateout', localISO())}
          />
        </Field>
        <Field label="Total TAT (auto)" htmlFor="tat">
          <TextInput id="tat" value={f.tat} readOnly />
        </Field>
        <Field label="Final Ah (after repair)" htmlFor="finah">
          <TextInput
            id="finah"
            value={f.finah}
            inputMode="decimal"
            onChange={(v) => setField('finah', v)}
          />
        </Field>
        <Field label="Est. range (auto, km)" htmlFor="finrange">
          <TextInput id="finrange" value={f.finrange} readOnly />
        </Field>
        <Field label="New-battery price ₹ (resale est.)" htmlFor="newprice">
          <TextInput
            id="newprice"
            value={f.newprice}
            inputMode="numeric"
            onChange={(v) => setField('newprice', v)}
          />
        </Field>
        <Field label="Charges ₹" htmlFor="charges">
          <TextInput
            id="charges"
            value={f.charges}
            inputMode="numeric"
            onChange={(v) => setField('charges', v)}
          />
        </Field>
        <Field label="Warranty given (mo)" htmlFor="warrgiven">
          <TextInput
            id="warrgiven"
            value={f.warrgiven}
            inputMode="numeric"
            onChange={(v) => setField('warrgiven', v)}
          />
        </Field>
        <Field label="Recovery outcome" htmlFor="outcome">
          <SelectInput
            id="outcome"
            value={f.outcome}
            onChange={(v) => setField('outcome', v)}
            options={meta.outcome}
          />
        </Field>
      </div>
      <div className="mt-[12px]">
        <Field label="Verdict / note for customer" htmlFor="verdict" full>
          <TextArea
            id="verdict"
            value={f.verdict}
            placeholder="e.g. SoH 78%, one weak cell rebalanced — fit for resale, Grade B"
            onChange={(v) => setField('verdict', v)}
          />
        </Field>
      </div>
    </Section>
  )
}
