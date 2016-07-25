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


datamap.addPlugin('pins', function(layer, data, options) {
    var self = this,
        fillData = this.options.fills,
        svg = this.svg;


    console.log(data);
    var bubbles = layer.selectAll('image.datamaps-pins').data(data, JSON.stringify);
// http://fiddle.jshell.net/duck0/kbqpfL1a/2/light/
    bubbles.enter()
        .append('image')
        .attr('class', 'datamaps-pinrrr')
        .attr('xlink:href', 'http://a.tiles.mapbox.com/v3/marker/pin-m+7e7e7e@2x.png')
        .attr('height', 40)
        .attr('width', 40)
        .attr('x', function(datum) {
            var latLng = self.latLngToXY(datum.lat, datum.lng);
            return latLng[0];
        })
        .attr('y', function(datum) {
            var latLng = self.latLngToXY(datum.lat, datum.lng);
            return latLng[1];

        });





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

console.log('xxx');
