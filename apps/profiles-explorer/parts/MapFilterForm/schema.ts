type Schema = Record<
  string,
  {
    label: string;
    items: { id: string; label: string }[];
  }
>;

export const schema: Schema = {
  'risk-level': {
    label: 'At risk units',
    items: [
      { id: '', label: '---' },
      { id: 'future', label: 'Subsidy expiration 5+ years away' },
      { id: '5yr', label: 'Subsidy expiration within 5 years' },
      { id: '3yr', label: 'Subsidy expiration within 3 years' },
      { id: '1yr', label: 'Subsidy expiration within 1 year' },
      { id: '6mo', label: 'Subsidy expiration within 6 months' },
    ],
  },
  'lihtc-compliance': {
    label: 'LIHTC age',
    items: [
      { id: '', label: '---' },
      { id: 'initial', label: 'Within initial compliance period (0-15yrs)' },
      { id: 'extended', label: 'Within extended use period (15-30yrs)' },
      {
        id: 'initial-exp',
        label: 'Initial compliance period expiring soon (13-15yrs)',
      },
      {
        id: 'extended-exp',
        label: 'Extended use period expiring soon (27-30yrs)',
      },
    ],
  },
  'reac-score': {
    label: 'REAC Inspection Scores',
    items: [
      { id: '', label: '---' },
      { id: 'failing', label: 'Failing (<60)' },
      { id: 'annual-inspection', label: 'Require annual inspection (<80)' },
    ],
  },
  'last-inspection': {
    label: 'Recency of inspection',
    items: [
      { id: '', label: '---' },
      { id: '3mos', label: 'Inspected in past 3 months' },
      { id: '6mos', label: 'Inspected in past 6 months' },
    ],
  },
  // 'funding-type': {
  //   label: 'Funding Type',
  //   items: [{ id: '', label: '---' }],
  // },
};

export const initValues: Record<string, string> = {
  'risk-level': '',
  'lihtc-compliance': '',
  'reac-score': '',
  'last-inspection': '',
};
