/**
 * Map
 *
 * Display stuff on map :check:
 *
 */

import * as React from 'react';
import styles from './Map.module.css';
import {
  Map as ReactMapGLMap,
  Layer,
  LayerProps,
  MapLayerMouseEvent,
  NavigationControl,
  Source,
  SourceProps,
  MapRef,
  ViewState,
  ViewStateChangeEvent,
} from 'react-map-gl';
import { LayerPanelVariant, PopupContentProps } from '@wprdc-types/map';
import {
  MouseEventHandler,
  MapPluginToolbox,
  ConnectableMapProps,
  ConnectedLayerPanelProps,
} from '@wprdc-types/connections';
import { ColorScheme } from '@wprdc-types/shared';
import { useProvider } from '@wprdc-components/provider';
import { basemaps, DEFAULT_BASEMAP_STYLE, DEFAULT_VIEWSTATE } from './settings';
import {
  flattenToolboxViewStates,
  handleMouseEventForToolboxes,
  hasFeatures,
  hashViewState,
  makeContentProps,
  useCombinedRefs,
} from './utils';

import { LayerPanel } from './layerpanel';
import { Legend, LegendItem } from './legend';
import { HoverPopup, ClickPopup } from './popup';
import { useMemo } from 'react';

export const userPrefersDark =
  !(typeof window === 'undefined') &&
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

export const DEFAULT_COLOR_SCHEME = userPrefersDark
  ? ColorScheme.Dark
  : ColorScheme.Light;

export const Map = React.forwardRef<MapRef, ConnectableMapProps>(
  (
    {
      connections = [],
      connectionHookArgs = {},

      layerPanelVariant,
      colorScheme,
      hideLegendTitle,
      CustomHoverContents,
      CustomClickContents,

      // old stuff - still good just old
      mapboxApiAccessToken,
      initialViewState,
      basemapStyle,
      sources,
      layers,
      children,
      onMove,
      onHover,
      onClick,
      optionsMenu,
      legendItems,
      useFeaturelessEvents,
      interactiveLayerIds: _interactiveLayerIDs = [],

      // had to pull these out cause of some typing mismatch it seems
      fog,
      terrain,
      ...otherInteractiveMapProps
    },
    ref
  ) => {
    const innerRef = React.useRef<MapRef>(null);
    const combinedRef = useCombinedRefs(ref, innerRef);

    // context record to share data across plugins
    const [pluginContext, setPluginContext] = React.useState<
      Record<string, any>
    >({});

    // Internal state
    // ------------------------------------------------------------------------
    const [cursor, setCursor] = React.useState<string>('auto');
    const [viewState, setViewState] = React.useState<Partial<ViewState>>(
      initialViewState || DEFAULT_VIEWSTATE
    );
    const [hoverPopup, setHoverPopup] = React.useState<React.ReactNode>();
    const [clickPopup, setClickPopup] = React.useState<React.ReactNode>();

    // Theming
    // ------------------------------------------------------------------------
    const mapStyle = basemapStyle
      ? basemaps[basemapStyle]
      : DEFAULT_BASEMAP_STYLE;

    // if any connections are provided, run through them
    const toolboxes: MapPluginToolbox<any, any>[] = connections.map(
      connection => {
        const hookArgs = connectionHookArgs[connection.name] || {};
        return connection.use({
          connection,
          ...hookArgs,
          context: pluginContext,
          setContext: setPluginContext,
        });
      }
    );

    console.debug('Map Connection Toolboxes');
    console.debug(toolboxes);

    // extract the viewstate from toolboxes -- union all viewstates
    // todo: maybe it's better to just use the first one found
    const toolboxViewState = flattenToolboxViewStates(toolboxes);

    // check if toolbox viewState has changed
    React.useEffect(() => {
      if (!!toolboxViewState.latitude && !!toolboxViewState.longitude) {
        const { latitude, longitude, ...viewStateProps } = toolboxViewState;
        combinedRef.current?.easeTo({
          center: [latitude, longitude],
          ...viewStateProps,
        });
      }
    }, [combinedRef, hashViewState(toolboxViewState)]);

    // Wrappers around commonly-used event handlers
    // ------------------------------------------------------------------------
    /**
     * Handle the primary Mouse Events over the Map (click and hover for now).
     */
    const handleMouseEvent: MouseEventHandler = (
      eventType,
      event,
      Popup,
      setPopup,
      CustomContentComponent,
      callback
    ) => {
      const _isOverInteractiveLayer = (event: MapLayerMouseEvent) =>
        !!event.features &&
        !!interactiveLayerIDs &&
        interactiveLayerIDs.includes(event.features[0]?.layer.id);

      const overInteractiveLayer = _isOverInteractiveLayer(event);

      if (overInteractiveLayer) setCursor('pointer');
      else setCursor('auto');

      if (useFeaturelessEvents || hasFeatures(event)) {
        if (overInteractiveLayer) {
          // use pointer cursor when over interactive item
          const { lng, lat } = event.lngLat;
          // allow for outside provided content
          let customContents: React.ReactNode = undefined;
          if (!!CustomContentComponent) {
            const contentProps: PopupContentProps = makeContentProps(event);
            customContents = <CustomContentComponent {...contentProps} />;
          }
          const {
            toolboxItems,
            toolboxContents,
          } = handleMouseEventForToolboxes(toolboxes, event, eventType);
          if (
            !!customContents ||
            (!!toolboxContents && !!toolboxContents.length)
          )
            setPopup(
              <Popup longitude={lng} latitude={lat}>
                {customContents}
                {toolboxContents}
              </Popup>
            );
          if (!!callback) {
            callback(event, toolboxes, toolboxItems);
          }
        } else {
          // if not over an interactive layer, set cursor to
          setPopup(null);
        }
      }
    };

    const handleHover = (event: MapLayerMouseEvent) => {
      handleMouseEvent(
        'hover',
        event,
        HoverPopup,
        setHoverPopup,
        CustomHoverContents,
        onHover
      );
    };

    const handleClick = (event: MapLayerMouseEvent) => {
      console.debug('Map Click', event, event.features);
      return handleMouseEvent(
        'click',
        event,
        ClickPopup,
        setClickPopup,
        CustomClickContents,
        onClick
      );
    };

    const handleMouseLeave = () => {
      if (hoverPopup) setHoverPopup(null);
      setCursor('auto');
    };

    const handleViewportChange = (e: ViewStateChangeEvent) => {
      setViewState(e.viewState);
    };

    // Prepare for render
    // ------------------------------------------------------------------------

    // get mapbox api key, preferring prop to context
    const { mapboxAPIToken: ctxToken } = useProvider();
    const mapboxToken: string | undefined = mapboxApiAccessToken || ctxToken;

    // update the full set of interactive layer IDs when any change.
    const interactiveLayerIDs = React.useMemo(
      () =>
        _interactiveLayerIDs.concat(
          toolboxes.reduce((intIDs, tb) => {
            if (!!tb.interactiveLayerIDs)
              return [...intIDs, ...tb.interactiveLayerIDs];
            return intIDs;
          }, [] as string[])
        ),
      [_interactiveLayerIDs, connections]
    );

    const customLegendContent = React.useMemo(() => {
      if (!!legendItems) {
        return legendItems.map(itemProps => (
          <LegendItem {...itemProps} key={itemProps.key} />
        ));
      }
      return null;
    }, [legendItems]);

    // only show legend if there is something to put in it
    // i.e. there's custom content, or any of the toolboxes have legend items
    const showLegend =
      !!customLegendContent ||
      !!toolboxes.find(tb => !!tb.legendItems && !!tb.legendItems.length);

    const { tbSources, tbLayers } = useMemo(() => {
      return toolboxes.reduce(
        (result, tb) => {
          let tmpS = result.tbSources;
          let tmpL = result.tbLayers;
          if (!!tb.sources) tmpS = [...result.tbSources, ...tb.sources];
          if (!!tb.layers) tmpL = [...result.tbLayers, ...tb.layers];
          return { tbSources: tmpS, tbLayers: tmpL };
        },
        {
          tbSources: [] as SourceProps[],
          tbLayers: [] as LayerProps[],
        }
      );
    }, [toolboxes, connections, connectionHookArgs]);

    return (
      <div className={styles.container}>
        {layerPanelVariant === LayerPanelVariant.Left ? (
          <OutsideLayerPanel toolboxes={toolboxes} />
        ) : (
          <div />
        )}
        <div className={styles.mapContainer}>
          <ReactMapGLMap
            ref={combinedRef}
            cursor={cursor}
            {...viewState}
            mapboxAccessToken={mapboxToken}
            mapStyle={mapStyle}
            onMouseMove={handleHover}
            onClick={handleClick}
            onMouseLeave={handleMouseLeave}
            onMove={handleViewportChange}
            interactiveLayerIds={interactiveLayerIDs}
            fog={fog || undefined}
            terrain={terrain || undefined}
            {...otherInteractiveMapProps}
          >
            {/* Plugin layers */}
            {!!tbSources &&
              tbSources.map(source => <Source key={source.id} {...source} />)}
            {!!tbSources &&
              !!tbLayers &&
              tbLayers.map(layer => <Layer key={layer.id} {...layer} />)}

            {/* Custom Layers */}
            {!!sources &&
              sources.map(source => <Source key={source.id} {...source} />)}
            {!!sources &&
              !!layers &&
              layers.map(layer => <Layer key={layer.id} {...layer} />)}

            {children}
            {hoverPopup}
            {clickPopup}

            {layerPanelVariant === LayerPanelVariant.Inside && (
              <InsideLayerPanel toolboxes={toolboxes} />
            )}

            <div className={styles.navControls}>
              <NavigationControl />
            </div>

            <div className={styles.optionsMenu}>{optionsMenu}</div>

            <div className={styles.legend}>
              {showLegend && (
                <Legend
                  title={hideLegendTitle ? '' : 'legend'}
                  toolboxes={toolboxes}
                >
                  {customLegendContent}
                </Legend>
              )}
            </div>
          </ReactMapGLMap>
        </div>
        {layerPanelVariant === LayerPanelVariant.Right ? (
          <OutsideLayerPanel toolboxes={toolboxes} />
        ) : (
          <div />
        )}
      </div>
    );
  }
);

Map.defaultProps = {
  basemapStyle: 'light',
  layerPanelVariant: LayerPanelVariant.Inside,
  colorScheme: DEFAULT_COLOR_SCHEME,
};

const OutsideLayerPanel = (props: ConnectedLayerPanelProps) => (
  <div className={styles.outsideLayerPanel}>
    <LayerPanel {...props} />
  </div>
);

const InsideLayerPanel = (props: ConnectedLayerPanelProps) => (
  <div className={styles.insideLayerPanel}>
    <LayerPanel {...props} />
  </div>
);

export default Map;
