import 'ol/ol.css';
import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import XYZ from 'ol/source/XYZ';
import View from 'ol/View';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';

import { Tile } from 'ol/layer';
import { Vector } from 'ol/layer';
import TileJSON from 'ol/source/TileJSON.js';
import VectorSource from 'ol/source/Vector.js';
import { Icon, Style, Stroke, Fill, Circle, Text } from 'ol/style';
import { PollutionService } from '../../services/pollution.service';
import { IGeoPoint } from '../models/geo-point.interface';
import { IMarker } from '../models/marker.interface';
import { IMarkerSettings } from '../models/marker-settings.interface';
import SourceOSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON.js';
import { defaults as defaultControls, ZoomToExtent } from 'ol/control';

import * as ol from 'ol';


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

  constructor(private service: PollutionService) {
    this.mapCenter = service.getMapCenter();
    this.markerSettings = {
      defaultIcon: 'assets/images/info.png',
      size: [32, 32]
    };
  }


  getFeature(marker: IMarker): Feature {
    const feature = new Feature({
      geometry: new Point(fromLonLat([marker.geo.longtitude, marker.geo.latitude])),
      name: marker.title
    });
    feature.setStyle(new Style({
      image: new Icon(({
        color: '#8959A8',
        crossOrigin: 'anonymous',
        src: this.markerSettings.defaultIcon,
        size: this.markerSettings.size
      }))
    }));
    return feature;
  }

  ngOnInit() {
    this.markers = this.service.getPoints();
    this.features = this.markers.map(m => this.getFeature(m));

    const vectorSource = new VectorSource({
      features: this.features
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
        if (feature.get('name') == 'Belarus') {
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
      layers: [this.layer, vectorLayer, strokeVector],
      view: this.view
    });

    navigator.geolocation.getCurrentPosition(pos => {
      const coords = fromLonLat([pos.coords.longitude, pos.coords.latitude]);
      this.map.getView().animate({ center: coords, zoom: 10 });
    });

  }
}
