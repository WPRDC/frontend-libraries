import * as React from 'react';
import '../main.css';
import styles from './LegendItem.module.css';

import {
  CategoricalLegendItemProps,
  ColorScaleLegendItemProps,
  LegendItemProps,
} from '@wprdc-types/map';

export const LegendItem: React.FC<LegendItemProps> = (props) => {
  if (props.variant === 'scale') {
    return <ColorScaleLegendItem {...props} />;
  }
  if (props.variant === 'categorical') {
    return <CategoricalLegendItem {...props} />;
  }
  return null;
};

export const CategoricalLegendItem: React.FC<CategoricalLegendItemProps> = (
  props
) => {
  const { label, hollow, marker } = props;
  const _marker =
    typeof marker === 'string' ? (
      <Marker color={marker} hollow={hollow} />
    ) : (
      marker
    );

  return (
    <div className={styles.container}>
      <div className={styles.markerSection}>{_marker}</div>
      <div className={styles.labelSection}>
        <p className={styles.label}>{label}</p>
      </div>
    </div>
  );
};

export const ColorScaleLegendItem: React.FC<ColorScaleLegendItemProps> = ({
  label,
  scale,
  numberFormatOptions,
}) => {
  const gradient = scale.map((item) => item.marker).join(',');

  function styleLabel(label: React.ReactNode): React.ReactNode {
    if (typeof label === 'number' && !!numberFormatOptions) {
      return label.toLocaleString('en-US', numberFormatOptions);
    }
    return label;
  }

  return (
    <div className={styles.scaleContainer}>
      <p className={styles.label}>{label}</p>
      <div
        className={styles.colorBar}
        style={{
          background: `linear-gradient(90deg, ${gradient})`,
        }}
      />
      <div className={styles.labelBar}>
        <span className={styles.number}>{styleLabel(scale[0].label)}</span>
        <div className={styles.stretcher} />
        <span className={styles.number}>
          {styleLabel(scale[scale.length - 1].label)}
        </span>
      </div>
    </div>
  );
};

interface MarkerProps {
  color: string;
  hollow?: boolean;
}

const Marker: React.FC<MarkerProps> = ({ color, hollow }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    width="14"
    height="14"
    style={{
      display: 'block',
      margin: 'auto',
    }}
  >
    {hollow ? (
      <circle cx="8" cy="8" r="7" stroke={color} strokeWidth="2" />
    ) : (
      <circle
        cx="7"
        cy="8"
        r="5"
        stroke="rgb(55,65,81)"
        strokeWidth="1"
        fill={color}
      />
    )}
  </svg>
);
