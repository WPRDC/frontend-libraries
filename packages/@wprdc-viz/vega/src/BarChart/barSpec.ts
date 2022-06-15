import * as vega from 'vega';

const bar: vega.Spec = {
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
  ],
  // empty data sets to be filled by component
  data: [
    { name: 'table', values: [] },
    { name: 'labels', values: [] },
    { name: 'highlight', values: {} },
  ],

  scales: [
    // variable scale
    {
      name: 'yscale',
      type: 'band',
      domain: { data: 'table', field: 'variable' },
      range: 'height',
      padding: 0.15,
      round: true,
    },
    // value scale
    {
      name: 'xscale',
      domain: { data: 'table', field: 'value' },
      nice: true,
      range: 'width',
    },
    // time scale - for different colored bars
    {
      name: 'color',
      type: 'ordinal',
      domain: { data: 'table', field: 'timeLabel' },
      range: {
        scheme: 'dark2',
      },
    },
    // mapping from vars to labels
    {
      name: 'labelMap',
      type: 'ordinal',
      domain: { data: 'labels', field: 'var' },
      range: { data: 'labels', field: 'label' },
    },
    {
      name: 'fullLabelMap',
      type: 'ordinal',
      domain: { data: 'labels', field: 'var' },
      range: { data: 'labels', field: 'fullLabel' },
    },
  ],

  axes: [
    {
      orient: 'bottom',
      scale: 'xscale',
      labelFont: 'Helvetica Neue',
      labelFontSize: 12,
      labelColor: 'black',
      ticks: false,
      labelOverlap: true,
      labelPadding: 4,
      grid: true,
      domain: false,
    },
    {
      orient: 'left',
      scale: 'yscale',
      labelFont: 'Helvetica Neue',
      labelFontSize: 12,
      labelFontWeight: 600,
      ticks: false,
      labelPadding: 4,
      domainWidth: 2,
      offset: 1,
      domainColor: '#000000',
      encode: {
        labels: {
          interactive: true,
          update: {
            text: { scale: 'labelMap', field: 'value' },
            tooltip: {
              signal: "scale('fullLabelMap', datum.value)",
            },
          },
        },
      },
    },
  ],

  marks: [
    {
      type: 'group', // group to support grouped bars

      from: {
        facet: {
          data: 'table',
          name: 'facet',
          groupby: 'variable',
        },
      },

      encode: {
        // make y-axis based on variables
        enter: {
          y: { scale: 'yscale', field: 'variable' },
        },
      },

      // update width of y-scale on height change
      signals: [{ name: 'height', update: "bandwidth('yscale')" }],

      scales: [
        {
          name: 'pos',
          type: 'band',
          range: 'height',
          domain: { data: 'facet', field: 'timeLabel' },
        },
      ],

      marks: [
        {
          name: 'bars',
          from: { data: 'facet' },
          type: 'rect',
          encode: {
            enter: {
              tooltip: {
                signal:
                  "scale('fullLabelMap', datum.variable) + ': ' + format(datum.value, '1,')",
              },
              y: { scale: 'pos', field: 'timeLabel' },
              height: { scale: 'pos', band: 1 },
              x: { scale: 'xscale', field: 'value' },
              x2: { scale: 'xscale', value: 0 },
              fill: { scale: 'color', field: 'timeLabel' },
              stroke: { value: '#000000' },
              strokeWidth: { value: 2 },
              cornerRadiusBottomRight: { value: 0 },
              cornerRadiusTopRight: { value: 0 },
            },
            update: {
              strokeWidth: { value: 2 },
            },
            hover: {
              strokeWidth: { value: 3 },
            },
          },
        },
      ],
    },
  ],
};

export default bar;
