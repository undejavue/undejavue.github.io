import 'ol/ol.css';
import 'ol-popup/src/ol-popup.css';
import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import XYZ from 'ol/source/XYZ';
import View from 'ol/View';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import { fromLonLat } from 'ol/proj';

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
import { getPopupWindow } from '../../map-builder/overlay';


@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
    map: Map;
    source: XYZ;
    layer: Tile;
    view: View;
    mapCenter: IGeoPoint;
    markers: IMarker[];
    features: Feature[];
    markerSettings: IMarkerSettings;
    styleCache = {};
    distance = 90;
    clusterSource: any;
    clusters: any;
    belarusBounds = [23.13474, 51.23751, 32.80613, 56.20996 ];

    constructor(private service: PollutionService) {
        this.mapCenter = service.getMapCenter();
        this.markerSettings = {
            defaultIcon: 'assets/images/info.png',
            size: [42, 42]
        };
    }


    getFeature(marker: IMarker): Feature {

        const feature = new Feature({
            id: marker.id,
            geometry: new Point(fromLonLat([marker.geo.longtitude, marker.geo.latitude])),
            name: marker.title,
            address: marker.address,
            size: this.markerSettings.size
        });
        /*         feature.setStyle(new Style({
                    image: new Icon(({
                        color: '#8959A8',
                        crossOrigin: 'anonymous',
                        src: this.markerSettings.defaultIcon,
                        size: this.markerSettings.size
                    }))
                })); */
        return feature;
    }

    ngOnInit() {

        this.markers = this.service.getPoints();
        this.features = this.markers.map(m => this.getFeature(m));

        const vectorSource = new VectorSource({
            features: []
        });

        const vectorLayer = new Vector({
            source: vectorSource
        });

        const rasterLayer = new Tile({
            source: new TileJSON({
                url: 'https://api.tiles.mapbox.com/v3/mapbox.geography-class.json?secure',
                crossOrigin: ''
            })
        });

        // Belarus
        // vector layer
        const strokeVector = new Vector({
            source: new VectorSource({
                format: new GeoJSON(),
                url: './assets/data/geo.json'
            }),
            style: (feature, res) => {
                if (feature.get('name') === 'Belarus') {
                    return new Style({
                        stroke: new Stroke({
                            color: 'gray',
                            width: 4
                        })
                    });
                }
            }
        });

        // Create map
        this.source = new SourceOSM({
        });

        this.layer = new Tile({
            source: this.source
        });

        this.view = new View({
            center: fromLonLat([this.mapCenter.longtitude, this.mapCenter.latitude]),
            zoom: 8
        });

        const source = new VectorSource({
            features: this.features
        });

        this.clusterSource = new Cluster({
            distance: this.distance,
            source: source
        });

        /*         this.clusters = new Vector({
                    source: this.clusterSource,
                    style: (feature) => this.getStyle(feature)
                }); */

        this.clusters = new AnimatedCluster(
            {
                name: 'Cluster',
                source: this.clusterSource,
                animationDuration: 700, // $('#animatecluster').prop('checked') ? 700 : 0,
                // Cluster style
                style: (feature) => this.getStyle(feature)
            });

        this.map = new Map({

            controls: defaultControls().extend([
                new ZoomToExtent({
                    extent: [
                        813079.7791264898, 5929220.284081122,
                        848966.9639063801, 5936863.986909639
                    ]
                })
            ]),
            target: 'map',
            layers: [this.layer, vectorLayer, strokeVector, this.clusters],
            view: this.view
        });

        /*         navigator.geolocation.getCurrentPosition(pos => {
                    const coords = fromLonLat([pos.coords.longitude, pos.coords.latitude]);
                    this.map.getView().animate({ center: coords, zoom: 10 });
                }); */

        this.features.map(feature => vectorSource.addFeature(feature));
        // this.features.map(f => this.addAnimation(f));
        this.map.updateSize();

        const popup = new Popup({
            element: document.getElementById('popup'),
            autoPan: true,
            autoPanAnimation: {
            duration: 250
            }
        });
        this.map.addOverlay(popup);
        this.map.on('click', (evt) => {
            if (evt.dragging) {
                popup.hide();
                return;
            }
            this.displayFeatureInfo(this.map.getEventPixel(evt.originalEvent), popup, evt.coordinate);
        });
    }

    displayFeatureInfo(pixel, popup, coord) {
        const features = [];
        this.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
            features.push(feature);
        });

        if (features.length === 1) {
            popup.hide();
            const data = this.service.getFeatureValue(features);
            const html = getPopupWindow(data, this.service.getPopupOptions());
            popup.show(coord, html);
        } else {
            popup.hide();
        }
    }


/*     onDistance(e) {
        console.log('On Distance', e);
        this.distance = e;
        if (this.clusterSource && this.distance) {
            // this.clusterSource.setDistance(this.distance);
            // this.map.render();
        }
    } */

    getStyle(feature) {
        const size = feature.get('features').length;
        let style = this.styleCache[size];
        if (!style) {
            const color = size > 25 ? '192,0,0' : size > 8 ? '255,128,0' : '0,128,0';
            const radius = Math.max(8, Math.min(size * 0.75, 20));
            const d = 2 * Math.PI * radius / 6;
            const dash = [0, d, d, d, d, d, d];
            style = this.styleCache[size] = new Style(
                {
                    fillColor: '#ffff00',
                    strokeColor: '#3399ff',
                    pointRadius: 8,
                    strokeWidth: 5,
                    strokeOpacity: 0.5,
                    image: new Circle(
                        {
                            radius: radius,
                            stroke: new Stroke(
                                {
                                    color: 'rgba(' + color + ',0.5)',
                                    width: 15,
                                    lineDash: dash,
                                    lineCap: 'butt'
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
                        })
                });
        }
        return [style];
    }

    // animation
  /*   pointToProj(coordinates) {
        const lon = parseFloat(coordinates[0]);
        const lat = parseFloat(coordinates[1]);
        return transform([lon, lat], 'EPSG:4326', 'EPSG:3857');
    } */

    pulsatingCircleAnimation(coor) {
        const element = document.createElement('div');
        element.setAttribute('class', 'gps_ring');
        // const coorProjection = this.pointToProj(coor);
        return new Overlay({
            element: element,
            position: coor,
            positioning: 'center-center',
            offset: [0, 0]
        });
    }

    addAnimation(feature) {

        let coordinates;
        let overlay;
        coordinates = (<Point>feature.getGeometry()).getCoordinates();
        overlay = this.pulsatingCircleAnimation(coordinates);
        this.map.addOverlay(overlay);
    }

    
    /* animateLayer(layer) {
        let animationTween = new Tween();
        const begin = {
            x: 5
        };
        const end = {
            x: 20
        };
        const callbacks = {
            eachStep: Function.bind(animate, layer),
            done: () => {
                animationTween = new OpenLayers.Tween(easeInOut);
                begin.x = (begin.x === 20 ? 5 : 20);
                end.x = (end.x === 20 ? 5 : 20);
                animationTween.start(begin, end, 80, {
                    callbacks: callbacks
                });
            }
        };
        animationTween.start(begin, end, 80, {
            callbacks: callbacks
        });

        function animate(delta) {
            console.log(delta.x);
            for (let i = 0; i < this.features.length; i++) {
                this.features[i].style.strokeWidth = delta.x;
                this.features[i].style.pointRadius = delta.x;
            }
            this.redraw();
        }
    } */

}
