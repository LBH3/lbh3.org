/* eslint-disable no-undef */
const calendars = [
  {
    'color': '#777777',
    'id': 'hash.org_vca9alu5cu5q2hkvip31fma6so@group.calendar.google.com',
    'summary': 'GAL'
  },
  {
    'color': '#dc3232',
    'id': 'hash.org_apdt0s7aam1mdl1ckc4n1rcc4k@group.calendar.google.com',
    'summary': 'LBH3'
  },
  {
    'color': '#cd6d40',
    'id': 'hash.org_gr8mpprvpgpiihhkfj0dd0ic4k@group.calendar.google.com',
    'summary': 'OCH3'
  },
  {
    'color': '#777777',
    'id': 'hash.org_bqjrp8qb2ne5d72s7i22a0f9m0@group.calendar.google.com',
    'summary': 'Special Event'
  },
  {
    'color': '#349ce9',
    'id': 'hash.org_8er4h3q5qct5apu9nl2v7ic4c0@group.calendar.google.com',
    'summary': 'LAH3'
  },
  {
    'color': '#777777',
    'id': 'hash.org_usu1t0e08b8pmgiub20vu3uh8o@group.calendar.google.com',
    'summary': 'Hot Flash'
  },
  {
    'color': '#58d7e3',
    'id': 'hash.org_f9pd9rqdl9p4o5p2ierccb2dbk@group.calendar.google.com',
    'summary': 'Ventura'
  },
  {
    'color': '#777777',
    'id': 'hash.org_vs1a87f9anqe0c66h2knc4nd14@group.calendar.google.com',
    'summary': 'H5'
  },
  {
    'color': '#777777',
    'id': '529ih4iun7rs62rbdban4838i0@group.calendar.google.com',
    'summary': 'Hashsc Calendar'
  },
  {
    'color': '#7950df',
    'id': 'hash.org_8jis0j5k0hanmgq2c6inrf93ho@group.calendar.google.com',
    'summary': 'OC Hump'
  },
  {
    'color': '#457a51',
    'id': 'hash.org_qhs75uc6iedipkaopd5froa80k@group.calendar.google.com',
    'summary': 'BOHICA'
  },
  {
    'color': '#777777',
    'id': 'hash.org_ljnt8tvbnb2lhqp0ib6pu7p5bo@group.calendar.google.com',
    'summary': 'GSpot'
  },
  {
    'color': '#777777',
    'id': 'hash.org_atjdvmkhl2fa3n2cer8m9mlsv4@group.calendar.google.com',
    'summary': 'SCVHHH'
  },
  {
    'color': '#777777',
    'id': 'hash.org_6ocimc04ghdh7652dlvnjs5060@group.calendar.google.com',
    'summary': 'Foothill'
  },
  {
    'color': '#777777',
    'id': 'hash.org_tgkkji1arc133kf0vsjofrsod8@group.calendar.google.com',
    'summary': 'Full Moon'
  },
  {
    'color': '#777777',
    'id': 'hash.org_t8of6q45k4cki650d97m0b80dc@group.calendar.google.com',
    'summary': 'SH4'
  },
  {
    'color': '#ff69b4',
    'id': 'hash.org_a92amemeo3ulb9lso3kog1k0jg@group.calendar.google.com',
    'summary': 'PMS'
  },
  {
    'color': '#fbf052',
    'id': 'hash.org_0si8oud4j5upnojfbimg60snag@group.calendar.google.com',
    'summary': 'Humpin\' Hash: Posted on Hash.org'
  },
  {
    'color': '#777777',
    'id': 'hash.org_efk2ibem9h2lonqgignpcp8uoo@group.calendar.google.com',
    'summary': 'Throw Down H3'
  },
  {
    'color': '#777777',
    'id': 'hash.org_v35g0trihcm3ip2pvoj16ancf4@group.calendar.google.com',
    'summary': 'Metro Sexual Hash - MSH3'
  },
  {
    'color': '#777777',
    'id': 'hash.org_t92ud36ad0jbao70f22d2eptuc@group.calendar.google.com',
    'summary': 'ELH3'
  }
];

const computedSymbol = Symbol('computed');
const endOfNextYear = new Date((new Date()).getFullYear() + 2, 0);
const startOfToday = new Date(new Intl.DateTimeFormat([], { dateStyle: 'full' }).format(new Date()));
const startOfTodayTime = startOfToday.getTime();

const promises = calendars.map(calendar => {
  return `https://www.googleapis.com/calendar/v3/calendars/${calendar.id}/events?calendarId=${calendar.id}&sanitizeHtml=true&timeMax=${endOfNextYear.toISOString()}&timeMin=${startOfToday.toISOString()}&key=AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs`;
}).map(url => {
  return fetch(url).then(response => response.json());
});
Promise.allSettled(promises).then((data) => {
  const allEvents = [];
  const eventsByDay = {};
  data.forEach(({ value: calendar }, index) => {
    calendar.items.filter(item => {
      // Filter out canceled events that don’t have start dates
      return !!item.start;
    }).forEach(item => {
      const endDay = item.end.dateTime ? item.end.dateTime.slice(0, 10) : item.end.date;
      const startDay = item.start.dateTime ? item.start.dateTime.slice(0, 10) : item.start.date;
      if (eventsByDay[startDay] === undefined) {
        eventsByDay[startDay] = [];
      }
      item[computedSymbol] = {
        calendar,
        calendarData: calendars[index],
        endDay,
        startDay
      };
      allEvents.push(item);
      eventsByDay[startDay].push(item);
    });
  });
  const recurringEvents = allEvents.filter(event => {
    return event.recurrence;
  }).map(event => {
    return `https://www.googleapis.com/calendar/v3/calendars/${event[computedSymbol].calendarData.id}/events/${event.id}/instances?calendarId=${event[computedSymbol].calendarData.id}&sanitizeHtml=true&timeMax=${endOfNextYear.toISOString()}&timeMin=${startOfToday.toISOString()}&key=AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs`;
  }).map(url => {
    return fetch(url).then(response => response.json());
  });
  Promise.allSettled(recurringEvents).then((data) => {
    data.forEach(({ value: calendar }, index) => {
      calendar.items.forEach(item => {
        const endDay = item.end.dateTime ? item.end.dateTime.slice(0, 10) : item.end.date;
        const startDay = item.start.dateTime ? item.start.dateTime.slice(0, 10) : item.start.date;
        if (eventsByDay[startDay] === undefined) {
          eventsByDay[startDay] = [];
        }
        const calendarData = calendars.find(calendarItem => {
          return item.organizer.email === calendarItem.id;
        });
        item[computedSymbol] = {
          calendar,
          calendarData,
          endDay,
          startDay
        };
        // This is required for recurring events that have not been customized yet
        const eventAlreadyExists = eventsByDay[startDay].find(event => {
          return event.id === item.id;
        });
        if (!eventAlreadyExists) {
          allEvents.push(item);
          eventsByDay[startDay].push(item);
        }
      });
    });

    function sortByStartDate(a, b) {
      const aDate = new Date(a.start.dateTime || a.start.date);
      const bDate = new Date(b.start.dateTime || b.start.date);
      return aDate - bDate;
    }

    // All-day events
    allEvents.filter(event => {
      return event[computedSymbol].startDay !== event[computedSymbol].endDay;
    }).forEach(event => {
      const endDate = new Date(event.end.dateTime || `${event.end.date}T00:00:00-07:00`);
      const startDate = new Date(event.start.dateTime || `${event.start.date}T00:00:00-07:00`);
      const mutableIterationDate = new Date(startDate);
      while (mutableIterationDate <= endDate) {
        mutableIterationDate.setDate(mutableIterationDate.getDate() + 1);
        const day = mutableIterationDate.toISOString().slice(0, 10);
        const dayTime = new Date(`${day}T00:00:00-07:00`).getTime();
        if (dayTime > new Date(startDate).getTime() && dayTime < new Date(endDate).getTime()) {
          if (eventsByDay[day] === undefined) {
            eventsByDay[day] = [];
          }
          eventsByDay[day].push(event);
        }
      }
    });

    const filteredDays = Object.keys(eventsByDay).sort().filter(day => {
      return new Date(`${day}T00:00:00-07:00`) >= startOfToday;
    });
    const days = filteredDays.map(day => {
      const events = eventsByDay[day].sort(sortByStartDate);
      return {
        day,
        dayLocalized: new Intl.DateTimeFormat([], {
          dateStyle: 'full'
        }).format(new Date(`${day}T00:00:00-07:00`)),
        events
      };
    });

    const beginningOfTheWeek = new Date((new Date(startOfToday)).setDate(startOfToday.getDate() - startOfToday.getDay()));
    const calendarDates = [beginningOfTheWeek];
    const mutableIterationDate = new Date(beginningOfTheWeek);
    const lastDay = new Date(filteredDays[filteredDays.length - 1]);
    while (mutableIterationDate <= lastDay) {
      mutableIterationDate.setDate(mutableIterationDate.getDate() + 1);
      calendarDates.push(new Date(mutableIterationDate));
    }
    const endOfTheLastWeek = new Date((new Date(mutableIterationDate)).setDate(mutableIterationDate.getDate() + (6 - mutableIterationDate.getDay())));
    while (mutableIterationDate < endOfTheLastWeek) {
      mutableIterationDate.setDate(mutableIterationDate.getDate() + 1);
      calendarDates.push(new Date(mutableIterationDate));
    }
    const calendarDatesByMonth = {};
    calendarDates.forEach(calendarDate => {
      const yearMonth = `${calendarDate.getFullYear()}-${calendarDate.getMonth()}`;
      if (!calendarDatesByMonth[yearMonth]) {
        calendarDatesByMonth[yearMonth] = [];
      }
      calendarDatesByMonth[yearMonth].push(calendarDate);
    });
    const calendarDatesWithMonths = [];
    for (const yearMonth in calendarDatesByMonth) {
      calendarDatesWithMonths.push({
        dates: calendarDatesByMonth[yearMonth],
        yearMonth
      });
    }

    function localizedStringForDate(date, locales, options) {
      if (date.toLocaleTimeString) {
        try {
          return date.toLocaleTimeString(locales, options);
        } catch (error) {
          return date.toLocaleTimeString();
        }
      }
      return date.toString();
    }

    function startTimeForEvent(event, day) {
      const options = {
        timeStyle: 'short',
        timeZone: event[computedSymbol].calendar.timeZone
      };
      if (day !== event.start.dateTime.slice(0, 10)) {
        if (day === event.end.dateTime.slice(0, 10)) {
          return `Ends at ${localizedStringForDate(new Date(event.end.dateTime), undefined, options)}`;
        } else {
          return 'All-day';
        }
      }
      return localizedStringForDate(new Date(event.start.dateTime), undefined, options);
    }

    let currentView = localStorage.getItem('view') || 'month';
    window.activateView = (view) => {
      currentView = view;
      document.querySelector('.nav').innerHTML = getNavContents();
      document.querySelector('main').innerHTML = getMainContents();
      localStorage.setItem('view', view);
    };
    function getMainContents() {
      return currentView === 'list' ? getListView() : getMonthView();
    }
    function getNavContents() {
      return `
        <li class="nav-item">
          <a aria-current="page" class="${currentView === 'list' ? 'active' : ''} nav-link" onclick="activateView('list')">List</a>
        </li>
        <li class="nav-item">
          <a class="${currentView === 'month' ? 'active' : ''} nav-link" onclick="activateView('month')">Calendar</a>
        </li>
      `;
    }
    function getListView() {
      return `
        <dl class="list">
        ${days.map(({ day, dayLocalized, events }) => {
      return `
              <div>
                <dt class="frosted-background">${dayLocalized}</dt>
                ${events.map(event => {
      return `
          <dd class="py-1">
            <a class="d-block" data-bs-target="#event-${event.id}" data-bs-toggle="modal" style="border-left: .25rem solid ${event[computedSymbol].calendarData.color}">
              <p class="my-0 one-line px-2 text-muted"><small>${event.start.dateTime ? startTimeForEvent(event, day) : 'All-day'}</small></p>
              <p class="my-0 one-line px-2">${event.summary}</p>
              ${event.location ? `<p class="my-0 one-line px-2 text-muted"><small>${event.location}</small></p>` : ''}
            </a>
          </dd>
        `;
    }).join('')
  }
              </div>
            `;
    }).join('')
  }
        </dl>
      `;
    }
    function getMonthView() {
      return `
        ${
    calendarDatesWithMonths.map(({dates}) => {
      const firstDate = dates[0];
      const fillerDays = firstDate.getDay() === 0 ? [] : Array(firstDate.getDay()).fill(undefined);
      // TODO: consider getting the first day of the week with Intl.Locale.prototype.weekInfo
      return `
        <div>
          <header class="frosted-background sticky-top">
            <h2 class="m-2">${new Intl.DateTimeFormat([], { month: 'long', year: 'numeric' }).format(dates[0])}</h2>
            <ol class="calendar list-unstyled m-0 text-center">
              <li class="one-line">Sun</li>
              <li class="one-line">Mon</li>
              <li class="one-line">Tue</li>
              <li class="one-line">Wed</li>
              <li class="one-line">Thu</li>
              <li class="one-line">Fri</li>
              <li class="one-line">Sat</li>
            </ol>
          </header>
          <ol class="calendar events list-unstyled m-0">
          ${fillerDays.map(() => {
      return `<li class="filler"></li>`;
    }).join('')}
          ${dates.map(calendarDate => {
      const day = calendarDate.toISOString().slice(0, 10);
      const events = eventsByDay[day];
      return `
                          <li class="${calendarDate < startOfToday ? 'before-today' : ''}">
                            <p class="mb-1 one-line px-1 text-end"><span class="${calendarDate.getTime() === startOfTodayTime ? 'badge rounded-pill text-bg-danger' : ''}" ="">${new Intl.DateTimeFormat([], { day: 'numeric' }).format(calendarDate)}</span></p>
                            ${events ? events.map(event => {
      return `
                              <a class="d-block pb-4" data-bs-target="#event-${event.id}" data-bs-toggle="modal" style="border-top: ${event[computedSymbol].startDay === event[computedSymbol].endDay ? '.25rem' : '.5rem'} solid ${event[computedSymbol].calendarData.color}">
                              <p class="my-0 one-line px-1 text-muted"><small>${event.start.dateTime ? startTimeForEvent(event, day) : 'All-day'}</small></p>
                              <p class="my-0 one-line px-1">${event.summary}</p>
                              ${event.location ? `<p class="my-0 one-line px-1 text-muted"><small>${event.location}</small></p>` : ''}
                            </a>
                              `;
    }).join('') : ''}
                          </li>
                        `;
    }).join('')}
          </ol>
        </div>
      `;
    }).join('')
  }
      `;
    }

    document.body.innerHTML = `
      ${allEvents.map(event => {
      return `
          <div aria-hidden="true" aria-labelledby="event-${event.id}-title" class="fade modal" id="event-${event.id}" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-lg-down modal-lg">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="event-${event.id}-title">${event.summary}</h5>
                  <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button"></button>
                </div>
                <div class="modal-body">
                  <p>${new Intl.DateTimeFormat([], { dateStyle: 'full', timeStyle: 'short' }).formatRange(new Date(event.start.dateTime || `${event.start.date}T00:00:00-07:00`), new Date(event.end.dateTime || `${event.end.date}T00:00:00-07:00`))}</p>
                  <hr>
                  <p>
                    ${event.location ? `
                      ${event.location}
                      (<a href="http://maps.apple.com/?q=${encodeURIComponent(event.location)}" target="_blank">Apple&nbsp;Maps</a>
                      | <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}" target="_blank">Google&nbsp;Maps</a>)
                    ` : 'No location provided.'}
                  </p>
                  <hr>
                  <p>${event.description ? event.description.replaceAll('\n', '<br>') : 'No description provided.'}</p>
                  <hr>
                  <p><small class="text-muted">Last updated on ${new Intl.DateTimeFormat([], { dateStyle: 'full', timeStyle: 'short' }).format(new Date(event.updated))} on the “${event.organizer.displayName || event[computedSymbol].calendar.summary}” calendar.</small></p>
                </div>
              </div>
            </div>
          </div>
        `;
    }).join('')}
      <nav class="navbar navbar-expand-lg navbar-light">
        <div class="container-fluid">
          <h1><a class="navbar-brand" href="./">H3 in SoCal</a></h1>
          <ul class="nav nav-pills">
            ${getNavContents()}
          </ul>
        </div>
      </nav>
      <main>${getMainContents()}</main>
    `;
  });
  });
