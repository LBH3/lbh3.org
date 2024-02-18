import Component from "can-component";
import Place from "~/models/place";
import "./map.less";
import loader from "@loader";

export const darkModeStyles = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

const zoom = 14;

export default Component.extend({
  tag: "lbh3-map",
  view: "",
  ViewModel: {
    get googleMapsKey() {
      return loader.googleMapsKey;
    },
    map: "any",
    place: {
      get(lastSetValue, resolve) {
        const placesPromise = this.placesPromise;
        if (placesPromise) {
          placesPromise.then((places) => {
            resolve(places[0]);
          });
        }
      },
    },
    get placesPromise() {
      if (this.placeId) {
        return Place.getList({
          placeId: this.placeId,
        });
      }
    },
    placeId: "string",
    polylines: {
      default() {
        return [];
      }
    },
    q: "string",
    segments: "any",

    connectedCallback(element) {
      let map, marker, observer;
      const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");

      // Add a marker with an info window to the map
      const setUpMarker = (place, position) => {
        const infoWindow = new google.maps.InfoWindow();
        marker = new google.maps.Marker({
          map,
          position,
          title: place.name,
        });
        marker.addListener("click", () => {
          infoWindow.setContent(`<div class="info-window">
            <h6>${place.name}</h6>
            <p>${place.formattedAddress}</p>
            <a href="${
              place.url ||
              `https://www.google.com/maps/search/?api=1&query=${this.q}`
            }" target="_blank">View on Google Maps</a>
          </div>`);
          infoWindow.open(map, marker);
        });
      };

      const mediaQueryListener = () => {
        const styles = mediaQueryList.matches ? darkModeStyles : [];

        // If there’s already a map…
        if (map) {
          // Just change the styles
          map.setOptions({
            styles,
          });
        } else {
          // Remove all children (useful for switching from the HTML embed to the JS map)
          while (element.firstChild) {
            element.removeChild(element.firstChild);
          }

          const onloadHandler = () => {
            if (this.placeId) {
              // The preferred case… get the place info and create the map
              this.placesPromise.then((places) => {
                const place = places[0];
                const position = {
                  lat: place.geometryLocation.coordinates[0],
                  lng: place.geometryLocation.coordinates[1],
                };

                map = new google.maps.Map(element, {
                  center: position,
                  styles,
                  zoom,
                });
                setUpMarker(place, position);
                segmentsDidChange();
              });
            } else if (this.q) {
              // The undesirable case… have to create a map, query Google for the info, and then update the map
              if (!map) {
                map = new google.maps.Map(element, {
                  center: { lat: 33.842088, lng: -118.094914 }, // Kind of the center of our area
                  styles,
                  zoom: 10,
                });
              }
              const service = new google.maps.places.PlacesService(map);
              const request = {
                query: this.q,
                fields: ["formatted_address", "geometry", "name"],
              };
              service.findPlaceFromQuery(request, (results, status) => {
                if (
                  results &&
                  results.length > 0 &&
                  status === google.maps.places.PlacesServiceStatus.OK
                ) {
                  const place = Place.fromGoogle(results[0]);
                  map.setCenter(results[0].geometry.location);
                  map.setZoom(zoom);
                  setUpMarker(place, results[0].geometry.location);
                  segmentsDidChange();
                }
              });
            }
          };

          const scriptSrc = `https://maps.googleapis.com/maps/api/js?callback=Function.prototype&key=${this.googleMapsKey}&libraries=places&loading=async`;
          const existingScript = document.querySelector(
            `script[src='${scriptSrc}']`
          );

          // Check if thet script’s already been loaded
          if (existingScript) {
            // If it has and window.google is defined…
            if (window.google) {
              // …immediately call the handler
              onloadHandler();
            } else {
              // …wait for the script to load and call the original handler too
              const originalOnload = existingScript.onload;
              existingScript.onload = function () {
                originalOnload.apply(this, arguments);
                onloadHandler();
              };
            }
          } else {
            const mapsScript = document.createElement("script");
            mapsScript.async = true;
            mapsScript.onload = onloadHandler;
            mapsScript.src = scriptSrc;
            mapsScript.type = "text/javascript";
            document.getElementsByTagName("head")[0].appendChild(mapsScript);
          }
        }
      };

      // Start listening for changes to dark mode
      mediaQueryList.addListener(mediaQueryListener);

      // Check if Intersection Observer is available
      if ("IntersectionObserver" in window) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                mediaQueryListener();
                observer.disconnect();
                observer = null;
              }
            });
          },
          {
            threshold: 0.2,
          }
        );
        observer.observe(element);
      } else {
        // Immediately call the listener to initially set up the map
        mediaQueryListener();
      }

      // Listen for segments to change
      const segmentsDidChange = () => {
        this.polylines.forEach(polyline => {
          polyline.setMap(null);
        });
        this.polylines = [];
        const segments = this.segments;
        if (segments) {
          segments.forEach((segment) => {
            const path = Array.from(
              segment.map((point) => {
                return {
                  lat: parseFloat(point[0], 10),
                  lng: parseFloat(point[1], 10),
                };
              })
            );
            const polyline = new google.maps.Polyline({
              geodesic: true,
              path,
              strokeColor: '#dc3232',
              strokeOpacity: 0.75,
              strokeWeight: 2
            });
            polyline.setMap(map);
            this.polylines.push(polyline);
          });
        }
      };
      this.listenTo("segments", segmentsDidChange);

      return () => {
        // Remove the marker click listener
        if (window.google && marker) {
          google.maps.event.clearInstanceListeners(marker);
        }

        // Remove the dark mode media query listener
        mediaQueryList.removeListener(mediaQueryListener);

        // Remove the Intersection Observer listener
        if (observer) {
          observer.disconnect();
        }

        // Remove any listeners on the component
        this.stopListening();
      };
    },
  },
});
