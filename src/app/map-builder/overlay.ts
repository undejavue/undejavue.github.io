
import 'ol-popup/src/ol-popup.css';
import Overlay from 'ol/Overlay.js';
import { toStringHDMS } from 'ol/coordinate.js';
import { toLonLat } from 'ol/proj.js';
import * as $ from 'jquery';
import Popup from 'ol-popup';
import { transform } from 'ol/proj';

export const addOverlay = (map) => {
    /* const popup = new Overlay({
        element: document.getElementById('popup')
    });
    map.addOverlay(popup);

    map.on('click', (evt) => {
        const element = popup.getElement();
        const coordinate = evt.coordinate;
        const hdms = toStringHDMS(toLonLat(coordinate));

        $(element).popover('destroy');
        popup.setPosition(coordinate);
        ($(element) as any).popover({
            placement: 'top',
            animation: false,
            html: true,
            content: '<p>The location you clicked was:</p><code>' + hdms + '</code>'
        });
        ($(element) as any).popover('show');
    }); */


    const popup = new Popup({
        element: document.getElementById('popup')
    });
    map.addOverlay(popup);

    map.on('singleclick', function (evt) {
        const prettyCoord = toStringHDMS(transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'), 2);
        popup.show(evt.coordinate, '<div><h2>Coordinates</h2><p>' + prettyCoord + '</p></div>');
    });
};
