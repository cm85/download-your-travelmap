/*global require, module, window, jQuery, document */
var config = require('../config'),
    data = require('json!../../../../data.json'),
    Datamap = require('datamaps');

module.exports = (function (window, document, $, config, Datamap) {
    'use strict';
    var setUsername = function ($ctx, username) {
            $ctx.find('.js-username').text(username);
        },
        setCsvDownloadButton = function ($ctx, csv) {
            $ctx.find('.js-download-bar__button__csv').attr('href', csv);

        },
        hideMap = function ($ctx) {

            $ctx.removeClass(config.classNames.block);
            $ctx.addClass(config.classNames.isHidden);
        },
        showMap = function ($ctx) {
            $ctx.removeClass(config.classNames.isHidden);
            $ctx.addClass(config.classNames.block);
        },
        getMarker = function (array, config) {
            var markers = [];
            $.each(array, function (index, value) {
                var marker = {
                    'style': config.been,
                    'latLng': [value.lat, value.lng],
                    'name': value.name
                };
                if ($.inArray('want', value.flags) !== -1) {
                    marker.style = config.want;
                }
                if ($.inArray('fave', value.flags) !== -1) {
                    marker.style = config.fave;
                }
                markers.push(marker);
            });
            return markers;
        },
        getRegions = function (array) {
            var regions = {};
            $.each(array, function (index, value) {
                var iso = value.iso;
                if (iso === '') {
                    return;
                }
                if (typeof regions[iso] === 'undefined') {
                    regions[iso] = 1;
                } else {
                    regions[iso]++;
                }
            });
            return regions;
        },
    /*countCountries = function (list) {
     var coutryList = [];
     $.each(list, function (index, value) {
     if ($.inArray(value.country, coutryList) === -1) {
     if ($.inArray('been', value.flags) !== -1) {
     coutryList.push(value.country);
     }
     }
     });
     return coutryList.length;
     },*/
        pushState = function (url) {
            var newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?url=' + url;
            if (window.history && window.history.pushState) {
                window.history.pushState('', '', newUrl);
            }
        },
        setAvatar = function (src) {
            $('.js-avatar').attr('src', src).removeClass(config.classNames.fadedout)

        },
        setStats = function ($ctx, stats) {
            var $bar = $ctx.find('.js-stats-bar');
            $bar.find('.country').text(stats.country);
            $bar.find('.city').text(stats.city);
            $bar.find('.percent').text((stats.country / 193 * 100).toFixed(2) + '%');
        },
        setKmlDownloadButton = function ($ctx, kml) {
            $ctx.find('.js-download-bar__button__kml').attr('href', kml);
        };
    return {
        hideMap: hideMap,
        showResponse: function (response) {


        }
    };
}(window, document, jQuery, config, Datamap));

var datamap = new Datamap({element: $('.datamap')[0],
    geographyConfig: {
        popupOnHover: false,
        hideAntarctica: false,
        highlightOnHover: false
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