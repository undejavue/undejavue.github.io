import 'ol/ol.css';
import 'ol-popup/src/ol-popup.css';
import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import XYZ from 'ol/source/XYZ';
import View from 'ol/View';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';

import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import TileJSON from 'ol/source/TileJSON.js';
import VectorSource from 'ol/source/Vector.js';
import { Icon, Style } from 'ol/style.js';
import { PollutionService } from 'src/app/services/pollution.service';
import { IGeoPoint } from '../models/geo-point.interface';
import { IMarker } from '../models/marker.interface';
import { IMarkerSettings } from '../models/marker-settings.interface';
import Popup from 'ol-popup';
import { transform } from 'ol/proj';
import {toStringHDMS} from 'ol/coordinate';
import SourceOSM from 'ol/source/OSM';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  map: Map;
  source: XYZ;
  layer: TileLayer;
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
    }
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



    /*     var iconFeature1 = new Feature({
          geometry: new Point(fromLonLat([-0.1526069, 51.4790309]),),
          name: 'Somewhere',
        });
        
        var iconFeature2 = new Feature({
          geometry: new Point(fromLonLat([-0.1426069, 51.4840309])),
          name: 'Somewhere else'
        });
        
        // specific style for that one point
        iconFeature2.setStyle(new ol.style.Style({
          image: new ol.style.Icon({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Map_marker_font_awesome.svg/200px-Map_marker_font_awesome.svg.png',
          })
        })); */

    const vectorSource = new VectorSource({
      features: this.features
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource
    });

    const rasterLayer = new TileLayer({
      source: new TileJSON({
        url: 'https://api.tiles.mapbox.com/v3/mapbox.geography-class.json?secure',
        crossOrigin: ''
      })
    });


    // Create map
    this.source = new SourceOSM();

    this.layer = new TileLayer({
      source: this.source
    });

    this.view = new View({
      center: fromLonLat([this.mapCenter.longtitude, this.mapCenter.latitude]),
      zoom: 8
    });

    this.map = new Map({
      target: 'map',
      layers: [this.layer, vectorLayer],
      view: this.view
    });

/*     var popup = new Popup();
    this.map.addOverlay(popup);

    this.map.on('singleclick', function (evt) {
      var prettyCoord = toStringHDMS(transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'), 2);
      popup.show(evt.coordinate, '<div><h2>Coordinates</h2><p>' + prettyCoord + '</p></div>');
    }); */
  }
}
