import Component from "can-component";
import { defaultLocale, localizedStringForDate, timeZone } from "~/models/event";
import EventsRoutes from "~/models/events-routes";
import view from "./sync.stache";

export default Component.extend({
  tag: "lbh3-past-runs-sync",
  view,
  ViewModel: {
    routes: {
      default() {
        return [];
      },
    },
    get saveableFiles() {
      return this.routes
        .filter((route) => {
          return route.shouldSave;
        });
    },
    savePromise: Promise,
  
    formatDate(date) {
      const options = {
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        month: 'numeric',
        timeZone,
        weekday: 'long',
        year: '2-digit'
      };
      return localizedStringForDate(new Date(date), defaultLocale, options);
    },

    stringForObject(data) {
      return JSON.stringify(data.serialize());
    },

    saveAll() {
      this.savePromise = Promise.all(
        this.saveableFiles.map((route) => {
          return route.save();
        })
      );
    },
  },
  events: {
    'input[type="file"] change': function (input) {
      const files = input.files;
      if (files && files.length > 0) {
        const viewModel = this.viewModel;
        for (let rawFile of files) {
          const route = new EventsRoutes({
            hasherId: viewModel.session.user.hasherId,
            rawFile,
          });
          route.parse();
          this.viewModel.routes.push(route);
        }
      }
    },
  },
});
