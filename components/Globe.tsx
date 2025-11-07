import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Coordinates } from '../types';
import { PlusIcon, MinusIcon } from './icons';

// Declare D3 and TopoJSON types for TypeScript to avoid errors with global scripts
declare const d3: any;
declare const topojson: any;

interface GlobeProps {
  onSelectLocation: (coords: Coordinates) => void;
  isLoading: boolean;
}

const POINTS_OF_INTEREST = [
    // Cities
    { name: 'Tokyo', coords: [139.6917, 35.6895], type: 'city' },
    { name: 'Shanghai', coords: [121.4737, 31.2304], type: 'city' },
    { name: 'Mumbai', coords: [72.8777, 19.0760], type: 'city' },
    { name: 'Karachi', coords: [67.0099, 24.8615], type: 'city' },
    { name: 'Istanbul', coords: [28.9784, 41.0082], type: 'city' },
    { name: 'Manila', coords: [120.9842, 14.5995], type: 'city' },
    { name: 'Shenzhen', coords: [114.0579, 22.5431], type: 'city' },
    { name: 'Jakarta', coords: [106.8650, -6.1751], type: 'city' },
    { name: 'Ho Chi Minh City', coords: [106.6297, 10.8231], type: 'city' },
    { name: 'Bangkok', coords: [100.5018, 13.7563], type: 'city' },
    { name: 'Hong Kong', coords: [114.1694, 22.3193], type: 'city' },
    { name: 'Singapore', coords: [103.8198, 1.3521], type: 'city' },
    { name: 'Dubai', coords: [55.2708, 25.2048], type: 'city' },
    { name: 'Osaka', coords: [135.5023, 34.6937], type: 'city' },
    { name: 'London', coords: [-0.1278, 51.5074], type: 'city' },
    { name: 'Barcelona', coords: [2.1686, 41.3874], type: 'city' },
    { name: 'Lisbon', coords: [-9.1393, 38.7223], type: 'city' },
    { name: 'Athens', coords: [23.7275, 37.9838], type: 'city' },
    { name: 'Rome', coords: [12.4964, 41.9028], type: 'city' },
    { name: 'Copenhagen', coords: [12.5683, 55.6761], type: 'city' },
    { name: 'Dublin', coords: [-6.2603, 53.3498], type: 'city' },
    { name: 'New York', coords: [-74.0060, 40.7128], type: 'city' },
    { name: 'Los Angeles', coords: [-118.2437, 34.0522], type: 'city' },
    { name: 'Miami', coords: [-80.1918, 25.7617], type: 'city' },
    { name: 'Vancouver', coords: [-123.1207, 49.2827], type: 'city' },
    { name: 'Seattle', coords: [-122.3321, 47.6062], type: 'city' },
    { name: 'Houston', coords: [-95.3698, 29.7604], type: 'city' },
    { name: 'New Orleans', coords: [-90.0715, 29.9511], type: 'city' },
    { name: 'Boston', coords: [-71.0589, 42.3601], type: 'city' },
    { name: 'Havana', coords: [-82.3666, 23.1136], type: 'city' },
    { name: 'Buenos Aires', coords: [-58.3816, -34.6037], type: 'city' },
    { name: 'Rio de Janeiro', coords: [-43.1729, -22.9068], type: 'city' },
    { name: 'Lima', coords: [-77.0428, -12.0464], type: 'city' },
    { name: 'Cartagena', coords: [-75.4794, 10.3932], type: 'city' },
    { name: 'Lagos', coords: [3.3792, 6.5244], type: 'city' },
    { name: 'Alexandria', coords: [29.9245, 31.2058], type: 'city' },
    { name: 'Cape Town', coords: [18.4241, -33.9249], type: 'city' },
    { name: 'Casablanca', coords: [-7.5898, 33.5731], type: 'city' },
    { name: 'Dakar', coords: [-17.4677, 14.7167], type: 'city' },
    { name: 'Sydney', coords: [151.2093, -33.8688], type: 'city' },
    { name: 'Melbourne', coords: [144.9631, -37.8136], type: 'city' },
    { name: 'Auckland', coords: [174.7633, -36.8485], type: 'city' },
    { name: 'Perth', coords: [115.8605, -31.9505], type: 'city' },

    // Surf Spots
    { name: 'Pipeline', coords: [-158.0538, 21.6641], type: 'surf_spot' },
    { name: 'Teahupo\'o', coords: [-149.2667, -17.8500], type: 'surf_spot' },
    { name: 'Jeffreys Bay', coords: [24.9216, -34.0487], type: 'surf_spot' },
    { name: 'Uluwatu', coords: [115.0883, -8.8143], type: 'surf_spot' },
    { name: 'Bells Beach', coords: [144.2833, -38.3667], type: 'surf_spot' },
    { name: 'Trestles', coords: [-117.5936, 33.3853], type: 'surf_spot' },
    { name: 'Hossegor', coords: [-1.4333, 43.6667], type: 'surf_spot' },
    { name: 'Cloudbreak', coords: [177.2064, -17.8444], type: 'surf_spot' },
    { name: 'Mavericks', coords: [-122.5000, 37.4947], type: 'surf_spot' },
    { name: 'Snapper Rocks', coords: [153.5489, -28.1633], type: 'surf_spot' },
    { name: 'Margaret River', coords: [115.0750, -33.9550], type: 'surf_spot' },
    { name: 'Puerto Escondido', coords: [-97.0667, 15.8600], type: 'surf_spot' },
    { name: 'Raglan', coords: [174.8333, -37.8000], type: 'surf_spot' },
    { name: 'Nazaré', coords: [-9.0711, 39.6028], type: 'surf_spot' },
    { name: 'Mundaka', coords: [-2.7000, 43.4056], type: 'surf_spot' },
    { name: 'Chicama', coords: [-79.4500, -7.7000], type: 'surf_spot' },
    { name: 'Rincon', coords: [-67.2500, 18.3333], type: 'surf_spot' },
    { name: 'Santa Cruz', coords: [-122.0308, 36.9741], type: 'surf_spot' },
    { name: 'Tofino', coords: [-125.9083, 49.1528], type: 'surf_spot' },
    { name: 'Bundoran', coords: [-8.2798, 54.4789], type: 'surf_spot' },
    { name: 'Thurso East', coords: [-3.5222, 58.5956], type: 'surf_spot' },
    { name: 'Mentawai Islands', coords: [99.5667, -2.1583], type: 'surf_spot' },
    { name: 'G-Land', coords: [114.3333, -8.7167], type: 'surf_spot' },
    { name: 'Byron Bay', coords: [153.6125, -28.6431], type: 'surf_spot' },
    { name: 'Noosa Heads', coords: [153.0889, -26.3889], type: 'surf_spot' },
    { name: 'Punta de Lobos', coords: [-72.0167, -34.4000], type: 'surf_spot' },
    { name: 'Florianopolis', coords: [-48.5480, -27.5954], type: 'surf_spot' },
    { name: 'Taghazout', coords: [-9.7111, 30.5447], type: 'surf_spot' },
    { name: 'Arugam Bay', coords: [81.8319, 6.8481], type: 'surf_spot' },
    { name: 'Malibu', coords: [-118.7798, 34.0259], type: 'surf_spot' },
    { name: 'Huntington Beach', coords: [-117.9992, 33.6601], type: 'surf_spot' },
    { name: 'Cocoa Beach', coords: [-80.6076, 28.3200], type: 'surf_spot' },
    { name: 'Kill Devil Hills', coords: [-75.6696, 36.0299], type: 'surf_spot' },
    { name: 'Montauk', coords: [-71.9545, 41.0359], type: 'surf_spot' },
    { name: 'La Jolla', coords: [-117.2713, 32.8427], type: 'surf_spot' },
    { name: 'Hanalei Bay', coords: [-159.5050, 22.2186], type: 'surf_spot' },
    { name: 'Honolua Bay', coords: [-156.6389, 21.0142], type: 'surf_spot' },
    { name: 'Jaws (Peahi)', coords: [-156.2833, 20.9333], type: 'surf_spot' },
    { name: 'Salina Cruz', coords: [-95.2000, 16.1667], type: 'surf_spot' },
    { name: 'Pavones', coords: [-83.1333, 8.3833], type: 'surf_spot' },
    { name: 'Witch\'s Rock', coords: [-85.6333, 10.8167], type: 'surf_spot' },
    { name: 'La Libertad', coords: [-89.3167, 13.4833], type: 'surf_spot' },
    { name: 'Coxos', coords: [-9.4167, 39.0000], type: 'surf_spot' },
    { name: 'The Bubble', coords: [-13.8167, 28.7167], type: 'surf_spot' },
    { name: 'Skeleton Bay', coords: [14.8833, -25.8667], type: 'surf_spot' },
    { name: 'Newquay', coords: [-5.0833, 50.4137], type: 'surf_spot' },
    { name: 'Muizenberg', coords: [18.4667, -34.1083], type: 'surf_spot' },
    { name: 'Okinawa', coords: [127.6792, 26.2124], type: 'surf_spot' },
    { name: 'Siargao', coords: [126.1500, 9.7833], type: 'surf_spot' },
];

const Globe: React.FC<GlobeProps> = ({ onSelectLocation, isLoading }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const projectionRef = useRef<any>();
  const zoomBehaviorRef = useRef<any>();
  const [marker, setMarker] = useState<[number, number] | null>(null);

  const isVisible = useCallback((d: { coords: [number, number] }) => {
    if (!projectionRef.current) return false;
    const globeRotation = projectionRef.current.rotate();
    const p = {type: "Point", coordinates: d.coords};
    const gdistance = d3.geoDistance(p.coordinates, [-globeRotation[0], -globeRotation[1]]);
    return gdistance < Math.PI / 2;
  }, []);

  // Effect for initial globe setup
  useEffect(() => {
    if (!svgRef.current) return;

    const width = 600;
    const height = 600;
    const sensitivity = 75;
    const baseScale = 250;

    const projection = d3.geoOrthographic()
      .scale(baseScale)
      .center([0, 0])
      .rotate([10, -20, 0])
      .translate([width / 2, height / 2]);
    
    projectionRef.current = projection;

    const svg = d3.select(svgRef.current)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`);

    svg.selectAll('*').remove(); // Clear previous render artifacts

    const ocean = svg.append('circle')
      .attr('class', 'ocean')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', projection.scale())
      .attr('fill', '#1e3a8a')
      .attr('stroke', '#60a5fa')
      .attr('stroke-width', '1px');

    const path = d3.geoPath().projection(projection);

    const graticulePath = svg.append('path')
      .datum(d3.geoGraticule())
      .attr('class', 'graticule')
      .attr('d', path)
      .style('fill', 'none')
      .style('stroke', '#60a5fa')
      .style('stroke-opacity', 0.5)
      .style('stroke-width', '0.5px');

    const countriesGroup = svg.append('g').attr('class', 'countries-group');
    const labelsGroup = svg.append('g').attr('class', 'labels-group');
    const markerGroup = svg.append('g').attr('class', 'marker-group');

    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then((world: any) => {
      countriesGroup.selectAll('.country')
        .data(topojson.feature(world, world.objects.countries).features)
        .enter().append('path')
        .attr('class', 'country')
        .attr('d', path)
        .style('fill', '#15803d')
        .style('stroke', '#166534')
        .style('stroke-width', '0.5px');
    });

    labelsGroup.selectAll('.location-label')
        .data(POINTS_OF_INTEREST)
        .enter()
        .append('g')
        .attr('class', 'location-label')
        .each(function(d: any) {
            const group = d3.select(this);
            const isSurfSpot = d.type === 'surf_spot';
            const color = isSurfSpot ? '#fde047' : 'white';

            group.append('circle')
                .attr('r', isSurfSpot ? 2.5 : 2)
                .attr('fill', color);
            group.append('text')
                .attr('x', 5)
                .attr('dy', '.35em')
                .text(d.name)
                .style('fill', color)
                .style('font-size', isSurfSpot ? '11px' : '10px')
                .style('font-weight', isSurfSpot ? 'bold' : 'normal')
                .style('text-shadow', '0 1px 3px black');
        })
        .style('pointer-events', 'none');


    const updateMarker = () => {
        markerGroup.selectAll('.marker').remove();
        if (marker) {
            const markerCoords = projection(marker);
            if (markerCoords && isVisible({ coords: marker })) {
                const markerElement = markerGroup.append('g').attr('class', 'marker');

                markerElement.append('circle')
                    .attr('cx', markerCoords[0])
                    .attr('cy', markerCoords[1])
                    .attr('r', 5)
                    .attr('fill', '#fde047')
                    .attr('stroke', 'white')
                    .attr('stroke-width', 1.5)
                    .style('pointer-events', 'none')
                    .append('animate')
                    .attr('attributeName', 'r')
                    .attr('from', 5)
                    .attr('to', 10)
                    .attr('dur', '1.5s')
                    .attr('repeatCount', 'indefinite');
            }
        }
    };
    
    const updateLabels = () => {
        labelsGroup.selectAll('.location-label')
            .attr('transform', (d: any) => `translate(${projection(d.coords)})`)
            .style('display', (d: any) => isVisible({coords: d.coords}) ? 'block' : 'none');
    };

    const redraw = () => {
      ocean.attr('r', projection.scale());
      graticulePath.attr('d', path);
      countriesGroup.selectAll('.country').attr('d', path);
      updateMarker();
      updateLabels();
    }
    
    const drag = d3.drag()
      .filter((event: any) => !event.ctrlKey && !event.button && event.touches?.length <= 1)
      .on('drag', (event: any) => {
        if (isLoading) return;
        const rotate = projection.rotate();
        const k = sensitivity / projection.scale();
        projection.rotate([
          rotate[0] + event.dx * k,
          rotate[1] - event.dy * k,
          rotate[2]
        ]);
        redraw();
      });
      
    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', (event: any) => {
        // This handler is now only triggered by programmatic calls
        if (isLoading) return;
        projection.scale(baseScale * event.transform.k);
        redraw();
      });
    
    zoomBehaviorRef.current = zoom;
    
    const handleClick = (event: any) => {
        if(isLoading) return;
        const [x, y] = d3.pointer(event);
        const coords = projection.invert([x, y]);
        if (coords && coords[0] && coords[1]) {
            if (isVisible({ coords })) {
                setMarker(coords as [number, number]);
                onSelectLocation({ lat: coords[1], lon: coords[0] });
            }
        }
    };

    svg.call(drag);
    svg.call(zoom); // Initialize the zoom behavior
    svg.on('.zoom', null); // But disable user-initiated zoom gestures (pinch, scroll)
    svg.on('click', handleClick);
    svg.on('dblclick.zoom', null);
    
    redraw(); // Initial draw

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means this runs once on mount
  
  // Rerun marker logic only when marker state changes. Globe updates are handled by redraw.
  useEffect(() => {
    if (!svgRef.current || !projectionRef.current) return;
    const svg = d3.select(svgRef.current);
    const projection = projectionRef.current;
    
    const updateMarker = () => {
        svg.select('.marker-group').selectAll('.marker').remove();
        if (marker) {
            const markerCoords = projection(marker);
            if (markerCoords && isVisible({ coords: marker })) {
                const markerElement = svg.select('.marker-group').append('g').attr('class', 'marker');

                markerElement.append('circle')
                    .attr('cx', markerCoords[0])
                    .attr('cy', markerCoords[1])
                    .attr('r', 5)
                    .attr('fill', '#fde047')
                    .attr('stroke', 'white')
                    .attr('stroke-width', 1.5)
                    .style('pointer-events', 'none')
                    .append('animate')
                    .attr('attributeName', 'r')
                    .attr('from', 5)
                    .attr('to', 10)
                    .attr('dur', '1.5s')
                    .attr('repeatCount', 'indefinite');
            }
        }
    };
    updateMarker();
  }, [marker, isVisible]);

  const handleZoom = useCallback((scaleFactor: number) => {
    if (svgRef.current && zoomBehaviorRef.current) {
        d3.select(svgRef.current)
          .transition()
          .duration(250)
          .call(zoomBehaviorRef.current.scaleBy, scaleFactor);
    }
  }, []);

  return (
    <div className="relative w-full h-full">
      <svg 
        ref={svgRef} 
        style={{ 
          touchAction: 'none', 
          cursor: isLoading ? 'wait' : 'grab' 
        }}
        className="w-full h-full"
      ></svg>
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
        <button 
            onClick={() => handleZoom(1.3)} 
            aria-label="Zoom in"
            className="w-10 h-10 bg-blue-900/50 backdrop-blur-sm text-cyan-300 rounded-full flex items-center justify-center hover:bg-blue-800/70 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
            disabled={isLoading}
        >
            <PlusIcon className="w-6 h-6" />
        </button>
        <button 
            onClick={() => handleZoom(1 / 1.3)}
            aria-label="Zoom out"
            className="w-10 h-10 bg-blue-900/50 backdrop-blur-sm text-cyan-300 rounded-full flex items-center justify-center hover:bg-blue-800/70 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
            disabled={isLoading}
        >
            <MinusIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Globe;
