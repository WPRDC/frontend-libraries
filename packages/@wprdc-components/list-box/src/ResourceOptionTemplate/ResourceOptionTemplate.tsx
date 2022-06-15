import * as React from 'react';

import '../main.css';
import styles from './ResourceOptionTemplate.module.css';

import {
  OptionFieldAccessor,
  ResourceOptionTemplateProps,
} from '@wprdc-types/list-box';
import { Resource } from '@wprdc-types/shared';

export function ResourceOptionTemplate<T extends Resource>(
  props: ResourceOptionTemplateProps<T>
) {
  const {
    item,
    getIcon,
    Icon,
    titleAccessor = 'name',
    subtitleAccessor = 'description',
  } = props;

  function getContent(
    accessor: OptionFieldAccessor<T> | keyof T,
    item: T
  ): React.ReactNode {
    if (typeof accessor == 'function') return accessor(item);
    // fixme: figure out how to type this
    return (item[accessor] as unknown) as React.ReactNode;
  }

  // Try `getIcon`, and then `Icon` to generate an icon.
  const DisplayIcon = React.useMemo(() => {
    if (!!getIcon) {
      const result = getIcon(item);
      if (!!result) return result;
    }
    return Icon;
  }, [item, getIcon, Icon]);

  const title: React.ReactNode = React.useMemo(() => {
    return getContent(titleAccessor, item);
  }, [titleAccessor, item]);

  const subtitle = React.useMemo(() => {
    return getContent(subtitleAccessor, item);
  }, [subtitleAccessor, item]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleSection}>
        {!!DisplayIcon && <DisplayIcon className={styles.icon} />}
        <div className={styles.title}>{title}</div>
      </div>
      <div className={styles.subtitle}>{subtitle}</div>
    </div>
  );
}
