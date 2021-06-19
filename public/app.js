import DefineMap from "can-define/map/map";
import Honeybadger from "honeybadger-js";
import loader from "@loader";
import route from "can-route";
import RoutePushstate from "can-route-pushstate";
import Session from "~/models/session";

const defaultPage = "home";
const environment = typeof loader.getEnv === 'undefined' ? process.env.NODE_ENV : loader.getEnv();

Honeybadger.configure({
  apiKey: "ff6891e2",
  disabled: environment === "development",
  environment,
});

const AppViewModel = DefineMap.extend({
  day: {
    get() {
      return this.routeData.day;
    },
    type: "string"
  },
  description: {
    default: "",
    serialize: false,
  },
  head: {
    default() {
      return document.head;
    }
  },
  id: {
    get() {
      return this.routeData.id;
    },
    type: "number"
  },
  month: {
    get() {
      return this.routeData.month;
    },
    type: "string"
  },
  ogTitle: {
    default: "",
    serialize: false,
  },
  page: {
    get() {
      return this.routeData.page || defaultPage;
    }
  },
  routeData: {
    default() {
      route.start();
      return route.data;
    }
  },
  get session() {
    return Session.current;
  },
  title: {
    default: "LBH3",
    serialize: false,
  },
  trailNumber: {
    get() {
      return this.routeData.trailNumber;
    },
    type: "number"
  },
  urlId: {
    get() {
      return this.routeData.urlId;
    },
    type: "string"
  },
  get whichEventsPage() {
    if (this.routeData.secondaryPage === "attendance") {
      return "attendance";
    } else if (this.routeData.secondaryPage === "edit") {
      return "edit";
    } else if (this.routeData.secondaryPage === "search") {
      return "past-runs";
    } else if (this.trailNumber) {
      return "run";
    } else if (this.urlId) {
      return "special-event";
    } else {
      return "past-runs";
    }
  },
  year: {
    get() {
      return this.routeData.year;
    },
    serialize: function (year) {
      return this.page === "events" && this.routeData.secondaryPage === "search"
        ? undefined
        : year;
    },
  },
});

route.urlData = new RoutePushstate();

route.register("/about/mismanagement/{year}/", {
  page: "about",
  secondaryPage: "mismanagement",
  year: 0,
});
route.register("/about/{secondaryPage}/", { page: "about" });
route.register("/about/", { page: "about" });
route.register("/erections/{urlId}/{secondaryPage}/", {
  page: "erections",
  urlId: "",
  secondaryPage: "",
});
route.register("/erections/{urlId}/", { page: "erections", urlId: "" });
route.register("/erections/", { page: "erections" });
route.register("/events/", {
  page: "events",
  showHashit: false,
  showNotes: false,
  showOnOn: false,
  showScribe: false,
  view: "list"
});
route.register("/events/founders/", {
  page: "events",
  secondaryPage: "founders",
});
route.register("/events/search/", {
  page: "events",
  searchMissing: "broken-photo-url",
  secondaryPage: "search",
  skip: 0
});
route.register("/events/special/", {
  page: "events",
  secondaryPage: "special",
});
route.register("/events/sync/", { page: "events", secondaryPage: "sync" });
route.register(
  "/events/{year}/{month}/{day}/trail-{trailNumber}/{secondaryPage}/",
  {
    page: "events",
    year: 0,
    month: "",
    day: "",
    trailNumber: 0,
    secondaryPage: "",
  }
);
route.register("/events/{year}/{month}/{day}/trail-{trailNumber}/", {
  page: "events",
  year: 0,
  month: "",
  day: "",
  trailNumber: 0,
});
route.register("/events/{year}/{urlId}/{secondaryPage}/", {
  page: "events",
  secondaryPage: "",
  urlId: "",
  year: 0,
});
route.register("/events/{year}/{urlId}/", {
  page: "events",
  secondaryPage: "",
  urlId: "",
  year: 0,
});
route.register("/events/{year}/{urlId}", {
  page: "events",
  secondaryPage: "",
  urlId: "",
  year: 0,
});
route.register("/events/{year}/", {
  page: "events",
  secondaryPage: "",
  year: 0,
});
route.register(
  "/hareline/{year}/{month}/{day}/trail-{trailNumber}/{secondaryPage}/",
  {
    page: "hareline",
    year: 0,
    month: "",
    day: "",
    trailNumber: 0,
    secondaryPage: "",
  }
);
route.register("/hareline/{secondaryPage}/", { page: "hareline" });
route.register("/hareline/", { page: "hareline" });
route.register("/hashers/add/", { page: "hashers", secondaryPage: "add" });
route.register("/hashers/attendance-records/", {
  page: "hashers",
  secondaryPage: "attendance-records",
});
route.register("/hashers/early-warning/", {
  page: "hashers",
  secondaryPage: "early-warning",
});
route.register("/hashers/in-memoriam/", {
  page: "hashers",
  secondaryPage: "in-memoriam",
});
route.register("/hashers/{id}/{secondaryPage}/", {
  page: "hashers",
  id: 0,
  secondaryPage: "",
});
route.register("/hashers/{id}/", {
  id: 0,
  page: "hashers",
  role: "",
  showHashit: false,
  showNotes: false,
  showOnOn: false,
  showScribe: false
});
route.register("/hashers/", {
  noHeadshot: false,
  page: "hashers",
  search: "",
  secondaryPage: "",
  sort: ""
});
route.register("/users/{id}/{secondaryPage}/", {
  page: "users",
  id: 0,
  secondaryPage: "",
});
route.register("/users/", { page: "users" });
route.register("/{page}", { page: defaultPage });

export default AppViewModel;
