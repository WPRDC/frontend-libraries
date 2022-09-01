import * as vega from 'vega';

const line: vega.Spec = {
  $schema: 'https://vega.github.io/schema/vega/v5.json',
  description: 'A simple bar chart across one or more series.',
  padding: 5,
  autosize: { type: 'fit', resize: true },

  signals: [
    {
      name: 'interpolate',
      value: 'linear',
      bind: {
        input: 'select',
        options: [
          'basis',
          'cardinal',
          'catmull-rom',
          'linear',
          'monotone',
          'natural',
          'step',
          'step-after',
          'step-before',
        ],
      },
    },
    {
      name: 'tooltip',
      value: {},
      on: [
        {
          events: 'rect:mouseover',
          update: 'datum',
        },
        {
          events: 'rect:mouseout',
          update: '{}',
        },
      ],
    },
  ],
  data: [
    { name: 'table', values: [] },
    { name: 'labels', values: [] },
    { name: 'highlight', values: {} },
  ],
  legends: [
    {
      fill: 'color',
      orient: 'bottom-right',
      symbolType: 'square',
      symbolStrokeWidth: 2,
      symbolStrokeColor: 'black',
      symbolSize: 256,
      labelFontSize: 12,
      labelFontStyle: 'bold',
      fillColor: 'white',
      strokeColor: 'black',
      padding: 4,
    },
  ],
  scales: [
    {
      name: 'x',
      type: 'point',
      range: 'width',
      domain: { data: 'table', field: 'timePoint' },
    },
    {
      name: 'y',
      type: 'linear',
      range: 'height',
      nice: true,
      zero: true,
      domain: { data: 'table', field: 'value' },
    },
    {
      name: 'color',
      type: 'ordinal',
      range: { scheme: 'category10' },
      domain: { data: 'table', field: 'variableLabel' },
    },

    {
      name: 'labelMap',
      type: 'ordinal',
      domain: { data: 'labels', field: 'timePoint' },
      range: { data: 'labels', field: 'label' },
    },
  ],

  axes: [
    {
      orient: 'bottom',
      scale: 'x',
      ticks: false,
      grid: true,
      encode: {
        labels: {
          update: {
            text: { scale: 'labelMap', field: 'value' },
            fontStyle: { value: 'bold' },
          },
        },
      },
    },
    { orient: 'left', scale: 'y', grid: true },
  ],

  marks: [
    {
      type: 'group',
      from: {
        facet: {
          name: 'series',
          data: 'table',
          groupby: 'variableLabel',
        },
      },
      marks: [
        {
          type: 'line',
          from: { data: 'series' },
          encode: {
            enter: {
              x: { scale: 'x', field: 'timePoint' },
              y: { scale: 'y', field: 'value' },
              stroke: { scale: 'color', field: 'variableLabel' },
              strokeWidth: { value: 4 },
            },
            update: {
              interpolate: { signal: 'interpolate' },
              strokeOpacity: { value: 1 },
            },
            hover: {
              strokeOpacity: { value: 0.5 },
            },
          },
        },
        {
          type: 'symbol',
          from: { data: 'series' },
          encode: {
            enter: {
              tooltip: {
                signal:
                  'scale(\'labelMap\', datum.timePoint) + \': \' + format(datum.value, \'1,\')',
              },
              x: { scale: 'x', field: 'timePoint' },
              y: { scale: 'y', field: 'value' },
              fill: { value: 'white' },
              stroke: { scale: 'color', field: 'variableLabel' },
              strokeWidth: { value: 2 },
            },
          },
          zindex: 2,
        },
      ],
    },
  ],
};

export default line;
