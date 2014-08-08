/* global Tc */
(function($) {
    'use strict';
    Tc.Module.Response = Tc.Module.extend({
        onDataReceived: function(response) {
            var $ctx = this.$ctx.trigger('show'),
                config = this.sandbox.getConfig(),
                $map = $ctx.find('#jvectormap'),
                $thisIs = $ctx.find('.js-this-is__city'),
                jvectormapConfig = config.jvectormap;
            if (response.data.lang === 'en') {
                jvectormapConfig.series.regions[0].values = this.getRegions(response.data.places);
            }
            jvectormapConfig.markers = this.getMarker(response.data.places, config);
            jvectormapConfig.onViewportChange = function(event, number) {
                $map.attr('data-zoomlevel', Math.round(number));
            };
            jvectormapConfig.onMarkerLabelShow = function(event, label) {
                $thisIs.text($(label).text());
            };
            $map.empty().vectorMap(jvectormapConfig);
            this.setDownloadButton($ctx, response.csv);
            this.pushState(response);
        },
        pushState: function(response) {
            var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?url=' + response.url;
            if (window.history && window.history.pushState) {
                window.history.pushState('', '', newUrl);
            }
        },
        getMarker: function(array, config) {
            var markers = [];
            $.each(array, function(index, value) {
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
        getRegions: function(array) {
            var regions = {};
            $.each(array, function(index, value) {
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
        countCountries: function(list) {
            var coutryList = [];
            $.each(list, function(index, value) {
                if ($.inArray(value.country, coutryList) === -1) {
                    if ($.inArray('been', value.flags) !== -1) {
                        coutryList.push(value.country);
                    }
                }
            });
            return coutryList.length;
        },
        setDownloadButton: function($ctx, csv) {
            var path = '/data/' + csv.url,
                $a = $ctx.find('.js-download-bar__button').attr('href', path),
                $fileSize = $a.find('.js-filesize');
            $fileSize.text('(' + csv.filesize + ')');
        },
        on: function(callback) {
            var $ctx = this.$ctx,
                config = this.sandbox.getConfig();
            $ctx.on({
                'hide': function() {
                    $ctx.removeClass(config.classNames.block);
                    $ctx.addClass(config.classNames.isHidden);
                },
                'show': function() {
                    $ctx.removeClass(config.classNames.isHidden);
                    $ctx.addClass(config.classNames.block);
                }
            });
            callback();
        },
        onError: function() {
            this.$ctx.trigger('hide');
        }
    });
})(Tc.$);