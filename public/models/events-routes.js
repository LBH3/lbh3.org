import DefineList from "can-define/list/";
import DefineMap from "can-define/map/";
import Event from "./event";
import EventsHashers from "~/models/events-hashers";
import feathersModel from "./feathers-model";
import Hasher from './hasher';
import moment from "moment-timezone";

const EventsRoutes = DefineMap.extend({
  id: {
    identity: true,
    type: "number",
  },
  createdAt: "any",
  updatedAt: "any",
  get canSave() {
    return this.errors.length === 0 ? this.didAttend : false;
  },
  didAttend: {
    get(lastSetValue, resolve) {
      const didAttendPromise = this.didAttendPromise;
      if (didAttendPromise) {
        didAttendPromise.then((records) => {
          resolve(records.length > 0);
        });
      }
    },
    serialize: false,
  },
  get didAttendPromise() {
    const trailNumber = this.trailNumber;
    if (trailNumber) {
      return EventsHashers.getList({
        hasherId: this.hasherId,
        trailNumber,
      });
    }
  },
  get distance() {
    const trail = this.trail;
    if (trail) {
      const location = trail.location;
      if (location && location.geometryLocation) {
        const firstPoint = this.segments[0][0];
        const trailCoordinates = location.geometryLocation.coordinates;
        if (firstPoint && trailCoordinates) {
          const xDiff = firstPoint[1] - trailCoordinates[1];
          const yDiff = firstPoint[0] - trailCoordinates[0];
          return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
        }
      }
    }
  },
  errors: {
    default() {
      return [];
    }
  },
  hasher: {
    get: function(lastValue, setValue) {
      const hasherPromise = this.hasherPromise;
      if (hasherPromise) {
        hasherPromise.then(hashers => {
          if (hashers && hashers.length > 0) {
            setValue(hashers[0]);
          }
        });
      }
    },
    serialize: false
  },
  hasherId: 'number',
  hasherPromise: {
    get: function() {
      const id = this.hasherId;
      if (id) {
        return Hasher.getList({
          id
        });
      }
    },
    serialize: false
  },
  metadata: DefineMap,
  rawFile: {
    serialize: false,
    type: "any",
  },
  segments: "any",
  shouldSave: {
    get(lastSetValue) {
      return lastSetValue === undefined ? this.canSave && this.distance < 0.01 : lastSetValue;
    },
    serialize: false
  },
  trail: {
    get(lastSetValue, resolve) {
      const trailPromise = this.trailPromise;
      if (trailPromise) {
        trailPromise.then((trails) => {
          if (trails.length === 0) {
            this.errors.push(new Error("No trail found"));
          } else if (trails.length === 1) {
            resolve(trails[0]);
          } else {
            this.errors.push(new Error(`Multiple trails found for ${this.segments[0][0][2]}`));
          }
        });
      }
    },
    serialize: true,
  },
  trailNumber: {
    get(lastSetValue) {
      const trail = this.trail;
      return lastSetValue || trail && trail.trailNumber;
    },
    serialize: true,
  },
  get trailPromise() {
    const query = this.trailQuery;
    if (query) {
      return Event.getList(query);
    }
  },
  get trailQuery() {
    const segments = this.segments;
    if (segments) {
      const segmentDate = moment(segments[0][0][2])
        .tz("America/Los_Angeles")
        .toDate();
      return {
        $limit: 1,
        startDatetime: {
          $gte: new Date(
            segmentDate.getFullYear(),
            segmentDate.getMonth(),
            segmentDate.getDate()
          ),
          $lte: new Date(
            segmentDate.getFullYear(),
            segmentDate.getMonth(),
            segmentDate.getDate() + 1
          ),
        },
      };
    }
  },

  parse() {
    const metadata = {
      source: "file"
    };
    metadata.fileLastModified = this.rawFile.lastModified;
    metadata.fileLastModifiedDate = this.rawFile.lastModifiedDate;
    metadata.fileName = this.rawFile.name;
    metadata.fileSize = this.rawFile.size;
    metadata.fileType = this.rawFile.type || 'application/gpx';

    const reader = new FileReader();
    reader.addEventListener('error', (error) => {
      this.errors.push(error);
    });
    reader.addEventListener('load', (event) => {
      const parser = new DOMParser();
      const parsed = parser.parseFromString(
        event.target.result,
        "application/xml"
      );

      const gpxElement = parsed.querySelector("gpx");
      metadata.gpxCreator = gpxElement.getAttribute('creator');
      metadata.gpxTime = (gpxElement.querySelector("metadata time") || {}).textContent;
      metadata.gpxVersion = gpxElement.getAttribute('version');

      const tracks = Array.from(parsed.querySelectorAll("trk"));
      try {
        if (tracks.length === 0) {
          throw new Error("No tracks found");
        } else if (tracks.length === 1) {
          tracks.map((track) => {
            const segments = Array.from(track.querySelectorAll("trkseg"));
            if (segments.length > 0) {
              this.segments = segments
                .map((segment) => {
                  const points = Array.from(segment.querySelectorAll("trkpt"));
                  if (points.length > 0) {
                    return points.map(
                      (point) => {
                        const ele = point.querySelector("ele");
                        return [
                          parseFloat(point.getAttribute("lat"), 10),
                          parseFloat(point.getAttribute("lon"), 10),
                          point.querySelector("time").textContent,
                          ele ? parseFloat(ele.textContent, 10) : undefined,
                        ];
                      }
                    );
                  } else {
                    throw new Error("No points found");
                  }
                })
                .sort((a, b) => {
                  return new Date(a[0][2]).getTime() - new Date(b[0][2]).getTime();
                });
            } else {
              throw new Error("No segments found");
            }
          });
        } else {
          throw new Error("More than one track found");
        }
      } catch (error) {
        this.errors.push(error);
      }
      this.metadata = metadata;
    });
    reader.readAsText(this.rawFile);
  },

  toggleShouldSave() {
    this.shouldSave = !this.shouldSave;
  }
});

EventsRoutes.List = DefineList.extend({
  "#": EventsRoutes,
});

EventsRoutes.connection = feathersModel("/api/events-routes", {
  List: EventsRoutes.List,
  Map: EventsRoutes,
  name: "events-routes",
});

export default EventsRoutes;
