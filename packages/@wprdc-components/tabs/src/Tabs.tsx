/**
 *
 * Tabs
 *
 * Tab list
 *
 */
import * as React from 'react';

import './main.css';
import styles from './Tabs.module.css';

import classNames from 'classnames';

import { useTab, useTabList, useTabPanel } from '@react-aria/tabs';
import { useTabListState } from '@react-stately/tabs';

import { TabPanelProps, TabProps, TabsProps } from '@wprdc-types/tabs';
import { Resource } from '@wprdc-types/shared';
import { useWindowSize } from '@wprdc-components/util';

import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

const SCROLL_DELTA = 300;

type ButtonSide = 'left' | 'right' | '';

export function Tabs<T extends Resource>(props: TabsProps<T>) {
  const [showButtons, setShowButons] = React.useState(false);
  const [disabledButton, setDisabledButton] = React.useState<ButtonSide>();

  const state = useTabListState(props);
  const ref = React.useRef<HTMLDivElement>(null);
  const { tabListProps } = useTabList(props, state, ref);

  const { width } = useWindowSize();

  function isOverflowing({ clientWidth, scrollWidth }: HTMLElement): boolean {
    return scrollWidth > clientWidth;
  }

  /**
   * Returns what button if any shoudl be disabled based on current state.
   * Occurs on first render and as a callback in interaction handlers
   */
  function getDisabledButton(position: number): ButtonSide {
    let dBtn: ButtonSide = '';
    if (!!ref.current) {
      // if scrolled all the way left, disable left button
      if (position <= 0) dBtn = 'left';
      // if scrolled all the way right, disable right button
      if (position >= ref.current.scrollWidth - (ref.current.clientWidth + 2))
        dBtn = 'right';
    }
    return dBtn;
  }

  /**
   * Fires when a scroll button is cliked.
   */
  const handleScroll = (dir: 'left' | 'right') => () => {
    const add = (a: number, b: number) => a + b;
    const sub = (a: number, b: number) => a - b;

    const fn = dir === 'left' ? sub : add;

    if (ref.current) {
      const pos = fn(ref.current.scrollLeft, SCROLL_DELTA);
      ref.current.scroll({
        top: 0,
        left: pos,
        behavior: 'smooth',
      });
      setDisabledButton(getDisabledButton(pos));
    }
  };

  // initialization
  React.useEffect(() => {
    setDisabledButton(getDisabledButton(0));
  }, []);

  // on window or element resize check whether to show scroll buttons
  React.useEffect(() => {
    if (!!ref.current) {
      setShowButons(isOverflowing(ref.current));
    } else setShowButons(false);
  }, [ref.current, width]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabSection}>
        {showButtons && (
          <button
            aria-hidden={true} // not necessary with screen readers
            tabIndex={-1} // or with keyboard nav
            disabled={disabledButton === 'left'}
            className={classNames(styles.scrollButton, {
              [styles.disabledButton]: disabledButton === 'left',
            })}
            onClick={handleScroll('left')}
          >
            <RiArrowLeftSLine />
          </button>
        )}
        <div {...tabListProps} ref={ref} className={styles.tabList}>
          {Array.from(state.collection).map(item => (
            <Tab<T> key={item.key} item={item} state={state} />
          ))}
        </div>
        {showButtons && (
          <button
            aria-hidden={true} // not necessary with screen readers
            tabIndex={-1} // or with keyboard nav
            disabled={disabledButton === 'right'}
            className={classNames(styles.scrollButton, {
              [styles.disabledButton]: disabledButton === 'right',
            })}
            onClick={handleScroll('right')}
          >
            <RiArrowRightSLine />
          </button>
        )}
      </div>
      <TabPanel key={state.selectedItem?.key} state={state} />
    </div>
  );
}

export function Tab<T extends Resource>({ item, state }: TabProps<T>) {
  const { key, rendered } = item;
  const ref = React.useRef<HTMLDivElement>(null);
  const { tabProps } = useTab({ key }, state, ref);
  const isSelected = state.selectedKey === key;
  const isDisabled = state.disabledKeys.has(key);
  return (
    <div
      className={classNames(styles.tabWrapper, {
        [styles.selected]: isSelected,
      })}
    >
      <div
        {...tabProps}
        title={`${rendered}`}
        ref={ref}
        className={classNames(styles.tab, {
          [styles.selected]: isSelected,
          [styles.disabled]: isDisabled,
        })}
      >
        {rendered}
      </div>
    </div>
  );
}

export function TabPanel<T extends Resource>({
  state,
  ...props
}: TabPanelProps<T>) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { tabPanelProps } = useTabPanel(props, state, ref);
  return (
    <div {...tabPanelProps} ref={ref} className={styles.tabPanel}>
      {state.selectedItem?.props.children}
    </div>
  );
}

export default Tabs;
