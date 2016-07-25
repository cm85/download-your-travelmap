/*global require, module, window, jQuery, document */
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
        $('body').addClass('map');
    },
    responsive: true,

    fills: {
        defaultFill: '#ABDDA4',
        'been': '#000000',
        authorHasTraveledTo: '#fa0fa0'
    }});
console.log(data.data.places[0]);
datamap.bubbles(data.data.places.map(function (el) {
    // console.log()
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
        e.preventDefault();
    });
});
