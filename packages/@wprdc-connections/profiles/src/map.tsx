// import { MapPluginConnection } from '@wprdc-types/connections';
// import { IndicatorBase, ProfilesMapProperties } from '@wprdc-types/profiles';
// import { ProjectKey } from '@wprdc-types/shared';
// import { useMapPlugin } from '@wprdc-connections/util';
// import { ResponsePackage } from '@wprdc-types/api';
// import { ProfilesAPI } from './api';
//

// todo: this is based on an old, crappier way of doing it.  now that the necessary
//  data comes with teh indicator all at once, we can have teh map compent react to that data

// export const indicatorMapConnection: MapPluginConnection<
//   IndicatorBase,
//   ProfilesMapProperties
//   > = {
//   name: ProjectKey.Profiles,
//   use: useMapPlugin,
//   getSources(items, _, setSources, options) {
//     const { geography } = options || {};
//
//     // filter out highlight source and only take the data layer's source
//     function filterResponse(response: ResponsePackage<DownloadedMiniMapViz>[]) {
//       return response.reduce<SourceProps[]>((result, item) => {
//         if (!!item.data) return [...result, ...item.data.options.sources];
//         return result;
//       }, []);
//     }
//
//     if (!!items && !!geography) {
//       const requests = items.map(item =>
//         ProfilesAPI.requestIndicator(item.slug, geography)
//       );
//
//       // for each one, if there is response data, then put it in the list for setSources
//       Promise.all(requests).then(response =>
//         setSources(filterResponse(response))
//       );
//     }
//   },
//   getLayers(items, selected, setLayers, options) {
//     const { geography } = options || {};
//
//     // filter out highlight source and only take the data layer's source
//     function filterResponse(response: ResponsePackage<DownloadedMiniMapViz>[]) {
//       return response.reduce<LayerProps[]>((result, item) => {
//         if (!!item.data && (selected === 'all' || selected.has(item.data.slug)))
//           return [...result, ...item.data.options.layers];
//         return result;
//       }, []);
//     }
//
//     if (!!items && !!geography) {
//       const requests = items.map(item =>
//         VizAPI.requestIndicator<DownloadedMiniMapViz>(item.slug, geography)
//       );
//       // for each one, if there is response data, then put it in the list for setSources
//       Promise.all(requests).then(response =>
//         setLayers(filterResponse(response))
//       );
//     }
//   },
//   getLegendItems(items, selected, setLegendItems, options) {
//     const { geography } = options || {};
//
//     // filter out highlight source and only take the data layer's source
//     function filterResponse(response: ResponsePackage<DownloadedMiniMapViz>[]) {
//       return response.reduce<LegendItemProps[]>((result, item) => {
//         if (!!item.data && (selected === 'all' || selected.has(item.data.slug)))
//           return [...result, ...item.data.options.legends];
//         return result;
//       }, []);
//     }
//
//     if (!!items && !!geography) {
//       const requests = items.map(item =>
//         VizAPI.requestIndicator<DownloadedMiniMapViz>(item.slug, geography)
//       );
//       // for each one, if there is response data, then put it in the list for setSources
//       Promise.all(requests).then(response =>
//         setLegendItems(filterResponse(response))
//       );
//     }
//   },
//   getInteractiveLayerIDs(items, selected) {
//     const categories =
//       selected === 'all' ? items.map(item => item.name) : Array.from(selected);
//     return categories.map(c => c.toString());
//   },
//   parseMapEvent: event => {
//     if (!!event && !!event.features) {
//       const features = event.features.filter(
//         feature =>
//           !!feature &&
//           !!feature.source &&
//           !!feature.properties &&
//           feature.source === VIZ_SOURCE_ID
//       );
//       return features.map(
//         ({ properties }) => properties as ProfilesMapProperties
//       );
//     }
//     return [];
//   },
//   makeFilter: item => {
//     if (Array.isArray(item)) return ['in', 'geoid', item.map(i => i.id)];
//     return ['==', 'id', item.id];
//   },
//   makeLegendSection: (setLegendSection, items) => {
//     if (!!items && !!items.length)
//       setLegendSection(
//         <LegendSection title="Neighborhood Assets">
//           {items.map(item => (
//             <LegendItem {...item} />
//           ))}
//         </LegendSection>
//       );
//     else setLegendSection();
//   },
//   makeMapSection: (setMapSection, sources, layers) => {
//     if (!!sources && !!layers) {
//       setMapSection(
//         <>
//           <Source {...sources[0]} key={sources[0].id} />
//           <Layer {...layers[0]} key={layers[0].id} />
//         </>
//       );
//     }
//   },
//   getSelectedItems(items, selection) {
//     return selection === 'all'
//       ? items
//       : items.filter(item => selection.has(item.id));
//   },
//   makeLayerPanelSection() {
//     // todo: implement
//   },
//   makeHoverContent: () => {
//     return null; // todo: implement
//   },
//   makeClickContent: () => {
//     return null; // todo: implement
//   },
// };
