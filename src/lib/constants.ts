export const COMPLAINTS = [
  'Reduced range / runs less',
  'Slow charging',
  'Not charging at all',
  'Not working / no power',
  'Overheating',
  'Water / rain damage',
  'Cuts off while driving',
  'Physical damage / accident',
]

export const VISUAL = [
  'Swelling / bulging',
  'Leakage / electrolyte',
  'Burnt / melted connector',
  'Water ingress marks',
  'Casing cracked',
  'Loose connections',
  'Looks OK',
]

export const VIS_SAFETY = [
  'Swelling / bulging',
  'Leakage / electrolyte',
  'Burnt / melted connector',
  'Water ingress marks',
]

export const ACTIONS = [
  'Rebalancing',
  'Cell replacement',
  'Cell sorting / regroup',
  'BMS reset / reprogram',
  'BMS replacement',
  'Nickel strip re-weld',
  'Connector repair',
  'Wiring / fuse repair',
  'Casing / mechanical',
  'Sealing / waterproof',
  'Full recondition cycle',
  'Diagnosis only',
]

// All persisted scalar field ids — must match the original HTML's FIELDS array order.
export const FIELDS = [
  'jcno', 'datein', 'dateout', 'channel', 'tech', 'cust', 'mobile', 'vreg',
  'vmodel', 'financed', 'lender', 'loanid', 'bbrand', 'chem', 'volt', 'ah',
  'config', 'cellqty', 'bms', 'serial', 'invdate', 'age', 'origwarr',
  'warrstatus', 'repkm', 'complaintNotes', 'restv', 'loadv', 'sag', 'chgv',
  'soc', 'bmssoh', 'cyclesbms', 'mincellv', 'maxcellv', 'dvbms', 'maxtemp',
  'faultcodes', 'chgcur', 'chgtime', 'reachedfull', 'dischcur', 'measah',
  'soh', 'dischtime', 'cutoff', 'dvbefore', 'dvafter', 'baltime', 'subsystem',
  'rootcause', 'sohbefore', 'sohafter', 'sohgain', 'fault', 'tat', 'finah',
  'finrange', 'newprice', 'charges', 'warrgiven', 'outcome', 'verdict',
] as const

export type FieldId = (typeof FIELDS)[number]

export const CHANNEL_OPTIONS = [
  'Walk-in repair (driver)',
  'OEM / Dealer warranty',
  'Fleet / B2B',
]

export const FINANCED_OPTIONS = ['Unknown', 'Yes', 'No']
export const CHEM_OPTIONS = ['LFP', 'NMC', 'Lead-acid']
export const REACHED_FULL_OPTIONS = ['—', 'Yes', 'No']

export const SUBSYSTEM_OPTIONS = [
  '—',
  'Cells',
  'BMS',
  'Connector / Wiring',
  'Mechanical',
  'Charger / External',
  'No fault found',
]

export const ROOTCAUSE_OPTIONS = [
  '—',
  'Cell degradation',
  'Cell imbalance',
  'Dead / shorted cell',
  'BMS fault',
  'Connector / Wiring',
  'Mechanical',
  'Water ingress',
  'Thermal',
  'Charger / Usage',
  'No fault found',
]

export const OUTCOME_OPTIONS = [
  '—',
  'Revived to spec',
  'Partially recovered',
  'Beyond economic repair',
  'Warranty rejected',
  'No fault found',
]
