import { Section } from '../components/Section'
import { Field } from '../components/Field'
import { TextInput } from '../components/TextInput'
import { SelectInput } from '../components/SelectInput'
import { FINANCED_OPTIONS } from '../lib/constants'
import { useJobCard } from '../state/JobCardContext'

export function Section2Financing() {
  const { data, setField } = useJobCard()
  const f = data.fields
  return (
    <Section number={2} title="Financing link">
      <div className="grid grid-cols-2 gap-[10px] xs:grid-cols-1">
        <Field label="Financed battery?" htmlFor="financed">
          <SelectInput
            id="financed"
            value={f.financed}
            onChange={(v) => setField('financed', v)}
            options={FINANCED_OPTIONS}
          />
        </Field>
        <Field label="Lender / NBFC" htmlFor="lender">
          <TextInput
            id="lender"
            value={f.lender}
            placeholder="e.g. ProsParity"
            onChange={(v) => setField('lender', v)}
          />
        </Field>
        <Field label="Loan / Account ID" htmlFor="loanid" full>
          <TextInput
            id="loanid"
            value={f.loanid}
            placeholder="links battery health to the loan"
            onChange={(v) => setField('loanid', v)}
          />
        </Field>
      </div>
      <p className="mt-[4px] text-11 text-battron-muted">
        Feeds battery health back to underwriting and collections.
      </p>
    </Section>
  )
}
