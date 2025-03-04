import React, { useEffect, useRef } from 'react';
import H from '@here/maps-api-for-javascript';

const Map = (props) => {
    const mapRef = useRef(null);
    const map = useRef(null);
    const platform = useRef(null);
    const { apikey, userPosition, selectedLocations } = props;

    useEffect(() => {
        if (!map.current) {
            // Initialize map
            platform.current = new H.service.Platform({ apikey });
            const defaultLayers = platform.current.createDefaultLayers({ pois: true });
            const newMap = new H.Map(
                mapRef.current,
                defaultLayers.vector.normal.map,
                {
                    zoom: 14,
                    center: userPosition, // Use dynamic user locations
                }
            );

            new H.mapevents.Behavior(new H.mapevents.MapEvents(newMap));
            H.ui.UI.createDefault(newMap, defaultLayers);
            map.current = newMap;
        }

        // Routes are calculated when the selected location changes
        if (selectedLocations.length > 0) {
            calculateRoute(
                platform.current,
                map.current,
                userPosition,
                selectedLocations
            );
        } else {
            // Clear all objects on the map
            map.current?.removeObjects(map.current.getObjects());
            // Add a default user location tag
            map.current?.addObject(
                new H.map.Marker(userPosition, {
                    icon: getMarkerIcon('red')
                })
            );
        }
    }, [apikey, userPosition, selectedLocations]);

    return <div style={{ width: '100%', height: '500px' }} ref={mapRef} />;
};

// Get tag icon
function getMarkerIcon(color) {
    const svgCircle = `<svg width="20" height="20" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g id="marker">
                <circle cx="10" cy="10" r="7" fill="${color}" stroke="${color}" stroke-width="4" />
                </g></svg>`;
    return new H.map.Icon(svgCircle, {
        anchor: { x: 10, y: 10 }
    });
}

// Calculation route
function calculateRoute(platform, map, start, waypoints) {
    const router = platform.getRoutingService(null, 8);

    // Define route parameters
    const routingParams = {
        origin: `${start.lat},${start.lng}`,
        destination: `${waypoints[waypoints.length - 1].lat},${waypoints[waypoints.length - 1].lng}`,
        transportMode: 'pedestrian',
        return: 'polyline'
    };

    // If there are multiple path points, add the via parameter
    if (waypoints.length > 1) {
        routingParams.via = waypoints
            .slice(0, -1) // Exclude the last point (end point)
            .map(point => `${point.lat},${point.lng}`)
            .join('!');
    }

    // Call routing service
    router.calculateRoute(routingParams, (response) => {
        const sections = response.routes[0].sections;
        const lineStrings = sections.map(section =>
            H.geo.LineString.fromFlexiblePolyline(section.polyline)
        );
        const multiLineString = new H.geo.MultiLineString(lineStrings);
        const bounds = multiLineString.getBoundingBox();

        // Create a route fold
        const routePolyline = new H.map.Polyline(multiLineString, {
            style: {
                lineWidth: 5,
                strokeColor: 'rgba(0, 128, 255, 0.7)'
            }
        });

        // Clear all objects on the map
        map.removeObjects(map.getObjects());

        // Add route folds
        map.addObject(routePolyline);

        // Add tag
        const markers = [
            new H.map.Marker(start, { icon: getMarkerIcon('red') }) // 用户位置
        ];
        waypoints.forEach((point, index) => {
            markers.push(
                new H.map.Marker(point, {
                    icon: getMarkerIcon(
                        index === waypoints.length - 1 ? 'green' : 'blue' // 终点绿色，途径点蓝色
                    )
                })
            );
        });

        // Add all tags to the map
        map.addObjects(markers);

        // Adjust the map perspective to include all marks and routes
        map.getViewModel().setLookAtData({ bounds });
    }, console.error);
}

export default Map;