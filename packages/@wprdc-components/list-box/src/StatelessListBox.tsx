/**
 *
 * ListBox
 *
 * ...it's a list in a box, baby.
 *
 */
import React from 'react';

import './main.css';
import styles from './ListBox.module.css';

import classNames from 'classnames';

import { useSeparator } from '@react-aria/separator';

import { ListBoxSectionAria, useListBox, useListBoxSection, useOption } from '@react-aria/listbox';
import { RiCheckFill } from 'react-icons/ri';

import { ListBoxSectionProps, OptionProps, StatelessListBoxProps } from '@wprdc-types/list-box';

export const StatelessListBox = <T extends object, O extends object = {}>(
  props: StatelessListBoxProps<T, O>,
): JSX.Element => {
  const defaultRef = React.useRef<HTMLUListElement>(null);
  const {
    listBoxRef = defaultRef,
    state,
    dense,
    optionTemplate,
    optionTemplateOptions,
  } = props;
  const { listBoxProps, labelProps } = useListBox<T>(props, state, listBoxRef);

  const items = Array.from(state.collection);

  return (
    <div className={classNames(styles.wrapper)}>
      <div {...labelProps} className={styles.label}>
        {props.label}
      </div>
      <ul
        {...listBoxProps}
        ref={listBoxRef}
        className={classNames(styles.list, {
          [styles.focused]: state.isFocused,
        })}
      >
        {items.map((item) => {
          if (item.type === 'section') {
            return (
              <ListBoxSection<T, O>
                key={item.key}
                section={item}
                state={state}
                dense={dense}
                optionTemplate={optionTemplate}
                optionTemplateOptions={optionTemplateOptions}
              />
            );
          }
          return (
            <Option<T, O>
              key={item.key}
              item={item}
              state={state}
              dense={dense}
              optionTemplate={optionTemplate}
              optionTemplateOptions={optionTemplateOptions}
            />
          );
        })}
      </ul>
    </div>
  );
};

export const ListBoxSection = <T extends object, O extends object = {}>(
  props: ListBoxSectionProps<T, O>,
) => {
  const { section, state, dense, optionTemplate, optionTemplateOptions } =
    props;

  const { itemProps, headingProps, groupProps }: ListBoxSectionAria =
    useListBoxSection({
      heading: section.rendered,
      'aria-label': section['aria-label'],
    });

  const { separatorProps } = useSeparator({
    elementType: 'li',
  });

  const nodes = Array.from(section.childNodes);

  return (
    <div className={styles.section}>
      {section.key !== state.collection.getFirstKey() && (
        <li {...separatorProps} className={styles.separator} />
      )}
      <li {...itemProps} className={styles.sectionListItem}>
        {section.rendered && (
          <span {...headingProps} className={styles.sectionHeading}>
            {section.rendered}
          </span>
        )}
        <ul {...groupProps} className={styles.optionList}>
          {nodes.map(
            (node) =>
              !!node && (
                <Option<T, O>
                  key={node.key}
                  item={node}
                  state={state}
                  dense={dense}
                  optionTemplate={optionTemplate}
                  optionTemplateOptions={optionTemplateOptions}
                />
              ),
          )}
        </ul>
      </li>
    </div>
  );
};

export const Option = <T extends object, O extends object = {}>({
                                                                  item,
                                                                  state,
                                                                  dense,
                                                                  optionTemplate,
                                                                  optionTemplateOptions,
                                                                }: OptionProps<T, O>) => {
  const ref = React.useRef<HTMLLIElement>(null);
  const Template = optionTemplate;
  const { optionProps, isDisabled, isSelected, isFocused } = useOption(
    {
      key: item.key,
    },
    state,
    ref,
  );

  const content = React.useMemo(() => {
    if (!!Template) {
      // @ts-ignore
      return <Template item={item.value} {...optionTemplateOptions} />;
    }
    return item.rendered;
  }, [item, Template]);

  return (
    <li
      {...optionProps}
      ref={ref}
      className={classNames(styles.option, {
        [styles.optionSelected]: isSelected,
        [styles.optionDisabled]: isDisabled,
        [styles.optionFocused]: isFocused,
        [styles.dense]: dense,
      })}
    >
      <div className='flex-grow'>{content}</div>
      <div className='flex items-center'>
        {isSelected ? (
          <RiCheckFill className={styles.checkMark} />
        ) : (
          <div className={styles.checkMark} />
        )}
      </div>
    </li>
  );
};
