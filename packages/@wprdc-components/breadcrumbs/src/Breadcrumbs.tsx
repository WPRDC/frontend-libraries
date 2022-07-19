/**
 *
 * Breadcrumbs
 *
 * Like Hansel and Gretel.
 *
 */
import * as React from 'react';
import './main.css';
import styles from './Breadcrumbs.module.css';
import {
  BreadcrumbItemProps,
  BreadcrumbsProps,
} from '@wprdc-types/breadcrumbs';

import { useBreadcrumbItem, useBreadcrumbs } from '@react-aria/breadcrumbs';

import classNames from 'classnames';

export function Breadcrumbs<T>(props: BreadcrumbsProps<T>) {
  const { navProps } = useBreadcrumbs(props);
  const children = React.Children.toArray(props.children);
  const { showCurrent = true, bigTitle, titleElement = 'h3', shallow } = props;

  const lastChild = children[children.length - 1];

  return (
    <nav {...navProps} className={styles.wrapper}>
      {(showCurrent || children.length > 1) && (
        <ol className={styles.list}>
          {children.map((child, i) => {
            if (i < children.length - 1) {
              return React.cloneElement(child as React.ReactElement, {
                isCurrent: false,
                elementType: 'a',
                hideDivider: !showCurrent && i == children.length - 1,
                shallow,
              });
            }
            if (showCurrent && !bigTitle) {
              return React.cloneElement(child as React.ReactElement, {
                isCurrent: true,
                elementType: titleElement,
                bigTitle: bigTitle,
                shallow,
              });
            }
            return null;
          })}
        </ol>
      )}
      {showCurrent &&
        !!bigTitle &&
        React.cloneElement(lastChild as React.ReactElement, {
          isCurrent: true,
          elementType: titleElement,
          bigTitle: bigTitle,
          shallow,
        })}
    </nav>
  );
}

export function BreadcrumbItem(props: BreadcrumbItemProps) {
  const {
    LinkComponent,
    TitleComponent,
    divider,
    hideDivider,
    bigTitle,
    shallow,
    isDisabled,
  } = props;

  const ref = React.useRef(null);
  const { itemProps } = useBreadcrumbItem(props, ref);

  const Title = TitleComponent || 'h3';
  const Link = LinkComponent || 'a';
  const dividerContent = divider || (
    <span aria-hidden="true" className={styles.divider}>
      /
    </span>
  );

  let breadcrumbContent;
  if (props.isCurrent) {
    breadcrumbContent = (
      <Title
        {...itemProps}
        ref={ref}
        className={classNames(styles.title, { [styles.bigTitle]: bigTitle })}
      >
        {props.children}
      </Title>
    );
  } else {
    breadcrumbContent = (
      <>
        {isDisabled ? (
          <span ref={ref}>{props.children}</span>
        ) : (
          <Link
            {...itemProps}
            ref={ref}
            href={props.href || '#'}
            shallow={shallow}
          >
            {props.children}
          </Link>
        )}
        {!hideDivider && dividerContent}
      </>
    );
  }
  if (!!props.isCurrent && !!bigTitle) return breadcrumbContent;
  return <li className={styles.listItem}>{breadcrumbContent}</li>;
}

export default Breadcrumbs;
