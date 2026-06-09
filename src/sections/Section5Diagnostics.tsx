import { Section } from '../components/Section'
import { Field } from '../components/Field'
import { TextInput } from '../components/TextInput'
import { SelectInput } from '../components/SelectInput'
import { SubHeader } from '../components/SubHeader'
import { ChipGroup } from '../components/ChipGroup'
import { CellGrid } from '../components/CellGrid'
import { SegmentedToggle } from '../components/SegmentedToggle'
import { useJobCard } from '../state/JobCardContext'
import { useMeta } from '../state/MetaContext'
import { useToast } from '../hooks/useToast'

const ROW3 = 'grid grid-cols-3 gap-[8px] xs:grid-cols-2'

export function Section5Diagnostics() {
  const meta = useMeta()
  const {
    data,
    setField,
    cellPhase,
    setCellPhase,
    cellsGenerated,
    genCells,
    setCell,
  } = useJobCard()
  const f = data.fields
  const toast = useToast()

  return (
    <Section number={5} title="Diagnostics">
      <SubHeader first>Incoming visual check (technician)</SubHeader>
      <ChipGroup
        group="visual"
        items={meta.visual}
        warnItems={meta.visual_safety}
      />

      <SubHeader>Multimeter</SubHeader>
      <div className={ROW3}>
        <Field label="Pack rest V" htmlFor="restv">
          <TextInput
            id="restv"
            value={f.restv}
            inputMode="decimal"
            onChange={(v) => setField('restv', v)}
          />
        </Field>
        <Field label="Pack on-load V" htmlFor="loadv">
          <TextInput
            id="loadv"
            value={f.loadv}
            inputMode="decimal"
            onChange={(v) => setField('loadv', v)}
          />
        </Field>
        <Field label="Sag (auto)" htmlFor="sag">
          <TextInput id="sag" value={f.sag} readOnly />
        </Field>
        <Field label="Charger output V" htmlFor="chgv">
          <TextInput
            id="chgv"
            value={f.chgv}
            inputMode="decimal"
            onChange={(v) => setField('chgv', v)}
          />
        </Field>
      </div>

      <SubHeader>BMS read</SubHeader>
      <div className={ROW3}>
        <Field label="SoC % now" htmlFor="soc">
          <TextInput
            id="soc"
            value={f.soc}
            inputMode="decimal"
            onChange={(v) => setField('soc', v)}
          />
        </Field>
        <Field label="BMS SoH %" htmlFor="bmssoh">
          <TextInput
            id="bmssoh"
            value={f.bmssoh}
            inputMode="decimal"
            onChange={(v) => setField('bmssoh', v)}
          />
        </Field>
        <Field label="Cycle count" htmlFor="cyclesbms">
          <TextInput
            id="cyclesbms"
            value={f.cyclesbms}
            inputMode="numeric"
            onChange={(v) => setField('cyclesbms', v)}
          />
        </Field>
        <Field label="Min cell V" htmlFor="mincellv">
          <TextInput
            id="mincellv"
            value={f.mincellv}
            inputMode="decimal"
            onChange={(v) => setField('mincellv', v)}
          />
        </Field>
        <Field label="Max cell V" htmlFor="maxcellv">
          <TextInput
            id="maxcellv"
            value={f.maxcellv}
            inputMode="decimal"
            onChange={(v) => setField('maxcellv', v)}
          />
        </Field>
        <Field label="Cell ΔV (auto, mV)" htmlFor="dvbms">
          <TextInput id="dvbms" value={f.dvbms} readOnly />
        </Field>
        <Field label="Max temp °C" htmlFor="maxtemp">
          <TextInput
            id="maxtemp"
            value={f.maxtemp}
            inputMode="decimal"
            onChange={(v) => setField('maxtemp', v)}
          />
        </Field>
        <Field label="BMS fault / error codes" htmlFor="faultcodes" full>
          <TextInput
            id="faultcodes"
            value={f.faultcodes}
            placeholder="e.g. OV protect, cell 7"
            onChange={(v) => setField('faultcodes', v)}
          />
        </Field>
      </div>

      <SubHeader>Charger</SubHeader>
      <div className={ROW3}>
        <Field label="Charge current (A)" htmlFor="chgcur">
          <TextInput
            id="chgcur"
            value={f.chgcur}
            inputMode="decimal"
            onChange={(v) => setField('chgcur', v)}
          />
        </Field>
        <Field label="Time to full" htmlFor="chgtime">
          <TextInput
            id="chgtime"
            value={f.chgtime}
            placeholder="hh:mm"
            onChange={(v) => setField('chgtime', v)}
          />
        </Field>
        <Field label="Reached full?" htmlFor="reachedfull">
          <SelectInput
            id="reachedfull"
            value={f.reachedfull}
            onChange={(v) => setField('reachedfull', v)}
            options={meta.reached_full}
          />
        </Field>
      </div>

      <SubHeader>Discharger — capacity test → this gives SoH</SubHeader>
      <div className={ROW3}>
        <Field label="Discharge current (A)" htmlFor="dischcur">
          <TextInput
            id="dischcur"
            value={f.dischcur}
            inputMode="decimal"
            onChange={(v) => setField('dischcur', v)}
          />
        </Field>
        <Field label="Measured Ah (incoming)" htmlFor="measah">
          <TextInput
            id="measah"
            value={f.measah}
            inputMode="decimal"
            onChange={(v) => setField('measah', v)}
          />
        </Field>
        <Field label="SoH % (auto)" htmlFor="soh">
          <TextInput id="soh" value={f.soh} readOnly />
        </Field>
        <Field label="Discharge time" htmlFor="dischtime">
          <TextInput
            id="dischtime"
            value={f.dischtime}
            placeholder="hh:mm"
            onChange={(v) => setField('dischtime', v)}
          />
        </Field>
        <Field label="Cut-off V" htmlFor="cutoff">
          <TextInput
            id="cutoff"
            value={f.cutoff}
            inputMode="decimal"
            onChange={(v) => setField('cutoff', v)}
          />
        </Field>
      </div>
      <p className="mt-[4px] text-11 text-battron-muted">
        SoH = Measured Ah ÷ Rated Ah. After repair, re-run the test and enter{' '}
        <b>Final Ah</b> in §8 to get SoH-after.
      </p>

      <SubHeader>Balancer &amp; per-cell voltage</SubHeader>
      <div className={ROW3}>
        <Field label="ΔV before (auto, mV)" htmlFor="dvbefore">
          <TextInput id="dvbefore" value={f.dvbefore} readOnly />
        </Field>
        <Field label="ΔV after (auto, mV)" htmlFor="dvafter">
          <TextInput id="dvafter" value={f.dvafter} readOnly />
        </Field>
        <Field label="Balance time" htmlFor="baltime">
          <TextInput
            id="baltime"
            value={f.baltime}
            placeholder="hh:mm"
            onChange={(v) => setField('baltime', v)}
          />
        </Field>
      </div>
      <button
        type="button"
        onClick={() => {
          if (!genCells()) toast('Enter cell qty (1–64) in §3 first')
        }}
        className="add-btn mt-[10px] w-full rounded-10 border border-dashed border-battron-greenDark bg-battron-readonlyBg py-[9px] font-bold text-battron-greenDark hover:bg-[#e2ebd2] hover:text-battron-greenDeep"
      >
        Generate per-cell inputs from cell qty
      </button>
      <SegmentedToggle
        value={cellPhase}
        visible={cellsGenerated}
        onChange={(v) => setCellPhase(v as 'before' | 'after')}
        options={[
          { label: 'Before', value: 'before' },
          { label: 'After', value: 'after' },
        ]}
      />
      <CellGrid
        values={data.cb}
        onChange={(i, v) => setCell('before', i, v)}
        visible={cellsGenerated && cellPhase === 'before'}
      />
      <CellGrid
        values={data.ca}
        onChange={(i, v) => setCell('after', i, v)}
        visible={cellsGenerated && cellPhase === 'after'}
      />
    </Section>
  )
}
