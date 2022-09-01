/**
 *
 * Tabs
 *
 * Tab list
 *
 */
import * as React from 'react';
import styles from './Tabs.module.css';

import classNames from 'classnames';

import { useWindowSize } from '@wprdc-components/util';

import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import { Resource } from '@wprdc-types/shared';
import Link from 'next/link';
import { GeogBrief } from '@wprdc-types/geo';

const SCROLL_DELTA = 300;

type ButtonSide = 'left' | 'right' | '';

interface NavTabProps<T extends Resource> {
  items?: T[];
  makeLinkProps?: (item: T) => object;
  selectedKey?: React.Key;
  getKey?: (item: T) => React.Key;
  disabledKeys?: Set<React.Key>;
  geog?: GeogBrief;
  basePath?: string;
}

export function NavTabs<T extends Resource>(props: NavTabProps<T>) {
  const [showButtons, setShowButtons] = React.useState(false);
  const [disabledButton, setDisabledButton] = React.useState<ButtonSide>();

  const ref = React.useRef<HTMLOListElement>(null);

  const { width } = useWindowSize();

  const {
    items,
    getKey = item => item.slug,
    selectedKey,
    disabledKeys,
    basePath = '/explore',
    geog,
  } = props;

  function isOverflowing({ clientWidth, scrollWidth }: HTMLElement): boolean {
    return scrollWidth > clientWidth;
  }

  /**
   * Returns what button if any should be disabled based on current state.
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
   * Fires when a scroll button is clicked.
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
      setShowButtons(isOverflowing(ref.current));
    } else setShowButtons(false);
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
            <AiFillCaretLeft />
          </button>
        )}
        <nav className={styles.navWrapper}>
          <ol ref={ref} className={styles.tabList}>
            {!!items &&
              items.map(item => (
                <li
                  key={getKey(item)}
                  className={classNames(styles.tabWrapper, {
                    [styles.selected]: getKey(item) === selectedKey,
                  })}
                >
                  <Link href={`${basePath}/${item.slug}?geog=${geog?.slug}`}>
                    <a
                      className={classNames(styles.tab, styles.anchorFix, {
                        [styles.selected]: getKey(item) === selectedKey,
                        [styles.disabled]:
                          !!disabledKeys && disabledKeys.has(getKey(item)),
                      })}
                    >
                      {item.name}
                    </a>
                  </Link>
                </li>
              ))}
          </ol>
        </nav>
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
            <AiFillCaretRight />
          </button>
        )}
      </div>
    </div>
  );
}
