/* $Id: highlight.js,v 1.0 2009/05/09 19:12:12 srobert72 Exp $ */\
\
/**\
 * @file\
 * Common marker highlighting routines.\
 */\
\
/*global $, Drupal */\
\
/**\
 * Highlights marker on rollover.\
 * Removes highlight on previous marker.\
 *\
 * Creates a "circle" using 20-sided GPolygon at the given point\
 * Circle polygon object is global variable as there is only one highlighted marker at a time\
 * and we want to remove the previously placed polygon before placing a new one.\
 * \
 * Original code "Google Maps JavaScript API Example"\
 */\
var highlightCircle;\
highlightCurrentMarker = function (map, currentMarker) \{\
  var markerPoint = currentMarker.marker.getPoint();\
\
  var polyPoints = Array();\
\
  if (highlightCircle) \{\
    map.removeOverlay(highlightCircle);\
  \}\
\
  var mapNormalProj = G_NORMAL_MAP.getProjection();\
  var mapZoom = map.getZoom();\
  var clickedPixel = mapNormalProj.fromLatLngToPixel(markerPoint, mapZoom);\
\
  var polySmallRadius = 20;\
\
  var polyNumSides = 20;\
  var polySideLength = 18;\
\
  for (var a = 0; a<(polyNumSides+1); a++) \{\
    var aRad = polySideLength*a*(Math.PI/180);\
    var polyRadius = polySmallRadius; \
	var pixelX = clickedPixel.x + polyRadius * Math.cos(aRad);\
    var pixelY = clickedPixel.y + polyRadius * Math.sin(aRad);\
    var polyPixel = new GPoint(pixelX,pixelY);\
    var polyPoint = mapNormalProj.fromPixelToLatLng(polyPixel,mapZoom);\
    polyPoints.push(polyPoint);\
  \}\
  // Using GPolygon(points,  strokeColor?,  strokeWeight?,  strokeOpacity?,  fillColor?,  fillOpacity?)\
  highlightCircle = new GPolygon(polyPoints,"#000000",2,0.0,"#FF0000",.5);\
  map.addOverlay(highlightCircle);\
\};\