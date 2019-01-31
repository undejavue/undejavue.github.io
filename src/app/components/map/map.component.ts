import 'ol/ol.css';
import 'ol-popup/src/ol-popup.css';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import Map from 'ol/Map';
import XYZ from 'ol/source/XYZ';
import View from 'ol/View';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import { fromLonLat, transformExtent } from 'ol/proj';

import { Tile } from 'ol/layer';
import { Vector } from 'ol/layer';
import TileJSON from 'ol/source/TileJSON.js';
import VectorSource from 'ol/source/Vector.js';
import { Style, Stroke, Fill, Circle, Text } from 'ol/style';
import { PollutionService } from '../../services/pollution.service';
import { IGeoPoint } from '../models/geo-point.interface';
import { IMarker } from '../models/marker.interface';
import { IMarkerSettings } from '../models/marker-settings.interface';
import SourceOSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON.js';
import { defaults as defaultControls, ZoomToExtent } from 'ol/control';
import { Cluster } from 'ol/source';
import { unByKey } from 'ol/Observable.js';
import { easeOut } from 'ol/easing.js';
import Overlay from 'ol/Overlay.js';
import AnimatedCluster from 'ol-ext/layer/AnimatedCluster';
import ConvexHull from 'ol-ext/geom/ConvexHull';
import { SelectCluster } from 'ol/interaction.js';
import * as $ from 'jquery';
import { toStringHDMS } from 'ol/coordinate.js';
import TileLayer from 'ol/layer/Tile.js';
import { toLonLat } from 'ol/proj.js';
import Popup from 'ol-popup';
import { IPollutionModel } from '../models/pollution.interface';
import { IFeatureValue } from '../models/feature-value.interface';
import { getPopupWindow } from '../../overlays/overlay';
import { ConfigService } from '../../services/config.service';
import { IMapOptions } from '../models/map-options.interface';
import Crop from 'ol-ext/filter/Crop';
import Mask from 'ol-ext/filter/Mask';
import { Control } from 'ol/control';
import Select from 'ol/interaction/Select';
import { click, pointerMove, altKeyOnly } from 'ol/events/condition.js';
import { CurrentValuesDto } from '../../api/contracts/current-values/current-values.dto';
import { MapHelperService } from '../../../app/services/map.helper.service';
import { IDataModelItem } from '../models/data-model-item.interface';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../base-component';
import { GetCurrentValuesAction } from '../../store/pollutions/actions';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent extends BaseComponent implements OnInit {
    @Output() featureClick: EventEmitter<any> = new EventEmitter();
    @Input() markers: IMarker[];
    @Input() data: { [objectId: string]: CurrentValuesDto; };

    map: Map;
    source: XYZ;
    mapCenter: IGeoPoint;
    features: Feature[];
    featureSize = {
        hover: 18,
        default: 14
    };

    styleCache = {};
    distance = 90;
    mapOptions: IMapOptions;

    withCountryBorder: boolean;
    countryName: string;
    countryGeoJson: string;
    isSpinner: boolean;

    realObjects: IDataModelItem[];

    constructor(private service: MapHelperService,
        private configService: ConfigService,
        private pollutionService: PollutionService,
        private store: Store<AppState>) {
            super(configService);
            this.mapOptions = this.configService.get('mapOptions') as IMapOptions;
            this.mapCenter = this.mapOptions.center;
            this.countryName = this.mapOptions.country.name;
            this.withCountryBorder = this.mapOptions.country.withBorder;
            this.countryGeoJson = './assets/data/' + this.mapOptions.country.geoJson;
    }

    ngOnInit() {
        this.pollutionService.init(this.service.getParametres(), this.service.getDefaults());
        const layer = this.createMap(this.withCountryBorder);
        this.addFeatures(layer);
        this.addOverlays();
        this.addIteractions();
        // this.navigate();

        this.store.select(s => s.config.dataModel)
        .pipe(takeUntil(this.destroy))
        .subscribe(state => {
            if (state && !state.loading) {
                this.realObjects = state.items;
            }
        });
    }

    getObjectItem(objectId: string) {
        if (this.realObjects && this.realObjects.length > 0) {
            const found =  this.realObjects.find(x => x.id === objectId);
            if (found) { return found; }
        }
    }

    createMap(withBorder: boolean) {
        const vectorSource = new VectorSource({
            features: []
        });

        // Create map
        const baseLayer = new Tile({
            source: new SourceOSM()
        });

        const view = new View({
            extent: this.transform(this.mapOptions.bounds),
            center: fromLonLat([this.mapCenter.longtitude, this.mapCenter.latitude]),
            zoom: this.mapOptions.zoom,
            minZoom: 7
        });

        const clusterSource = new Cluster({
            distance: this.distance,
            source: vectorSource
        });

        const clusters = new AnimatedCluster(
            {
                name: 'Cluster',
                source: clusterSource,
                animationDuration: 700, // $('#animatecluster').prop('checked') ? 700 : 0,
                style: (feature) => this.getStyle(feature)
            });

        const layers = [baseLayer, clusters];

        if (withBorder) {
            layers.push(this.getCountryBorderVector());
        }
        this.map = new Map({
            /* controls: defaultControls().extend([
                new ZoomToExtent({
                    extent: this.transform(this.mapOptions.bounds)
                })
            ]), */
            controls: [],
            target: 'map',
            layers,
            view
        });

        return vectorSource;
    }

    addFeatures(vectorSource) {
        // this.markers = this.service.getPoints();
        if (this.markers) {
            this.features = this.markers.map(m => this.getFeature(m));
            this.features.map(feature => vectorSource.addFeature(feature));
            this.map.updateSize();
        }

    }

    addOverlays() {

        // Popoup overlay onClick
        const popup = new Popup({
            element: document.getElementById('popup'),
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        });

        this.map.addOverlay(popup);

        const loadingPopup = new Popup({
            element: document.getElementById('loading-popup'),
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        });

        this.map.addOverlay(loadingPopup);

        this.map.on('click', (evt) => {
            if (evt.dragging) {
                popup.hide();
                return;
            }
            this.displayFeatureInfo(this.map.getEventPixel(evt.originalEvent), popup, evt.coordinate, loadingPopup);
        });

        this.map.on('pointermove', (e) => {
            if (e.dragging) {
                return;
            }
            const pixel = this.map.getEventPixel(e.originalEvent);
            const hit = this.map.hasFeatureAtPixel(pixel);
            this.map.getViewport().style.cursor = hit ? 'pointer' : '';
        });
    }

    addIteractions() {
        const select = new Select({
            condition: pointerMove,
            style: (feature) => this.getStyle(feature, true)
        });

        if (select !== null) {
            this.map.addInteraction(select);
            select.on('select', (e) => {
                if (e.selected.length > 0) {
                    if (e.selected[0].get('name') !== this.countryName) {
                        return;
                    }
                }
            });
        }
    }

    getCountryBorderVector() {
        // Belarus border
        const belarusSource = new VectorSource({
            format: new GeoJSON(),
            url: this.countryGeoJson
        });
        const strokeVector = new Vector({
            source: belarusSource,
            style: (feature, res) => {
                if (feature.get('name') === this.countryName) {
                    return new Style({
                        stroke: new Stroke({
                            color: 'gray',
                            width: 4
                        })
                    });
                } else {
                    return new Style({
                        fillColor: '#ffff00',
                    });
                }
            }
        });

        return strokeVector;
    }


    getFeature(marker: IMarker): Feature {
        const feature = new Feature({
            id: marker.id,
            geometry: new Point(fromLonLat([marker.geo.longtitude, marker.geo.latitude])),
            name: marker.title,
            address: marker.address,
            connectedToApi: marker.connectedToApi
        });
        return feature;
    }

    displayFeatureInfo(pixel, popup, coords, loading) {
        const features = [];
        this.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
            feature.set('state', 'selected');
            features.push(feature);
        });
        if (features.length > 1
            || (features.length === 1 && features[0].get('features').length > 1)) {
            this.map.setView(new View({
                center: coords,
                zoom: this.map.getView().getZoom() + 3
            }));
        } else if (features.length === 1) {
            popup.hide();
            loading.hide();
            const html = '<div style="margin: 8px">Loading&#8230;</div>';
            loading.show(coords, html);
            this.getFeatureInfo(features, popup, coords, loading);
        } else {
            popup.hide();
        }
    }

    getFeatureInfo(features, popup, coords, loading) {
        const f = features[0].get('features')[0];
        const id = f.get('id');
        const result = this.getObjectItem(id);
        this.store.dispatch(new GetCurrentValuesAction(id));

        const subscr = this.store.select(state => state.pollutions.data)
            .pipe()
            .subscribe(s => {
                if (s) {
                    this.isSpinner = s.loading;
                    if (!s.loading && s.byId) {
                        loading.hide();
                        const byId = s.byId[id];
                        if (byId) {
                            console.log('Fixture Values: ', byId);
                            this.pollutionService.mapValuesDtoToModel(byId, result);
                            const html = getPopupWindow(result, this.service.getPopupOptions());
                            popup.show(coords, html);
                            if (subscr) { subscr.unsubscribe(); }
                        }
                    }
                }
            });
    }

    // --- Style for feature
    getStyle(feature: any, isHover = false) {
        if (!feature.get('features')) { return; }
        const r = isHover ? this.featureSize.hover : this.featureSize.default;
        const features = feature.get('features');
        const size = features.length;
        const f = features[0];
        const isReal = f.get('connectedToApi');
        const radius = Math.max(r, Math.min(size * 0.75, 20));
        let style = this.styleCache[r];
        if (!style) {
            const color = size > 2 ? '116,116,116' : isReal ? '103,208,0' : '168,168,168';

            const d = 2 * Math.PI * radius / 6;
            const dash = [0, d, d, d, d, d, d];
            style = this.styleCache[size] = new Style(
                {
                    image: new Circle(
                        {
                            radius: radius,
                            stroke: new Stroke(
                                {
                                    color: 'rgba(' + color + ',0.4)',
                                    width: 10,
                                    // lineDash: dash,
                                    // lineCap: 'butt'
                                }),
                            fill: new Fill(
                                {
                                    color: 'rgba(' + color + ',1)'
                                })
                        }),
                    text: new Text(
                        {
                            text: this.service.calcAggregatedValue(feature.get('features')),
                            fill: new Fill(
                                {
                                    color: '#fff'
                                })
                        }),
                    zIndex: 1
                });
        }
        /* const shadow = new Style({
            stroke: new Stroke({
                color: 'rgba(0,0,0,1)',
                width: radius + 20
            }),
            zIndex: 2
        }); */
        return [style];
    }

    transform(extent) {
        return transformExtent(extent, 'EPSG:4326', 'EPSG:3857');
    }

    navigate() {
        navigator.geolocation.getCurrentPosition(pos => {
            const coords = fromLonLat([pos.coords.longitude, pos.coords.latitude]);
            this.map.getView().animate({ center: coords, zoom: 10 });
        });
    }
}
