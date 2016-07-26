/*global require, document */
var $ = require('jquery'),
    data = require('json!./../../../data.json'),
    Datamap = require('datamaps');



var datamap = new Datamap({element: $('.datamap')[0],
    geographyConfig: {
        popupOnHover: false,
        hideAntarctica: false,
        highlightOnHover: false
    },
    done: function() {
        'use strict';
        $('body').addClass('map');
    },
    responsive: true,

    fills: {
        defaultFill: '#ABDDA4',
        'been': '#000000',
        authorHasTraveledTo: '#fa0fa0'
    }});
console.log(data.data.places[0]);

datamap.addPlugin('pins', function ( layer, data ) {
    // hold this in a closure
    var self = this;
// https://css-tricks.com/gooey-effect/
    // a class you'll add to the DOM elements
    var className = 'bigCircles';
// http://bl.ocks.org/nbremer/8df57868090f11e59175804e2062b2aa
    // make a D3 selection.
    var bubbles = layer
        .selectAll(className)
        .data(data, JSON.stringify);

    bubbles
        .enter()
        .append('image')
        .attr('xlink:href', 'http://a.tiles.mapbox.com/v3/marker/pin-m+7e7e7e@2x.png')
        .attr('class', className) //remember to set the class name
        .attr('height', 40)
        .attr('width', 40)
        .attr('x', function (datum) {
            return self.latLngToXY(datum.lat, datum.lng)[0]-20;
        })
        .attr('y', function (datum) {
            return self.latLngToXY(datum.lat, datum.lng)[1]-20;
        })
        .attr('r', 10);

});
datamap.pins(data.data.places);

datamap.bubbles(data.data.places.map(function (el) {
    // console.log()
    'use strict';
    return {
        'name': el.name,
        //   fillKey: el.been,
        'radius': 4,

        'latitude': el.lat,
        'longitude': el.lng

    };


}));

$(document).ready(function () {
    'use strict';
    $('.submit').on('click touchend', function (e) {
        $(this).closest('.form').addClass('off');
        $('.loading-spinner').addClass('loading-spinner-visible');
        e.preventDefault();
    });
});

console.log('...');
