import { Section } from '../components/Section'
import { Field } from '../components/Field'
import { TextInput } from '../components/TextInput'
import { SelectInput } from '../components/SelectInput'
import { TimeField } from '../components/TimeField'
import { CHANNEL_OPTIONS } from '../lib/constants'
import { localISO } from '../lib/calc'
import { useJobCard } from '../state/JobCardContext'

export function Section1JobCustomer() {
  const { data, setField } = useJobCard()
  const f = data.fields
  return (
    <Section number={1} title="Job & Customer" defaultOpen>
      <div className="grid grid-cols-2 gap-[10px] xs:grid-cols-1">
        <Field label="Job No." htmlFor="jcno">
          <TextInput id="jcno" value={f.jcno} readOnly />
        </Field>
        <Field label="Technician" htmlFor="tech">
          <TextInput
            id="tech"
            value={f.tech}
            placeholder="Name"
            onChange={(v) => setField('tech', v)}
          />
        </Field>
        <Field label="Date / time IN" htmlFor="datein" full>
          <TimeField
            id="datein"
            value={f.datein}
            onChange={(v) => setField('datein', v)}
            onNow={() => setField('datein', localISO())}
          />
        </Field>
        <Field label="Channel" htmlFor="channel">
          <SelectInput
            id="channel"
            value={f.channel}
            onChange={(v) => setField('channel', v)}
            options={CHANNEL_OPTIONS}
          />
        </Field>
        <Field label="Customer name" htmlFor="cust">
          <TextInput id="cust" value={f.cust} onChange={(v) => setField('cust', v)} />
        </Field>
        <Field label="Mobile" htmlFor="mobile">
          <TextInput
            id="mobile"
            value={f.mobile}
            inputMode="tel"
            onChange={(v) => setField('mobile', v)}
          />
        </Field>
        <Field label="Vehicle reg no." htmlFor="vreg">
          <TextInput id="vreg" value={f.vreg} onChange={(v) => setField('vreg', v)} />
        </Field>
        <Field label="Make / model" htmlFor="vmodel">
          <TextInput id="vmodel" value={f.vmodel} onChange={(v) => setField('vmodel', v)} />
        </Field>
      </div>
    </Section>
  )
}
