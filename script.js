$(document).ready(function() {
  // Width and Height of the whole visualization
  var w = 1000; 
  var h = 480;  
  var projection = d3.geo.equirectangular()
  var path = d3.geo.path()
    .projection(projection);
  var svg = d3.select('body')
    .append('svg')
    .attr('width', w)
    .attr('height', h)
  svg.append('rect')
    .attr('width', w)
    .attr('height', h)
    .attr('fill', 'white');

  var g = svg.append("g");
  d3.json('https://d3js.org/world-50m.v1.json', function(error, data) {
    if (error) console.error(error);
    g.append('path')
      .datum(topojson.feature(data, data.objects.countries))
      .attr('d', path);
    
    // zoom effect
    var zoom = d3.behavior.zoom()
      .on("zoom", function() {
        g.attr("transform", "translate(" +
          d3.event.translate.join(",") + ")scale(" + d3.event.scale + ")");
        g.selectAll("path")
          .attr("d", path.projection(projection));
      });
    svg.call(zoom);
    
    d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json', function(error, data) {
      if (error) 
        console.error(error);
      
      var locations = data.features;
      var hue = 0; //create the circles
      
      // we will pass our data (the TopoJSON) as an argument, then create SVG elements using a classic D3 append. Selecting all paths, the TopoJSON is bound in the data method. From here, we can perform work on each element.
      
      
      locations.map(function(d) {  
        hue += 0.36               
        d.color = 'hsl(' + hue + ', 100%, 50%)';
      });
      

      g.selectAll('circle')
        .data(locations)
        .enter()
        .append('circle') //show the circles
        .attr('cx', function(d) {
          if (d.geometry) {
            return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[0];
          }
        })
        .attr('cy', function(d) {
          if (d.geometry) {
            return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[1];
          }
        })
        .attr('r', function(d) {
          if (d.properties.mass) {
            return Math.pow(parseInt(d.properties.mass), 1 / 9);
          }
        })
        .style('fill', function(d) {
        //Use the Color Function to set the Fill Value for each circle
          return d.color;
        })
      
        .on('mouseover', function(d) {
          d3.select(this).style('fill', 'black'); 
          d3.select('#name').text(d.properties.name);
          d3.select('#nametype').text(d.properties.nametype);
          d3.select('#fall').text(d.properties.fall);
          d3.select('#mass').text(d.properties.mass);
          d3.select('#recclass').text(d.properties.recclass);
          d3.select('#reclat').text(d.properties.reclat);
          d3.select('#reclong').text(d.properties.reclong);
          d3.select('#year').text(d.properties.year);
          d3.select('#tooltip')
            .style('left', (d3.event.pageX + 20) + 'px')
            .style('top', (d3.event.pageY - 80) + 'px')
            .style('display', 'block')
            .style('opacity', 0.8)
        })
        //Add Event Listeners | mouseout
        .on('mouseout', function(d) { 
          d3.select(this).style('fill', d.color);
          d3.select('#tip')
            .style('display', 'none');
        });
    });
  });
});