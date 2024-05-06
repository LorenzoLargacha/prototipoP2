document.addEventListener('DOMContentLoaded', function() {
    var map = L.map('map').setView([40.410489, -3.676069], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    function onLocationFound(e) {
        var radius = e.accuracy / 2;
        L.marker(e.latlng).addTo(map)
            .bindPopup("Tu ubicacion").openPopup();
        L.circle(e.latlng, radius).addTo(map);

        var stores = [
            {name: "SuperCor", latLng: [40.409588, -3.677473]},
            {name: "Mercadona", latLng: [40.413308, -3.674529]},
            {name: "Carrefour", latLng: [40.414255, -3.677291]},
            {name: "Aldi", latLng: [40.409102, -3.674074]}
        ];

        var nearestStore = null;
        var shortestDistance = Infinity;

        stores.forEach(function(store) {
            var distance = map.distance(e.latlng, store.latLng);
            if (distance < shortestDistance) {
                shortestDistance = distance;
                nearestStore = store;
            }
        });

        // Crear marcadores para todos los supermercados
        stores.forEach(function(store) {
            L.marker(store.latLng, {
                icon: L.icon({
                    iconUrl: 
                        '../media/iconos/icono_tienda_naranja.png',
                    iconSize: [45, 45],
                    iconAnchor: [10, 40],
                    popupAnchor: [-3, -76]
                })
            }).addTo(map).bindPopup(store.name);
        });

        // Marcador dorado para el supermercado más cercano
        L.marker(nearestStore.latLng, {
            icon: L.icon({
                iconUrl: '../media/iconos/icono_tienda.png',
                iconSize: [45, 45],
                iconAnchor: [10, 40],
                popupAnchor: [-3, -76]
            })
        }).addTo(map).bindPopup(nearestStore.name + " - ¡Más cercano!");
    }

    function onLocationError(e) {
        alert(e.message);
    }

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);

    map.locate({setView: true, maxZoom: 16});
});
