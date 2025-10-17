// ========================================
// STORES/MAP PAGE JAVASCRIPT
// ========================================

(function () {
  "use strict";

  // Store data
  const STORES = [
    {
      id: 1,
      name: "Abissnet Tiranë - Blloku",
      city: "Tiranë",
      address: "Rr. Ismail Qemali 23",
      phone: "04 22 22 222",
      lat: 41.320531,
      lng: 19.816811,
      hours: "Hën–Sht: 09:00–19:00",
      gmaps: "https://www.google.com/maps/search/?api=1&query=Abissnet+Store+Blloku+Tirana",
    },
    {
      id: 2,
      name: "Abissnet Store Ali Demi ",
      city: "Tiranë",
      address: "Rr. Taulantia 5",
      phone: "052 22 22 22",
      lat: 41.328012,
      lng:  19.830976,
      hours: "Hën–Sht: 09:00–18:00",
      gmaps: "https://www.google.com/maps/search/?api=1&query=Abissnet+Store+Ali+Demi+Tirana",
    },
    {
      id: 3,
      name: "Abissnet Store, Rr. e Durrësit – Abissnet Store Rr. e Durrësit ",
      city: "Tiranë",
      address: "Rr. e Durrësit",
      phone: "022 22 22 22",
      lat: 41.330308603515824, 
      lng: 19.812880701458695,
      hours: "Hën–Sht: 09:00–17:30",
      gmaps: "https://www.google.com/maps/search/?api=1&query=Abissnet+Store+Rr.+e+Durr%C3%ABsit+Tirana",
    },
    {
      id: 4,
      name: "Abissnet Store Rr. Bardhy",
      city: "Tirane",
      address: "Rr. Bardhy",
      phone: "033 22 22 22",
      lat: 41.33725498406984, 
      lng: 19.831328657671193,
      hours: "Hën–Sht: 09:00–18:00",
      gmaps: "https://www.google.com/maps/search/?api=1&query=Abissnet+Store+Rr.+Bardhyl+Tirana",
    },
    {
      id: 5,
      name: "Abissnet Store Ish Fusha e Aviacionit",
      city: "Tiranë",
      address: "Ish Fusha e Aviacionit",
      phone: "054 22 22 22",
      lat: 41.33328259364982, 
      lng: 19.792153013493206,
      hours: "Hën–Sht: 09:00–18:00",
      gmaps: "https://www.google.com/maps/search/?api=1&query=Abissnet+Store+Ish+Fusha+e+Aviacionit+Tirana",
    },
    {
      id: 6,
      name: "Abissnet Store Astir",
      city: "Tiranë",
      address: "Rr. Tom Plezha",
      phone: "034 22 22 22",
      lat: 41.32991909717214, 
      lng: 19.78279594135415,
      hours: "Hën–Sht: 09:00–18:00",
      gmaps: "https://www.google.com/maps/search/?api=1&query=Abissnet+Store+Astir+Tirana",
    },
    {
      id: 7,
      name: "Abissnet Store Fresku",
      city: "Tiranë",
      address: "Rr. Sotir Caci",
      phone: "082 22 22 22",
      lat: 41.346228823716565, 
      lng: 19.854263689332026,
      hours: "Hën–Sht: 09:00–17:30",
      gmaps: "https://www.google.com/maps/search/?api=1&query=Abissnet+Store+Fresku+Tirana",
    },
    {
      id: 8,
      name: "Abissnet Store Kombinati",
      city: "Tiranë",
      address: "Rr. Llazi Miho",
      phone: "084 22 22 22",
      lat: 41.31600834023125, 
      lng: 19.77168797903783,
      hours: "Hën–Sht: 09:00–17:00",
      gmaps: "https://www.google.com/maps/search/?api=1&query=Abissnet+Store+Kombinati+Tirana",
    },
  
  
   {
      id: 9,
      name: "Abissnet Store Bathore",
      city: "Tiranë",
      address: "Rr. Demokracia",
      phone: "084 22 22 22",
      lat: 41.374309128897515,
      lng: 19.7860690682386,
      hours: "Hën–Sht: 09:00–17:00",
      gmaps: "https://www.google.com/maps/search/?api=1&query=Abissnet+Store+Bathore",
    },
  

    {
      id: 10,
      name: "Abissnet Store Bathore",
      city: "Tiranë",
      address: "Rr. Demokracia",
      phone: "084 22 22 22",
      lat: 41.374309128897515,
      lng: 19.7860690682386,
      hours: "Hën–Sht: 09:00–17:00",
      gmaps: "https://www.google.com/maps/search/?api=1&query=Abissnet+Store+Bathore",
    },
  
  
  
  
  
  
  
  
  {
      id: 11,
      name: "Abissnet Store Kamëz",
      city: "Tiranë",
      address: "Bulevardi Blu",
      phone: "084 22 22 22",
      lat: 41.38015348115802, 
      lng: 19.7626284288356,
      hours: "Hën–Sht: 09:00–17:00",
      gmaps: "https://www.google.com/maps/search/?api=1&query=Abissnet+Store+Kam%C3%ABz",
    },
  
  
  
  {
      id: 12,
      name: "Abissnet Store Golem",
      city: "Durrës",
      address: "Golem",
      phone: "084 22 22 22",
      lat: 41.24735908205619, 
      lng: 19.524157782791924,
      hours: "Hën–Sht: 09:00–17:00",
      gmaps: "https://www.google.com/maps/search/?api=1&query=Abissnet+Store+Golem",
    },
  
  {
      id: 13,
      name: "Abissnet Store Kavajë",
      city: "Kavajë",
      address: "Bulevardi Indrit Cara",
      phone: "084 22 22 22",
      lat: 41.1834728604109, 
      lng: 19.562188557804042,
      hours: "Hën–Sht: 09:00–17:00",
      gmaps: "https://www.google.com/maps/search/?api=1&query=Abissnet+Store+Kavaj%C3%AB",
    },
  
  
  
  {
      id: 14,
      name: "Abissnet Store Durrës Plazh",
      city: "Durrës",
      address: "Rr. Pavarsia",
      phone: "084 22 22 22",
      lat: 41.312708801893095, 
      lng: 19.480158853972842,
      hours: "Hën–Sht: 09:00–17:00",
      gmaps: "https://www.google.com/maps/search/?api=1&query=Abissnet+Store+Durr%C3%ABs+Plazh",
    },
  
  
   {
      id: 14,
      name: "Abissnet Store Durrës",
      city: "Durrës",
      address: "Rr.Andon Naci", 
      phone: "084 22 22 22",
      lat: 41.32005061888263, 
      lng: 19.445336025573223,
      hours: "Hën–Sht: 09:00–17:00",
      gmaps: "https://www.google.com/maps/search/?api=1&query=Abissnet+Store+Durr%C3%ABs",
    },
  
  
  {
      id: 15,
      name: "Abissnet Store Elbasan",
      city: "Elbasan",
      address: "Rr. 11 Nëntori", 
      phone: "084 22 22 22",
      lat: 41.1124049479801,
      lng: 20.085314072578722,
      hours: "Hën–Sht: 09:00–17:00",
      gmaps: "https://www.google.com/maps/search/?api=1&query=Abissnet+Store+Elbasan",
    },
    
    {
      id: 16,
      name: "Abissnet Store Fier",
      city: "Fier",
      address: "Rr. Jakov Xoxa", 
      phone: "084 22 22 22",
      lat: 40.73929092228272, 
      lng: 19.563676924224666,
      hours: "Hën–Sht: 09:00–17:00",
      gmaps: "https://www.google.com/maps/search/?api=1&query=Abissnet+Store+Fier",
    },
  
  
   {
      id: 17,
      name: "Abissnet Store Shkodër",
      city: "Shkodër",
      address: "Rr. Hafiz Sabri Bushati", 
      phone: "084 22 22 22",
      lat: 42.093254701628574, 
      lng: 19.498157475381078,
      hours: "Hën–Sht: 09:00–17:00",
      gmaps: "https://www.google.com/maps/search/?api=1&query=Abissnet+Store+Shkod%C3%ABr",
    },
    
    {
      id: 17,
      name: "Abissnet Store Korçë",
      city: "Korçë",
      address: "Rr. Nuci Gogo", 
      phone: "084 22 22 22",
      lat: 40.63827509092785, 
      lng: 20.786914830464095,
      hours: "Hën–Sht: 09:00–17:00",
      gmaps: "https://www.google.com/maps/search/?api=1&query=Abissnet+Store+Kor%C3%A7%C3%AB",
    },
  
  
  
  ];

  let map, markers;

  // Create marker cluster group (with fallback)
  function makeMarkerClusterGroup() {
    if (window.L && typeof L.markerClusterGroup === "function") {
      return L.markerClusterGroup({
        chunkedLoading: true,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
      });
    }
    // Fallback if clustering not available
    const layer = L.layerGroup();
    layer.clearLayers = function () {
      this.eachLayer((m) => this.removeLayer(m));
    };
    return layer;
  }

  // Add markers to map
  function addMarkers(data) {
    if (markers && markers.clearLayers) {
      markers.clearLayers();
    }

    const markerArray = [];

    data.forEach(function (store) {
      const marker = L.marker([store.lat, store.lng]);

      // Create popup content
      const popupContent = `
        <div class="store-popup">
          <strong>${store.name}</strong><br/>
          📍 ${store.address}, ${store.city}<br/>
          📞 ${store.phone}<br/>
          🕒 ${store.hours}<br/>
          <a target="_blank" rel="noopener noreferrer" href="${store.gmaps}">
            📍 Hap në Google Maps
          </a>
        </div>
      `;

      marker.bindPopup(popupContent);

      if (markers.addLayer) {
        markers.addLayer(marker);
      } else {
        marker.addTo(map);
      }

      markerArray.push(marker);
    });

    if (markers.addTo) {
      markers.addTo(map);
    }

    // Fit bounds to show all markers
    if (markerArray.length > 0) {
      const group = L.featureGroup(markerArray);
      map.fitBounds(group.getBounds().pad(0.2));
    }
  }

  // Initialize map
  function initMap() {
    const mapElement = document.getElementById("stores-map");
    if (!mapElement) {
      console.error("Map element not found!");
      return;
    }

    // Ensure map has height
    if (!mapElement.style.height || mapElement.clientHeight === 0) {
      mapElement.style.height = "70vh";
    }

    // Create map
    map = L.map("stores-map", {
      scrollWheelZoom: true,
      zoomControl: true,
    }).setView([41.33, 19.82], 7);

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    }).addTo(map);

    // Create marker cluster group
    markers = makeMarkerClusterGroup();

    // Add all stores initially
    addMarkers(STORES);

    // Fix map size after initialization
    setTimeout(function () {
      map.invalidateSize();
    }, 150);

    console.log("🗺️ Map initialized with " + STORES.length + " stores");
  }

  // Apply filters
  function applyFilters() {
    const searchInput = document.getElementById("storeSearch");
    const citySelect = document.getElementById("cityFilter");

    const query = (searchInput && searchInput.value ? searchInput.value : "")
      .toLowerCase()
      .trim();
    const city = (citySelect && citySelect.value ? citySelect.value : "")
      .toLowerCase()
      .trim();

    const filtered = STORES.filter(function (store) {
      const matchesCity = !city || (store.city || "").toLowerCase() === city;
      const matchesQuery =
        !query ||
        (store.name && store.name.toLowerCase().includes(query)) ||
        (store.address && store.address.toLowerCase().includes(query)) ||
        (store.city && store.city.toLowerCase().includes(query));

      return matchesCity && matchesQuery;
    });

    addMarkers(filtered);

    // Show toast with results
    if (typeof showToast === "function") {
      showToast(
        `U gjetën ${filtered.length} dyqan${filtered.length !== 1 ? "e" : ""}`,
        "info",
        2000
      );
    }

    // Refresh map
    setTimeout(function () {
      if (map) map.invalidateSize();
    }, 100);
  }

  // Initialize subnav pill filters
  function initSubnavFilters() {
    const pills = document.querySelectorAll(".subnav .pill");
    const citySelect = document.getElementById("cityFilter");

    pills.forEach((pill) => {
      pill.addEventListener("click", function () {
        const cityName = this.textContent.trim();

        // Update select dropdown
        if (citySelect) {
          if (cityName === "Të gjitha") {
            citySelect.value = "";
          } else {
            citySelect.value = cityName;
          }
        }

        // Apply filters
        applyFilters();

        // Update active state
        pills.forEach((p) => p.classList.remove("active"));
        this.classList.add("active");
      });
    });

    // Set first pill as active initially
    if (pills.length > 0) {
      pills[0].classList.add("active");
    }
  }

  // Initialize contact form
  function initContactForm() {
    const form = document.querySelector(".contact-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const emri = document.getElementById("emri")?.value.trim();
      const telefoni = document.getElementById("telefoni")?.value.trim();
      const mesazhi = document.getElementById("mesazhi")?.value.trim();

      if (!emri || !telefoni || !mesazhi) {
        if (typeof showToast === "function") {
          showToast("Të gjitha fushat janë të detyrueshme!", "error");
        }
        return;
      }

      // Simulate sending
      if (typeof showToast === "function") {
        showToast("Kërkesa u dërgua me sukses! ✓", "success");
      }

      // Reset form
      this.reset();
    });
  }

  // Initialize everything on DOM ready
  function init() {
    console.log("🏪 Stores page initializing...");

    initMap();
    initSubnavFilters();
    initContactForm();

    // Setup event listeners
    const searchInput = document.getElementById("storeSearch");
    const citySelect = document.getElementById("cityFilter");

    if (searchInput) {
      searchInput.addEventListener("input", applyFilters);
    }

    if (citySelect) {
      citySelect.addEventListener("change", applyFilters);
    }

    console.log("✅ Stores page initialized successfully!");
  }

  // Wait for DOM and Leaflet to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
