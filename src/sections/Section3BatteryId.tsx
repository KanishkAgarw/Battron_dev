import { Section } from '../components/Section'
import { Field } from '../components/Field'
import { TextInput } from '../components/TextInput'
import { SelectInput } from '../components/SelectInput'
import { useJobCard } from '../state/JobCardContext'
import { useMeta } from '../state/MetaContext'

export function Section3BatteryId() {
  const meta = useMeta()
  const { data, setField } = useJobCard()
  const f = data.fields
  return (
    <Section number={3} title="Battery identification">
      <div className="grid grid-cols-2 gap-[10px] xs:grid-cols-1">
        <Field label="Brand" htmlFor="bbrand">
          <TextInput id="bbrand" value={f.bbrand} onChange={(v) => setField('bbrand', v)} />
        </Field>
        <Field label="Chemistry" htmlFor="chem">
          <SelectInput
            id="chem"
            value={f.chem}
            onChange={(v) => setField('chem', v)}
            options={meta.chemistry}
          />
        </Field>
        <Field label="Pack volt (V)" htmlFor="volt">
          <TextInput
            id="volt"
            value={f.volt}
            inputMode="decimal"
            onChange={(v) => setField('volt', v)}
          />
        </Field>
        <Field label="Rated capacity (Ah)" htmlFor="ah">
          <TextInput
            id="ah"
            value={f.ah}
            inputMode="decimal"
            onChange={(v) => setField('ah', v)}
          />
        </Field>
        <Field label="Config (S/P)" htmlFor="config">
          <TextInput
            id="config"
            value={f.config}
            placeholder="16S1P"
            onChange={(v) => setField('config', v)}
          />
        </Field>
        <Field label="Cell qty" htmlFor="cellqty">
          <TextInput
            id="cellqty"
            value={f.cellqty}
            inputMode="numeric"
            onChange={(v) => setField('cellqty', v)}
          />
        </Field>
        <Field label="BMS make / type" htmlFor="bms">
          <TextInput
            id="bms"
            value={f.bms}
            placeholder="Make · Smart/Basic"
            onChange={(v) => setField('bms', v)}
          />
        </Field>
        <Field label="Pack serial / ID" htmlFor="serial">
          <TextInput id="serial" value={f.serial} onChange={(v) => setField('serial', v)} />
        </Field>
        <Field label="Invoice date" htmlFor="invdate">
          <TextInput
            id="invdate"
            type="date"
            value={f.invdate}
            onChange={(v) => setField('invdate', v)}
          />
        </Field>
        <Field label="Age (months)" htmlFor="age">
          <TextInput
            id="age"
            value={f.age}
            inputMode="numeric"
            onChange={(v) => setField('age', v)}
          />
        </Field>
        <Field label="Orig. warranty (mo)" htmlFor="origwarr">
          <TextInput
            id="origwarr"
            value={f.origwarr}
            inputMode="numeric"
            placeholder="36"
            onChange={(v) => setField('origwarr', v)}
          />
        </Field>
        <Field label="Warranty status" htmlFor="warrstatus">
          <TextInput id="warrstatus" value={f.warrstatus} readOnly />
        </Field>
      </div>
    </Section>
  )
}
