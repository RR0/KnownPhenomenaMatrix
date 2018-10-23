import {Injectable} from '@angular/core';
//const angular = require('angular');
import {CommonsService, org} from "../Commons.service";
import {PeopleService} from '../people/people.service';
import {Moment} from "./Moment";
import {Duration} from "./Duration.service";

declare var google;

@Injectable()
export class TimeService {
  chartZone = null;
  readonly timeRoot = '/time/';

  $locale = {
    DATETIME_FORMATS: {
      DAY: ['Dimanche', 'Lundu', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
      MONTH: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
    }
  };

  constructor(private commonsService: CommonsService, private peopleService: PeopleService) {
    'use strict';

    /**
     * http://www.w3.org/html/wg/drafts/html/master/text-level-semantics.html#the-time-element
     * http://www.whatwg.org/specs/web-apps/current-work/multipage/common-microsyntaxes.html#global-dates-and-times
     *
     * ((-)?[1-9]\d{3})(-(\d{1,2})(-(\d{1,2})(T\d{1,2}:\d{1:2])?)?)?
     *
     * 1947-06-21T14:20-02:00
     */
    var times;

    var self = this;

    var paramLang = function (lang) {
      return (!lang) ? org.rr0.context.language : lang;
    };

    org.rr0.context.time = new Moment();

    var chart;
  }

  addYear(y, yLink, t) {
    const self = this;
    var s = "";
    if (!y) {
      y = self.getTime().year;
    }
    if (!yLink) {
      yLink = self.yearLink(y);
    }
    if (!t) {
      var p = this.peopleService.getPeople();
      if (p) {
        t = p.toString();
        if (p.born) {
          t += " a " + (y - p.born.getFullYear()) + " ans";
        } else {
          t = "Naissance de " + t;
        }
      }
    }
    if (y) {
      s += org.link(yLink, y, t);
    }
    return s;
  }

  toISOString(moment) {
    var s = moment.year;
    if (moment.month) {
      s += '-' + this.commonsService.zero(moment.month);
    }
    if (moment.dayOfMonth) {
      s += '-' + this.commonsService.zero(moment.dayOfMonth);
    }
    if (moment.hour) {
      s += 'T' + this.commonsService.zero(moment.hour) + ":" + this.commonsService.zero(moment.minutes);
    }
    return s;
  }

  /*getTimes: function () {
   if (typeof google !== 'undefined' && typeof google.visualization !== 'undefined' && !times) {
   times = createTimesData();
   }
   return times;
   },*/

  setChartsHeight(h) {
    this.chartZone.style.height = h + '%';
    org.rr0.getSideZone("map-canvas").style.height = (100 - h) + '%';
  }

  /*drawChart: function () {
   if (times) {
   var options = {
   'title': "Heures d'observation",
   'width': this.chartZone.offsetWidth,
   'height': this.chartZone.offsetHeight - document.getElementById("head").offsetHeight,
   legend: {position: 'none'}
   };
   chart.draw(times, options);
   } else {
   self.setChartsHeight(0);
   }
   },*/

  NewDuration() {
    return new Duration();
  }
  NewMoment() {
    return new Moment();
  }

  getDate(y?, m?, d?) {
    var dat;
    if (!y) {
      y = this.getYear();
    }
    if (y) {                    // No getTime().year set means no date set
      dat = new Date();
      dat.setFullYear(y);
      if (!d) {
        d = this.getDayOfMonth();
      }
      dat.setDate(d);
      if (!m) {
        m = this.getMonth();
      }
      if (m) {
        dat.setMonth(m - 1);
      }
    }
    return dat;
  }

  getTime() {
    return org.rr0.context.time;
  }

  getMonth() {
    return this.getTime().month;
  }

  addMonth(m) {
    var s = "";
    var t = this.getTime();
    if (m) {
      t.month = m;
    }
    if (t.month) {
      s += this.monthName();
    }
    return s;
  }

  /**
   *
   * @param d
   * @returns {string}
   */
  addDayOfMonth(d) {
    var s = "";
    var t = this.getTime();
    if (!d) {
      d = t.dayOfMonth;
    }
    if (d) {
      var dayName = this.dayOfWeekName(this.getDayOfWeek(t.year, t.month, d));
      s += dayName + " ";
      s += (d === 1 ? "1<sup>er</sup>" : d);
    }
    return s;
  }

  addDate(p, y, m, d) {
    if (!y) {
      y = this.getTime().year;
    }
    var s = "";
    if (y) {
      if (!m) {
        m = this.getMonth();
      }
      if (!d) {
        d = this.getTime().dayOfMonth;
      }
      var newDate = new Date();
      newDate.setFullYear(y);
      var dateLink = this.yearLink(y);
      if (m) {
        newDate.setMonth(m);
        dateLink += "/" + org.zero(m);
        if (d) {
          newDate.setDate(d);
          //                s = "le ";
          s += this.addDayOfMonth(d);
          dateLink += "/" + org.zero(d);
        } else {
          //                s = "en ";
        }
        s += " " + this.addMonth(m);
      } else {
        //            s += "en ";
      }
      var t = null;
      s += " " + this.addYear(y, dateLink, t);
    }
    return s;
  }

  monthNames() {
    return this.$locale.DATETIME_FORMATS.MONTH;
  }
  /*            getTime: function () {
   return addDate();
   },*/
  monthName(m?) {
    if (!m) {
      var t = this.getTime();
      if (t.month) {
        m = t.month;
      }
    }
    return this.monthNames()[m - 1];
  }
  /**
   * Builds a address to link to a year page/directory.
   *
   * @param y The year
   * @param decade if the year (such as "1950") is to be understood as a decade (1950s).
   * @returns {string} The link
   */
  yearLink(y, decade?) {
    var yString = y.toString();
    var yLink = this.timeRoot;
    var pos = 0;
    yLink += (y < 1000 ? "0" : yString.substring(pos, ++pos)) + "/";
    yLink += (y < 100 ? "0" : yString.substring(pos, ++pos)) + "/";
    yLink += (y < 10 ? "0" : yString.substring(pos, ++pos)) + "/";
    if (!decade) {
      yLink += yString.substring(pos, ++pos);
    }
    return yLink;
  }
  dayOfWeekNames() {
    return this.$locale.DATETIME_FORMATS.DAY;
  }
  dayOfWeekName(d) {
    return this.dayOfWeekNames()[d];
  }
  getDayOfWeek(y?, m?, d?) {
    return this.getDate(y, m, d).getDay();
  }

  getDayOfMonth() {
    return this.getTime().dayOfMonth;
  }

  setYear(y) {
    if (y) {
      this.getTime().year = y;
    }
  }

  isTimeURL(u?) {
    if (!u) {
      u = this.commonsService.getUri();
    }
    return u.indexOf(this.timeRoot) === 0;
  }

  getYear() {
    var t = this.getTime();
    if (!t.year) {
      var u = this.commonsService.getUri();
      if (this.isTimeURL(u)) {
        var parts = u.split("/");
        t.year = 0;
        var mul = 1000;
        for (var i = 2; i < parts.length; i++) {
          var v = parts[i];
          if (org.isNumber(v)) {
            if (i <= 5) {
              t.year += v * mul;
              mul /= 10;
            } else if (!t.month) {
              t.month = parseInt(v, 10);
            } else if (!t.dayOfMonth) {
              t.dayOfMonth = parseInt(v, 10);
            }
          } else {
            break;
          }
        }
      }
    }
    return t.year;
  }
  setHour(h) {
    if (h) {
      this.getTime().hour = h;
    }
  }
  setMinutes(mn) {
    if (mn) {
      this.getTime().minutes = mn;
    }
  }
  getHour() {
    return this.getTime().hour;
  }

  setMonth(m) {
    if (m) {
      this.getTime().setMonth(m);
    }
  }

  setDayOfMonth(d) {
    if (d) {
      var t = this.getTime();
      t.dayOfMonth = d;
      t.hour = null;
      t.minutes = null;
    }
  }
  
  toString(contextTime, time) {
    var timeLink;
    var repYear;
    var titYear;
    var repMonth;
    var titMonth;
    var repDay;
    var titDay;
    var repHour;
    var self = this;
    var y = time.getYear();
    var otherYear;
    if (y) {
      otherYear = y !== contextTime.getYear();
      timeLink = this.yearLink(y);
      titYear = y;
      if (otherYear) {
        contextTime.setYear(y);
        repYear = " " + y;
      }
    }
    var otherMonth;
    var m = time.getMonth();
    if (m) {
      titMonth = this.monthName(m);
      timeLink += "/" + this.commonsService.zero(m);
      otherMonth = otherYear || m !== contextTime.getMonth();
      if (otherMonth) {
        contextTime.setMonth(m);
        repMonth = " " + titMonth;
      }
    }
    var otherDay = 0;
    var d = time.getDayOfMonth();
    if (d) {
      var dayAsNumber = parseInt(d, 10);
      var dOW;
      if (!!(dayAsNumber)) {
        dOW = this.dayOfWeekName(this.getDayOfWeek(y, m, d));
        titDay = dOW + " " + d + (d === 1 ? "er" : "");
        otherDay = otherMonth ? 30 : d - contextTime.getDayOfMonth();
      } else {
        titDay = d;
        otherDay = 1;
      }
      if (otherDay !== 0) {
        timeLink += "/" + this.commonsService.zero(d);
        repDay = titDay;
        if (!this.isTimeURL() && contextTime.getDayOfMonth()) {
          switch (otherDay) {
            case -1:
              repDay = "veille";
              break;
            case 1:
              repDay = "lendemain";
              break;
            case 2:
              repDay = "surlendemain";
              break;
            default:
              if (otherDay <= 7) {
                repDay = otherDay < 0 ? dOW + " pr\xE9c\xE9dent" : dOW + " suivant";
              }
          }
        }
        contextTime.setDayOfMonth(d);
      }
    }
    var titHour;
    var h = time.getHour();
    var otherHour;

    function registerTimeToDraw(updatedHour) {
      /*          var timesToUpdate = self.getTimes();
       if (timesToUpdate) {
       self.setChartsHeight(30);
       for (var i = 0; i < timesToUpdate.getNumberOfRows(); i++) {
       var iteratedHour = timesToUpdate.getValue(i, 0);
       if (iteratedHour === updatedHour) {
       var countForThatHour = timesToUpdate.getValue(i, 1);
       countForThatHour++;
       timesToUpdate.setValue(i, 1, countForThatHour);
       break;
       }
       }
       }*/
    }

    const handleHour = () => {
      var hourAsNumber = parseInt(h, 10);
      if (!!(hourAsNumber)) {
        titHour = this.commonsService.zero(h);
      } else {
        titHour = h;
        otherHour = true;
      }
      if (h) {
        registerTimeToDraw(h);
      }
      otherHour = otherHour || otherDay || h !== contextTime.getHour();
      if (d) {
        titHour = (time.isApprox() ? 'vers' : '\xE0') + ' ' + titHour;
      }
      if (otherHour) {
        contextTime.setHour(h);
      }// TODO: else manage to display "30 mn later"
      repHour = titHour;  // For now, always display hours, even if unchanged
    };

    if (h) {
      handleHour();
    }
    var mn = time.getMinutes();
    if (mn || h) {
      var th = ':' + this.commonsService.zero(mn);
      titHour += th;
      var otherMinutes = otherHour || mn !== contextTime.getMinutes();
      if (otherMinutes) {
        contextTime.setMinutes(mn);
        repHour += th;
      }
    }
    var s = time.getSeconds();
    if (s) {
      var ts = ':' + this.commonsService.zero(s);
      titHour += ts;
      var otherSeconds = otherMinutes || s !== contextTime.getSeconds();
      if (otherSeconds) {
        contextTime.setSeconds(s);
        repHour += ts;
      }
    }
    var titZ;
    var z = time.getTimeZone();
    if (z) {
      titZ = "(UTC" + (z >= 0 ? '+' : "") + z + ")";
    }
    var replacement = "";
    var title = "";
    if (repDay) {
      replacement += repDay;
    }
    //            else {
    //                if (! repMonth) {
    //                    replacement = "m\xEAme jour";
    //                }
    //            }
    if (titDay) {
      title += titDay;
    }
    if (repMonth) {
      replacement += repMonth;
    }
    if (titMonth) {
      title += " " + titMonth;
    }
    if (repYear) {
      replacement += repYear;
    }
    if (titYear) {
      title += " " + titYear;
    }
    if (repHour) {
      replacement += " " + repHour;
    }
    if (titHour) {
      title += ", " + titHour;
    }
    if (titZ) {
      title += " " + titZ;
    }
    if (time.startDate) {
      var start = self.toString(time, time.startDate).replacement;
      var end = replacement;
      var betweenWord = repDay ? 'au' : '\xE0';
      replacement = start + ' ' + betweenWord + ' ' + end;
      title = start + ' ' + betweenWord + ' ' + title;
    }
    return {
      "replacement": replacement.trim(),
      "timeLink": timeLink,
      "title": title.trim()
    };
  }
}