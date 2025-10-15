// ========================================
// STORES/MAP PAGE JAVASCRIPT
// ========================================

(function () {
  "use strict";

  // Store data
  const STORES = [
    {
      id: 1,
      name: "Abissnet Tiranë - Qendër",
      city: "Tiranë",
      address: "Rr. Myslym Shyri 12",
      phone: "04 22 22 222",
      lat: 41.3275,
      lng: 19.8187,
      hours: "Hën–Sht: 09:00–19:00",
      gmaps: "https://maps.google.com/?q=41.3275,19.8187",
    },
    {
      id: 2,
      name: "Abissnet Durrës",
      city: "Durrës",
      address: "Rr. Taulantia 5",
      phone: "052 22 22 22",
      lat: 41.3231,
      lng: 19.4414,
      hours: "Hën–Sht: 09:00–18:00",
      gmaps: "https://maps.google.com/?q=41.3231,19.4414",
    },
    {
      id: 3,
      name: "Abissnet Shkodër",
      city: "Shkodër",
      address: "Rr. Marin Barleti",
      phone: "022 22 22 22",
      lat: 42.0693,
      lng: 19.5126,
      hours: "Hën–Sht: 09:00–17:30",
      gmaps: "https://maps.google.com/?q=42.0693,19.5126",
    },
    {
      id: 4,
      name: "Abissnet Vlorë",
      city: "Vlorë",
      address: "Rr. Sadik Zotaj",
      phone: "033 22 22 22",
      lat: 40.4667,
      lng: 19.4897,
      hours: "Hën–Sht: 09:00–18:00",
      gmaps: "https://maps.google.com/?q=40.4667,19.4897",
    },
    {
      id: 5,
      name: "Abissnet Elbasan",
      city: "Elbasan",
      address: "Rr. Qemal Stafa",
      phone: "054 22 22 22",
      lat: 41.1125,
      lng: 20.0822,
      hours: "Hën–Sht: 09:00–18:00",
      gmaps: "https://maps.google.com/?q=41.1125,20.0822",
    },
    {
      id: 6,
      name: "Abissnet Fier",
      city: "Fier",
      address: "Rr. 18 Shtatori",
      phone: "034 22 22 22",
      lat: 40.7239,
      lng: 19.5561,
      hours: "Hën–Sht: 09:00–18:00",
      gmaps: "https://maps.google.com/?q=40.7239,19.5561",
    },
    {
      id: 7,
      name: "Abissnet Korçë",
      city: "Korçë",
      address: "Bulevardi Republika",
      phone: "082 22 22 22",
      lat: 40.6186,
      lng: 20.7804,
      hours: "Hën–Sht: 09:00–17:30",
      gmaps: "https://maps.google.com/?q=40.6186,20.7804",
    },
    {
      id: 8,
      name: "Abissnet Gjirokastër",
      city: "Gjirokastër",
      address: "Rr. 18 Shtatori",
      phone: "084 22 22 22",
      lat: 40.0756,
      lng: 20.1389,
      hours: "Hën–Sht: 09:00–17:00",
      gmaps: "https://maps.google.com/?q=40.0756,20.1389",
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
