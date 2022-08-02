import * as vega from 'vega';

export function makeSpec(valueField: string): vega.Spec {
  const vegaFormat = valueField === 'percent' ? '1.1%' : '1,';
  const d3Format = valueField === 'percent' ? '.0%' : ',.2r';

  return {
    $schema: 'https://vega.github.io/schema/vega/v5.json',
    description: 'A simple bar chart across one or more series.',
    padding: 5,
    autosize: { type: 'fit', resize: true },
    signals: [
      {
        name: 'tooltip',
        value: {},
        on: [
          { events: 'rect:mouseover', update: 'datum' },
          { events: 'rect:mouseout', update: '{}' },
        ],
      },
      {
        name: 'hover',
        value: {},
        on: [
          { events: 'rect:mouseover', update: 'datum' },
          { events: 'rect:mouseout', update: '{}' },
        ],
      },
    ],
    data: [
      {
        name: 'table',
        values: [],
      },
      {
        name: 'labels',
        values: [],
      },
      {
        name: 'highlight',
        values: [],
      },
    ],
    scales: [
      {
        name: 'geogScale',
        type: 'band',
        domain: {
          data: 'table',
          field: 'geog',
          sort: { op: 'median', field: valueField, order: 'ascending' },
        },
        range: 'width',
        padding: 0.15,
      },
      {
        name: 'valueScale',
        domain: { data: 'table', field: valueField },
        nice: true,
        range: 'height',
      },
    ],
    axes: [
      {
        orient: 'bottom',
        scale: 'geogScale',
        labelFont: 'Helvetica Neue',
        ticks: false,
        labels: false,
        labelAngle: 45,
        labelAlign: 'left',
      },
      {
        orient: 'left',
        scale: 'valueScale',
        labelFont: 'Helvetica Neue',
        ticks: false,
        format: d3Format,
        formatType: 'number',
        labelPadding: 0,
        grid: true,
        domain: false,
      },
    ],
    marks: [
      {
        name: 'bars',
        from: { data: 'table' },
        type: 'rect',
        encode: {
          enter: {
            tooltip: {
              signal: `datum.geogLabel + ': ' + format(datum.${valueField}, '${vegaFormat}')`,
            },
            x: { scale: 'geogScale', field: 'geog' },
            width: { scale: 'geogScale', band: 1 },
            y: { scale: 'valueScale', field: valueField },
            y2: { scale: 'valueScale', value: 0 },
            strokeWidth: { value: 0 },
            cornerRadiusBottomRight: { value: 0 },
            cornerRadiusTopRight: { value: 0 },
          },
          update: {
            fill: [
              {
                test: "indata('highlight', 'highlight', datum.geog)",
                value: '#d95f02',
              },
              { value: '#1b9e77' },
            ],
            strokeWidth: { value: 0 },
          },
          hover: {
            strokeWidth: { value: 0 },
          },
        },
      },
    ],
  };
}
