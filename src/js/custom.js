$(document).on('ready', function() {
    var options = {
        'been': {
            'fill': 'yellow',
            'r': 3
        },
        'want': {
            'fill': '#68b04d',
            'r': 3
        },
        'fave': {
            'fill': '#ff0099',
            'r': 5
        },
        'errorClass': 'error',
        'successClass': 'success'
    },
        lastUrl = '',
        validateInput = function($url) {
            var $form = $url.closest('form'),
                url = $url.val(),
                isUrlValid = function(url) {
                    var re = new RegExp("^(http|https)://www.tripadvisor.[a-z]+/members/[a-z0-9]+", "i");
                    return re.test(url);
                };
            if (isUrlValid(url)) {
                $form.removeClass(options.errorClass).addClass(options.successClass);
                return true;
            } else {
                $url.focus();
                $form.addClass(options.errorClass).removeClass(options.successClass);
                return false;
            }
        },
        createGoogleStaticMap = function(googleStaticMap) {
            var src = 'http://maps.googleapis.com/maps/api/staticmap?&size=640x480&format=png32&sensor=false&scale=2&markers=',
                $googleStaticMap = $('#google-static-map');
            if (src.length + googleStaticMap.latlng.length < 2048) {
                src += googleStaticMap.latlng;
            } else if (src.length + googleStaticMap.latlngLowPrecision.length < 2048) {
                src += googleStaticMap.latlngLowPrecision;
            } else {
                return;
            }
            var $img = $('<img/>', {
                src: src,
                id: 'static-map'
            });
            // http://stackoverflow.com/questions/4278053/google-static-maps-url-length-limit
            $googleStaticMap.empty().append($img);
        };
    $('nav a').on('click', function(e) {
        var $a = $(this);
        $('#response').find('.tab').removeClass('show');
        $($a.attr('href')).addClass('show');
        e.preventDefault();
    });
    $('#url').on('blur', function() {
        var $url = $(this),
            url = $.trim($url.val());
        if (url === '') {
            return;
        }
        validateInput($url);
    });
    $('#form').on('submit', function(e) {
        var $form = $(this),
            data,
            $url = $form.find('#url'),
            url = $url.val(),
            $alert = $form.find('.pure-alert-error');
        e.preventDefault();
        if (url === lastUrl) {
            return;
        }
        if (!validateInput($url)) {
            return;
        }
        lastUrl = url;
        data = {
            'url': url
        };
        $.ajax({
            data: data,
            method: 'POST',
            dataType: 'json',
            /*headers: {
             "X-Test-Header": "xtest-value"
             },*/
            url: $form.attr('action')
        }).error(function(response) {
            $alert.show().text(response.responseJSON.message);
        }).success(function(response) {
            var $response = $('#response'),
                $thisIs = $response.find('#thisIs span'),
                $map = $response.find('#map'),
                markers,
                googleStaticMap = {
                    'latlng': '',
                    'country': '',
                    'latlngLowPrecision': ''
                },
                createRegions = function(array) {
                    var regions = {};
                    $.each(array, function(index, value) {
                        var iso = value['iso'];
                        if (typeof regions[iso] === 'undefined') {
                            regions[iso] = 1;
                        } else {
                            regions[iso]++;
                        }
                    });
                    return regions;
                },
                createMarker = function(array) {
                    var markers = [];
                    $.each(array, function(index, value) {
                        var marker = {
                            'style': options.been,
                            'latLng': [value.lat, value.lng],
                            'name': value.name
                        };
                        if ($.inArray('want', value.flags) !== -1) {
                            marker.style = options.want;
                        }
                        if ($.inArray('fave', value.flags) !== -1) {
                            marker.style = options.fave;
                        }
                        markers.push(marker);
                        googleStaticMap.latlng += '%7C' + value.lat + ',' + value.lng;
                        googleStaticMap.latlngLowPrecision += '%7C' + Math.round(value.lat * 100) / 100 + ',' + Math.round(value.lng * 100) / 100;
                        googleStaticMap.country += '%7C' + value.country;
                    });
                    return markers;
                };
            $alert.hide();
            $map.empty();
            $response.show();
            markers = createMarker(response.data.places);
            $map.vectorMap({
                map: 'world_mill_en',
                onMarkerLabelShow: function(event, label, index) {
                    $thisIs.text($(label).text());
                },
                normalizeFunction: 'polynomial',
                hoverOpacity: 0.7,
                zoomOnScroll: false,
                hoverColor: false,
                regionStyle: {
                    initial: {
                        fill: '#eee',
                        "fill-opacity": 1,
                        stroke: 'none',
                        "stroke-width": 0,
                        "stroke-opacity": 1
                    },
                    hover: {
                        fill: '#ccc'
                    }
                },
                series: {
                    regions: [{
                        values: createRegions(response.data.places),
                        scale: ['#C8EEFF', '#0071A4'],
                        normalizeFunction: 'polynomial'
                    }]
                },
                backgroundColor: '#fff',
                markers: markers
            });
            createGoogleStaticMap(googleStaticMap);
        });
    });
});