export interface CKANResponse<T extends object> {
  help: string;
  success: boolean;
  result: T;
}

export interface Publisher {
  display_name: string;
  description: string;
  image_display_url: string;
  package_count: number;
  created: string;
  name: string;
  is_organization: boolean;
  state: string;
  extras: string[];
  image_url: string;
  groups: string[];
  type: string;
  title: string;
  revision_id: string;
  num_followers: number;
  id: string;
  tags: string[];
  approval_status: string;
}

export interface Resource {
  mimetype: string;
  cache_url: string;
  hash: string;
  description: string;
  name: string;
  format: string;
  url: string;
  datastore_active: boolean;
  cache_last_updated: string;
  package_id: string;
  created: string;
  state: string;
  mimetype_inner: string;
  last_modified: string;
  position: number;
  revision_id: string;
  url_type: string;
  id: string;
  resource_type: string;
  size: null;
}

export interface PublisherBrief {
  description: string;
  created: string;
  title: string;
  name: string;
  is_organization: true;
  state: string;
  image_url: string;
  revision_id: string;
  type: string;
  id: string;
  approval_status: string;
}

export interface Tag {
  vocabulary_id: null;
  state: string;
  display_name: string;
  id: string;
  name: string;
}

export interface Group {
  display_name: string;
  description: string;
  image_display_url: string;
  title: string;
  id: string;
  name: string;
}

export interface Package {
  geographic_unit: string;
  license_title: string;
  maintainer: null;
  data_steward_email: string;
  relationships_as_object: [];
  access_level_comment: string;
  frequency_publishing: string;
  maintainer_email: null;
  num_tags: 2;
  id: string;
  metadata_created: string;
  group: string;
  metadata_modified: string;
  author: null;
  author_email: null;
  state: string;
  version: null;
  department: string;
  license_id: string;
  type: string;
  resources: Resource[];
  num_resources: number;
  data_steward_name: string;
  tags: Tag[];
  frequency_data_change: string;
  private: false;
  groups: Group[];
  creator_user_id: string;
  relationships_as_subject: [];
  organization: PublisherBrief[];
  data_notes: string;
  name: string;
  isopen: true;
  url: null;
  notes: string;
  owner_org: string;
  temporal_coverage: string;
  related_documents: string;
  license_url: string;
  title: string;
  revision_id: string;
}
