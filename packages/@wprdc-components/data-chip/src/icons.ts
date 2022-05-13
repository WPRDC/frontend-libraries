import {
  RiBusFill,
  RiCommunityFill,
  RiContactsFill,
  RiDatabase2Fill,
  RiGroupFill,
  RiMailFill,
  RiPhoneFill,
  RiUser3Fill,
  RiPagesFill,
  RiMapPinFill,
} from 'react-icons/ri';
import { DataChipIcon } from '@wprdc-types/data-chip';

export const icons: { [key in DataChipIcon]: any } = {
  map: RiMapPinFill,
  phone: RiPhoneFill,
  contacts: RiContactsFill,
  person: RiUser3Fill,
  group: RiGroupFill,
  community: RiCommunityFill,
  bus: RiBusFill,
  link: RiPagesFill,
  mail: RiMailFill,
  database: RiDatabase2Fill,
};
