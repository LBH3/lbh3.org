import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Session from '~/models/session';
import './nav.less';

export const ViewModel = DefineMap.extend({
  day: 'number',
  isActive: function(page) {
    const currentPage = this.page;

    if (currentPage === 'events' && (page === 'events' || page === 'hareline') && this.year) {
      const isFuturePage = page === 'hareline';

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      if (currentYear === this.year) {

        const currentMonth = currentDate.getMonth() + 1;
        if (currentMonth === this.month) {

          const currentDay = currentDate.getDate();
          if (currentDay <= this.day) {
            return isFuturePage;
          }
        } else if (currentMonth < this.month) {
          return isFuturePage;
        }
      } else if (currentYear < this.year) {
        return isFuturePage;
      }
    }

    return currentPage === page;
  },
  month: 'number',
  page: 'string',
  get session() {
    return Session.current;
  },
  year: 'number'
});

export default Component.extend({
  tag: 'lbh3-nav',
  ViewModel,
  view: `
    <can-import from="can-stache-route-helpers" />
    <nav class="border-bottom d-flex">
      <ul class="flex-row m-auto navbar-nav overflow-auto text-nowrap">
        <li class="{{#if isActive('home')}}active{{/if}} nav-item"><a class="nav-link pl-3 pr-2 py-2" href="{{routeUrl page='home'}}">Home</a></li>
        <li class="{{#if isActive('hareline')}}active{{/if}} nav-item"><a class="nav-link px-2 py-2" href="{{routeUrl page='hareline'}}">Hareline</a></li>
        <li class="{{#if isActive('events')}}active{{/if}} nav-item"><a class="nav-link px-2 py-2" href="{{routeUrl page='events'}}">Past Runs</a></li>
        <li class="{{#if isActive('hashers')}}active{{/if}} nav-item"><a class="nav-link px-2 py-2" href="{{routeUrl page='hashers' secondaryPage=''}}">Directory</a></li>
        {{#if session.user.canManageUsers}}
          <li class="{{#if isActive('users')}}active{{/if}} nav-item"><a class="nav-link px-2 py-2" href="{{routeUrl page='users'}}">Users</a></li>
          <li class="{{#if isActive('special-events')}}active{{/if}} nav-item"><a class="nav-link px-2 py-2" href="{{routeUrl page='special-events'}}">Special Events</a></li>
          <li class="{{#if isActive('erections')}}active{{/if}} nav-item"><a class="nav-link px-2 py-2" href="{{routeUrl page='erections'}}">Erections</a></li>
        {{/if}}
        <li class="{{#if isActive('about')}}active{{/if}} nav-item"><a class="nav-link pl-2 pr-3 py-2" href="{{routeUrl page='about'}}">About</a></li>
      </ul>
    </nav>
  `
});
