import * as React from 'react';

import classNames from 'classnames';

import './main.css';
import styles from './AHProjectView.module.css';

import { LoadingMessage } from '@wprdc-components/loading-message';
import { ProjectIndexDetails } from '@wprdc-types/housecat';

import {
  affordableHousingSchema,
  SchemaItem,
  SchemaSection,
} from './housingSchema';

export interface AHProjectViewProps {
  project: ProjectIndexDetails;
  isLoading?: boolean;
}

export const AHProjectView: React.FC<AHProjectViewProps> = ({
  project,
  isLoading,
}) => {
  if (!!isLoading) return <LoadingMessage />;
  if (!project) return <div />;

  return (
    <div className={styles.wrapper}>
      <div className={styles.heading}>
        <div>
          <h2 className={styles.title}>{project.name} </h2>
          {!!project.propertyId && (
            <>
              <span className={styles.bolded}>ID: </span>
              <span className={styles.propertyID}>{project.propertyId}</span>
            </>
          )}
        </div>
        <div className={styles.address}>{project.propertyStreetAddress}</div>

        {Object.entries(affordableHousingSchema).map(([key, section]) => {
          // @ts-ignore
          const recordData: any[] = project[key];

          if (!recordData.length) return null;

          return (
            <div key={key} className={styles.sectionWrapper}>
              <h3 className={styles.sectionTitle}>{section.title}</h3>
              {/* for each record in the section*/}
              {recordData.map((record) => (
                <div className={styles.itemWrapper}>
                  <MiniTable schemaEntry={section} record={record} />
                </div>
              ))}
            </div>
          );
        })}

        <div className={styles.wrapper}>{}</div>
      </div>
    </div>
  );
};

interface TableProps<T> {
  schemaEntry: SchemaSection<T>;
  record: T;
}

function MiniTable<T>(props: TableProps<T>) {
  const { schemaEntry, record } = props;

  return (
    <table className={styles.infoTable}>
      <tbody>
        {schemaEntry.items.map(({ accessor, label, format }) => (
          <tr>
            <td className={styles.fieldCell}>{label}</td>
            <td
              className={classNames(styles.valueCell, {
                [styles.stringCell]:
                  !!format && ['string', 'date'].includes(format),
              })}
            >
              {formatValue({ format, accessor, label }, record)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function formatValue<T>({ format, accessor }: SchemaItem<T>, record: T) {
  const value =
    typeof accessor === 'function' ? accessor(record) : record[accessor];

  switch (format) {
    case 'percent':
      let tmpVal: number = value as number;
      if (tmpVal > 1) {
        tmpVal /= 10;
      }
      return tmpVal.toLocaleString('en-US', { style: 'percent' });
    case 'money':
      return (value as number).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      });
    case 'date':
      return new Date(value as string).toLocaleDateString();
    case 'string':
    default:
      return value;
  }
}
