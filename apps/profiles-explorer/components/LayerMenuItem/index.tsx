import styles from './LayerMenuItem.module.css';
import { GeogLevel } from '@wprdc-types/geo';

export interface LayerMenuItemProps {
  geogLevel: GeogLevel;
  isVisible: boolean;
  fillColor: string;
  lineColor: string;
  // opacity: number;
}

export const LayerMenuItem = (props: LayerMenuItemProps) => {
  const { geogLevel, isVisible, fillColor, lineColor } = props;

  return (
    <div className={styles.wrapper}>
      <div className={styles.contentSection}>
        <div className={styles.title}>{geogLevel.name}</div>
        <div className={styles.subtitle}>{geogLevel.description}</div>
      </div>
      <div className={styles.optionsSection}></div>
    </div>
  );
};
