import { Section } from '../components/Section'
import { Field } from '../components/Field'
import { TextInput } from '../components/TextInput'
import { SelectInput } from '../components/SelectInput'
import { TextArea } from '../components/TextArea'
import { ChipGroup } from '../components/ChipGroup'
import { useJobCard } from '../state/JobCardContext'
import { useMeta } from '../state/MetaContext'

const LABEL = 'block text-12 font-semibold text-battron-slate'
const ROW3 = 'grid grid-cols-3 gap-[8px] xs:grid-cols-2'

export function Section6Diagnosis() {
  const meta = useMeta()
  const { data, setField } = useJobCard()
  const f = data.fields
  return (
    <Section number={6} title="Diagnosis & work">
      <label htmlFor="subsystem" className={LABEL}>
        Fault localised to
      </label>
      <SelectInput
        id="subsystem"
        value={f.subsystem}
        onChange={(v) => setField('subsystem', v)}
        options={meta.subsystem}
        className="mt-[6px] mb-[12px]"
      />
      <label htmlFor="rootcause" className={LABEL}>
        Primary root cause
      </label>
      <SelectInput
        id="rootcause"
        value={f.rootcause}
        onChange={(v) => setField('rootcause', v)}
        options={meta.root_cause}
        className="mt-[6px] mb-[12px]"
      />
      <label className={LABEL}>Repair actions performed</label>
      <ChipGroup group="actions" items={meta.actions} className="mt-[8px]" />
      <div className={`${ROW3} mt-[14px]`}>
        <Field label="SoH incoming % (auto §5)" htmlFor="sohbefore">
          <TextInput id="sohbefore" value={f.sohbefore} readOnly />
        </Field>
        <Field label="SoH after % (auto §8)" htmlFor="sohafter">
          <TextInput id="sohafter" value={f.sohafter} readOnly />
        </Field>
        <Field label="SoH gain (auto)" htmlFor="sohgain">
          <TextInput id="sohgain" value={f.sohgain} readOnly />
        </Field>
      </div>
      <div className="mt-[12px]">
        <Field label="Diagnosis notes" htmlFor="fault" full>
          <TextArea id="fault" value={f.fault} onChange={(v) => setField('fault', v)} />
        </Field>
      </div>
    </Section>
  )
}
