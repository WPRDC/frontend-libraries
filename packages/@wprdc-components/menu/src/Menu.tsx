/**
 *
 * Menu
 *
 * List of menu options
 *
 */
import React from 'react';

import './main.css';
import styles from './Menu.module.css';

import classNames from 'classnames';

import { useTreeState } from '@react-stately/tree';
import { useSeparator } from '@react-aria/separator';
import { useFocus } from '@react-aria/interactions';
import { mergeProps } from '@react-aria/utils';

import { useMenu, useMenuItem, useMenuSection } from '@react-aria/menu';

import { MenuItemProps, MenuProps, MenuSectionProps } from '@wprdc-types/menu';
import { Resource } from '@wprdc-types/shared';

export const Menu = <T extends Resource>(props: MenuProps<T>): JSX.Element => {
  const state = useTreeState({ ...props });

  const items = Array.from(state.collection);

  const ref = React.useRef<HTMLUListElement>(null);
  const { menuProps } = useMenu<T>(props, state, ref);

  return (
    <ul {...menuProps} ref={ref} className={styles.menu}>
      {items.map((item) => {
        if (item.type === 'section') {
          return (
            <MenuSection<T>
              key={item.key}
              section={item}
              state={state}
              onAction={props.onAction}
            />
          );
        }
        return (
          <MenuItem<T>
            key={item.key}
            item={item}
            state={state}
            onAction={props.onAction}
          />
        );
      })}
    </ul>
  );
};

function MenuItem<T>({ item, state, onAction }: MenuItemProps<T>): JSX.Element {
  const ref = React.useRef<HTMLLIElement>(null);
  const isDisabled = state.disabledKeys.has(item.key);

  const { menuItemProps } = useMenuItem(
    {
      key: item.key,
      isDisabled,
      onAction,
    },
    state,
    ref,
  );

  const [isFocused, setFocused] = React.useState(false);
  const { focusProps } = useFocus({ onFocusChange: setFocused });

  const focusedStyle = isFocused ? styles.focused : null;

  return (
    <li
      {...mergeProps(menuItemProps, focusProps)}
      ref={ref}
      className={classNames([styles.menuItem, focusedStyle])}
      style={{ cursor: isDisabled ? 'default' : 'pointer' }}
    >
      {item.rendered}
    </li>
  );
}

function MenuSection<T>({
                          section,
                          state,
                          onAction,
                        }: MenuSectionProps<T>): JSX.Element {
  const { itemProps, headingProps, groupProps } = useMenuSection({
    heading: section.rendered,
    'aria-label': section['aria-label'],
  });

  const { separatorProps } = useSeparator({
    elementType: 'li',
  });

  const nodes = Array.from(section.childNodes);

  return (
    <>
      {section.key !== state.collection.getFirstKey() && (
        <li {...separatorProps} className={styles.separator} />
      )}
      <li {...itemProps}>
        {section.rendered && (
          <span {...headingProps} className={styles.sectionHeading}>
            {section.rendered}
          </span>
        )}
        <ul {...groupProps} className={styles.section}>
          {nodes.map((node) => (
            <MenuItem
              key={node.key}
              item={node}
              state={state}
              onAction={onAction}
            />
          ))}
        </ul>
      </li>
    </>
  );
}

export default Menu;
