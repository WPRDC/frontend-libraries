import * as React from 'react';
import { Map } from '../packages/@wprdc-components/map';

import 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { LayerPanelVariant } from '../packages/@wprdc-types/map';

// import { assetMapConnection } from '../packages/@wprdc-connections/neighborhood-assets';

import { menuLayerConnection } from '../packages/@wprdc-connections/geo';
import { GeogLevel, GeographyType } from '../packages/@wprdc-types/geo';
import { ConnectionCollection } from '../packages/@wprdc-types/connections';

export default {
  title: 'Components/Map',
  component: Map,
};

export const Default: React.FC = () => {
  return (
    <div style={{ height: '400px', border: '2px solid black' }}>
      <Map
        connections={[menuLayerConnection] as ConnectionCollection}
        connectionHookArgs={{
          'geo-menu': {
            layerItems: menuLayers,
          },
        }}
        onClick={console.log}
        layerPanelVariant={LayerPanelVariant.Inside}
        mapboxApiAccessToken="pk.eyJ1Ijoic3RldmVuZHNheWxvciIsImEiOiJja295ZmxndGEwbGxvMm5xdTc3M2MwZ2xkIn0.WDBLMZYfh-ZGFjmwO82xvw"
      />
    </div>
  );
};

const menuLayers: GeogLevel[] = [
  {
    name: 'Neighborhood',
    slug: GeographyType.Neighborhood,
    id: GeographyType.Neighborhood,
    description: 'Official City of Pittsburgh neighborhood boundaries',
  },
];

// const profilesLayers: DataVizID[] = [
//   {
//     id: 58,
//     name: 'Population Under 18',
//     slug: 'pop-under18-map',
//     vizType: DataVizType.MiniMap,
//     description: 'Count and percentage of population ages 0 - 17',
//   },
// ];
