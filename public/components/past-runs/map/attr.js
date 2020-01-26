import { darkModeStyles } from '~/components/map/';
import callbacks from 'can-view-callbacks';
import loader from '@loader';
import platform from 'steal-platform';

const zoom = 9;

callbacks.attr('lbh3-map-attr', (mapElement, data) => {
  if (platform.isNode) {
    return;
  }

  let infoWindow, map, marker;
  const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");

  // Add a marker with an info window to the map
  const setUpMarker = (event, session) => {
    const place = event.location;
    const position = {lat: place.geometryLocation.coordinates[0], lng: place.geometryLocation.coordinates[1]};
    const userIsHasher = session && session.user && session.user.hasherId > 0;
    marker = new google.maps.Marker({
      map,
      position,
      title: place.name
    });
    marker.addListener('click', function() {
      if (!infoWindow) {
        infoWindow = new google.maps.InfoWindow();
      }
      infoWindow.setContent(`<div class="info-window">
        <h6>${event.nameHtml ? `${event.nameHtml}${event.trailNumber ? ` (#${event.trailNumber})` : ''}` : `Run #${event.trailNumber}`}</h6>
        <p>${event.startDateTimeString}</p>
        ${event.trailNumber ? `<p><b>Hare(s):</b> ${event.haresHtml || '?'}</p>` : ''}
        <p><b>Location:</b> ${event.longLocationHtml || event.shortLocationHtml}</p>
        ${(event.trailNumber && userIsHasher) ? `
          <p><b>Scribe:</b> ${event.scribesMd || '?'}</p>
          <p><b>Hashit:</b> ${event.hashitReasonMd || '?'}</p>
          <p><b>Notes:</b> ${event.trailCommentsMd || '?'}</p>
          <p><b>On-on:</b> ${event.onOnMd || '?'}</p>
          ${event.snoozeUrlWithAuth ? `<p><a href="${event.snoozeUrlWithAuth}" target="_blank">Download the Snooze</a></p>` : ''}
          ${event.photosUrl ? `<p><a href="${event.photosUrl}" target="_blank">View the photos on Google Photos</a></p>` : ''}
        ` : event.trailNumber ? `
          <p><b>On-on:</b> ${event.onOnMd}</p>
        ` : ''}
        ${place.url ? `<p class="mb-0"><a href="${place.url}" target="_blank">View on Google Maps</a></p>` : ''}
      </div>`);
      infoWindow.open(map, this);
    });
  };

  const mediaQueryListener = () => {
    const isDarkMode = mediaQueryList.matches;

    // If there’s already a map…
    if (map) {
      // Just change the styles
      map.setOptions({
        styles: isDarkMode ? darkModeStyles : []
      });
    } else if (mapElement) {

      // Remove all children (useful for switching from the HTML embed to the JS map)
      while (mapElement.firstChild) {
        mapElement.removeChild(mapElement.firstChild);
      }

      if (isDarkMode) {
        const onloadHandler = () => {
          data.scope.vm.locationsPromise.then(locations => {
            const position = {lat: 33.78348, lng: -118.15354};
            map = new google.maps.Map(mapElement, {
              center: position,
              zoom,
              styles: darkModeStyles
            });
            data.scope.vm.allEvents.filter(event => !!event.location).forEach(event => {
              setUpMarker(event, data.scope.vm.session);
            });
          });
        };

        const scriptSrc = `https://maps.googleapis.com/maps/api/js?key=${data.scope.vm.googleMapsKey}&libraries=places`;
        const existingScript = document.querySelector(`script[src='${scriptSrc}']`);

        // Check if thet script’s already been loaded
        if (existingScript) {
          // If it has and window.google is defined…
          if (window.google) {
            // …immediately call the handler
            onloadHandler();
          } else {
            // …wait for the script to load and call the original handler too
            const originalOnload = existingScript.onload;
            existingScript.onload = function() {
              originalOnload.apply(this, arguments);
              onloadHandler();
            };
          }
        } else {
          const mapsScript = document.createElement('script');
          mapsScript.onload = onloadHandler;
          mapsScript.src = scriptSrc;
          mapsScript.type = 'text/javascript';
          document.getElementsByTagName('head')[0].appendChild(mapsScript);
        }
      } else {
        // The plain HTML iframe embed
        const placeQuery = data.scope.vm.placeId ? `place_id:${data.scope.vm.placeId}` : data.scope.vm.q;
        const mapIframe = document.createElement('iframe');
        mapIframe.allowfullscreen = true;
        mapIframe.frameborder = 0;
        mapIframe.height = window.getComputedStyle(mapElement).height;
        mapIframe.src = `https://www.google.com/maps/embed/v1/place?key=${data.scope.vm.googleMapsKey}&q=${placeQuery}&zoom=${zoom}`;
        mapIframe.style = 'border:0';
        mapIframe.width = '100%';
        mapElement.appendChild(mapIframe);
      }
    }
  };

  // Start listening for changes to dark mode
  mediaQueryList.addListener(mediaQueryListener);

  // Immediately call the listener to initially set up the map
  mediaQueryListener();

  return () => {

    // Remove the marker click listener
    if (window.google && marker) {
      google.maps.event.clearInstanceListeners(marker);
    }

    // Remove the dark mode media query listener
    mediaQueryList.removeListener(mediaQueryListener);
  };
});
