/**
 *
 * MapFilterMenu
 *
 */
import * as React from 'react';
import { Form, Formik, Field, FieldProps } from 'formik';

import styles from './MapFilterMenu.module.css';

import { Button } from '@wprdc-components/button';
import { Item } from '@wprdc-components/util';
import { Select } from '@wprdc-components/select';

import { FilterFormValues } from '../../types';

interface Props {
  onSubmit: (params: FilterFormValues) => void;
}

export function MapFilterForm({ onSubmit }: Props) {
  function handleSubmit(params: FilterFormValues) {
    onSubmit(params);
  }

  return (
    <div className={styles.wrapper}>
      <Formik<FilterFormValues>
        initialValues={{
          'risk-level': '3y',
        }}
        validateOnBlur
        onSubmit={handleSubmit}
      >
        <Form>
          <div className={styles.field}>
            <Field name="risk-level">
              {({
                field, // { name, value, onChange, onBlur }
                meta,
              }: FieldProps) => {
                return (
                  <Select
                    id="risk-level"
                    label="At risk units"
                    name={field.name}
                    onBlur={field.onBlur}
                    selectedKey={field.value}
                    onSelection={(x) => {
                      field.onChange({
                        target: { value: x, name: field.name },
                      });
                    }}
                    errorMessage={meta.touched && meta.error}
                  >
                    <Item key="">---</Item>
                    <Item key="future">Subsidy expiration 5+ years away</Item>
                    <Item key="5yr">Subsidy expiration within 5 years</Item>
                    <Item key="3yr">Subsidy expiration within 3 years</Item>
                    <Item key="1yr">Subsidy expiration within 1 year</Item>
                    <Item key="6mo">Subsidy expiration within 6 months</Item>
                  </Select>
                );
              }}
            </Field>
          </div>
          <div className={styles.buttonSection}>
            <Button type="submit">Submit</Button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}
