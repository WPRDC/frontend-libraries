import * as React from 'react';

import classNames from 'classnames';

import './main.css';
import styles from './AHProjectView.module.css';

import { LoadingMessage } from '@wprdc-components/loading-message';
import { ProjectIndexDetails } from '@wprdc-types/housecat';

import { RiPrinterFill } from 'react-icons/ri';

import {
  affordableHousingSchema,
  SchemaItem,
  SchemaSection,
} from './housingSchema';
import { Button } from '@wprdc-components/button';

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

  function handlePrint() {
    if (!!window) {
      window.print();
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.heading}>
        <div>
          <div className={styles.topBar}>
            <div className={styles.IDSection}>
              {!!project.propertyId && (
                <>
                  <span className={styles.bolded}>ID: </span>
                  <span className={styles.propertyID}>
                    {project.propertyId}
                  </span>
                </>
              )}
            </div>
            <div className={styles.menuSection}>
              <Button onPress={handlePrint}>
                <RiPrinterFill />
              </Button>
            </div>
          </div>
          <h2 className={styles.title}>{project.name} </h2>
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
        {schemaEntry.items.map(({ accessor, label, format }) => {
          const displayValue = formatValue({ format, accessor, label }, record);
          return (
            <tr>
              <td className={styles.fieldCell}>{label}</td>
              <td
                className={classNames(styles.valueCell, {
                  [styles.notApp]: displayValue === 'N/A',
                })}
              >
                {displayValue}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function formatValue<T>({ format, accessor }: SchemaItem<T>, record: T) {
  const value: React.ReactNode | undefined =
    typeof accessor === 'function' ? accessor(record) : record[accessor];

  if (value === null || value === undefined || value === '') return 'N/A';

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
