
/*
 * Asset Map Settings
 */
export const ASSETS_SOURCE_ID = 'w__assets';
export const ASSETS_LAYER_ID = 'w__assets';

export const ASSETS_CARTO_SQL = `SELECT id,
                                        cartodb_id,
                                        name,
                                        asset_type,
                                        asset_type_title,
                                        category,
                                        the_geom,
                                        the_geom_webmercator
                                 FROM wprdc.assets_v1`;

export const DEFAULT_ASSET_TYPES = [
  {
    name: 'nursing_homes',
    title: 'Nursing Homes',
  },
  {
    name: 'veterans_social_orgs',
    title: 'Veteran\'s Social Orgs',
  },
  {
    name: 'va_facilities',
    title: 'VA Facilities',
  },
  {
    name: 'public_buildings',
    title: 'Public Buildings',
  },
  {
    name: 'schools',
    title: 'Schools',
  },
  {
    name: 'health_centers',
    title: 'Health Centers',
  },
  {
    name: 'rec_centers',
    title: 'Rec Centers',
  },
  {
    name: 'museums',
    title: 'Museums',
  },
  {
    name: 'homeless_shelters',
    title: 'Homeless Shelters',
  },
  {
    name: 'farmers_markets',
    title: 'Farmers\' Markets',
  },
  {
    name: 'libraries',
    title: 'Libraries',
  },
  {
    name: 'faith-based_facilities',
    title: 'Faith-based Facilities',
  },
  {
    name: 'family_support_centers',
    title: 'Family Support Centers',
  },
  {
    name: 'senior_centers',
    title: 'Senior Centers',
  },
  {
    name: 'achd_clinics',
    title: 'ACHD Clinics',
  },
  {
    name: 'acha_community_sites',
    title: 'ACHA Community Sites',
  },
  {
    name: 'bars',
    title: 'Bars',
  },
  {
    name: 'supermarkets',
    title: 'Supermarkets',
  },
  {
    name: 'restaurants',
    title: 'Restaurants',
  },
  {
    name: 'parks_and_facilities',
    title: 'Parks and Facilities',
  },
  {
    name: 'coffee_shops',
    title: 'Coffee Shops',
  },
  {
    name: 'gas_stations',
    title: 'Gas Stations',
  },
  {
    name: 'laundromats',
    title: 'Laundromats',
  },
  {
    name: 'hair_salons',
    title: 'Hair Salons',
  },
  {
    name: 'nail_salons',
    title: 'Nail Salons',
  },
  {
    name: 'barbers',
    title: 'Barbers',
  },
  {
    name: 'child_care_centers',
    title: 'Child Care Centers',
  },
  {
    name: 'social_clubs',
    title: 'Social clubs',
  },
  {
    name: 'nursing__e90',
    title: 'Nursing facility',
  },
  {
    name: 'ambulatory_and_primary_health_care__e30',
    title: 'Primary health care',
  },
  {
    name: 'specialty_hospitals__e24',
    title: 'Specialty hospitals',
  },
  {
    name: 'rehabilitative_care__e50',
    title: 'Rehabilitative care',
  },
  {
    name: 'community_clinics__e32',
    title: 'Community clinics',
  },
  {
    name: 'reproductive_health_care__e40',
    title: 'Reproductive health care',
  },
  {
    name: 'home_health_care__e92',
    title: 'Home health-care services',
  },
  {
    name: 'health_care_nec__e99',
    title: 'Other health-care services',
  },
  {
    name: 'hospitals__e20',
    title: 'Hospitals',
  },
];
