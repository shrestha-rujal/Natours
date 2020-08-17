/* eslint-disable */

const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken = 'pk.eyJ1IjoicmF6b3IzODEiLCJhIjoiY2tkeWI5MDNhNGd5NjJ0cm9nemp5Ym1tYiJ9.PDG4UdbcJki78DdjI0H3kg';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/razor381/ckdybpz503is819rpzq5wvu0p',
  scrollZoom: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {

  const el = document.createElement('div');
  el.className = 'marker';

  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  new mapboxgl.Popup({
    offset: 30,
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  },
});
