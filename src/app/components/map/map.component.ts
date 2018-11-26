import { Component, OnInit } from '@angular/core';
import OlMap from 'ol/Map';
import OlXYZ from 'ol/source/XYZ';
import OlTileLayer from 'ol/layer/Tile';
import OlView from 'ol/View';
import OlFeature from 'ol/Feature';
import OlPoint from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';

import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import TileJSON from 'ol/source/TileJSON.js';
import VectorSource from 'ol/source/Vector.js';
import {Icon, Style} from 'ol/style.js';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  // Minsk
  latitude = 53.893009;
  longitude = 27.567444;

  marker = {
      title: 'Bobryisk',
      longtittude: 29.2213753,
      latitude: 53.1446069
    };

  map: OlMap;
  source: OlXYZ;
  layer: OlTileLayer;
  view: OlView;

  ngOnInit() {
    this.source = new OlXYZ({
      url: 'http://tile.osm.org/{z}/{x}/{y}.png'
    });

    this.layer = new OlTileLayer({
      source: this.source
    });

    this.view = new OlView({
      center: fromLonLat([this.longitude, this.latitude]),
      zoom: 8
    });

    const bobruisk = new OlFeature({
      geometry: new OlPoint(fromLonLat([this.marker.longtittude, this.marker.latitude]))
    });


    bobruisk.setStyle(new Style({
      image: new Icon(({
        color: '#8959A8',
        crossOrigin: 'anonymous',
        src: 'assets/images/info.png'
      }))
    }));

    const vectorSource = new VectorSource({
      features: [bobruisk]
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


    this.map = new OlMap({
      target: 'map',
      layers: [this.layer, vectorLayer],
      view: this.view
    });
  }
}
