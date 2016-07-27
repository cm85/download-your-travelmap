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


    //SVG filter for the gooey effect
    //Code taken from http://tympanus.net/codrops/2015/03/10/creative-gooey-effects/
    var defs = layer.append("defs");
    var filter = defs.append("filter").attr("id","gooeyCodeFilter");
    filter.append("feGaussianBlur")
        .attr("in","SourceGraphic")
        .attr("stdDeviation","10")
        //to fix safari: http://stackoverflow.com/questions/24295043/svg-gaussian-blur-in-safari-unexpectedly-lightens-image
        .attr("color-interpolation-filters","sRGB")
        .attr("result","blur");
    filter.append("feColorMatrix")
        .attr("class", "blurValues")
        .attr("in","blur")
        .attr("mode","matrix")
        .attr("values","1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -5")
        .attr("result","gooey");
    filter.append("feBlend")
        .attr("in","SourceGraphic")
        .attr("in2","gooey")
        .attr("operator","atop");

    layer.selectAll(".xcities")
        .data(data)
        .enter().append("circle")
        .attr("class", "cities")
        .attr('cx', 10)
        .attr('cy', 10)
        .style("opacity", 1);

    function placeCities () {

        //Stop the force layout (in case you move backward)
       // force.stop();


        //Put the cities in their geo location
        d3.selectAll(".cities")
            .transition("move").duration(1000)
            .delay(function(d,i) { return i*20; })
            .attr("r", function(d) {
                return 5;
            })
            .attr('cx', function (datum) {
                return self.latLngToXY(datum.lat, datum.lng)[0];
            })
            .attr('cy', function (datum) {
                return self.latLngToXY(datum.lat, datum.lng)[1];
            })

        //Around the end of the transition above make the circles see-through a bit
        d3.selectAll(".cities")
            .transition("dim").duration(2000).delay(4000)
            .style("opacity", 0.8);

        //"Remove" gooey filter from cities during the transition
        //So at the end they do not appear to melt together anymore
        d3.selectAll(".blurValues")
            .transition().duration(4000)
            .attrTween("values", function() {
                return d3.interpolateString("1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -5",
                    "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 6 -5");
            });

    }
    console.log('place');
    placeCities();


});
datamap.pins(data.data.places);



$(document).ready(function () {
    'use strict';
    $('.submit').on('click touchend', function (e) {
        $(this).closest('.form').addClass('off');
        $('.loading-spinner').addClass('loading-spinner-visible');
        e.preventDefault();
    });
});

console.log('...');
