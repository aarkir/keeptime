(function() {
  "use strict";

  var store = require("data-store")("my-app");


  module.exports = {
    /** META **/

    init: function() {
      store.set("sessioncount", 0);
    },

    /** TIMERS **/

    start: function(path) {
      store.set('path', path);
      var time = new Date().toISOString();
      store.set('start', time);
      console.log("Starting timer: ", time);
    },

    cancel: function() {
      store.del("path");
      store.del("start");
      console.log("Cancelling timer: ");
    },

    stop: function(msg) {
      var path = store.get("path");
      var start = store.get("start");
      console.log(path, start);
      if (!path || !start) {
        console.log("Path or start undefined; did you start the timer?");
        return;
      }
      var stop = new Date().toISOString();

      this.addSession(path, start, stop, msg);
      console.log("Stopped timer: ", path, start, stop, msg);
    },

    /** FILEIO **/

    readJson: function(path) {
      var fs = require("fs");
      var data = fs.readFileSync(path);
      return JSON.parse(data.toString());
    },

    writeJson: function(file, data) {
      var fs = require("fs");
      fs.writeFileSync(file, JSON.stringify(data, null, 2));
    },

    /** ADD FUNCTIONS **/

    /* path is the direct path. resolving is conducted in the bin
     TODO ensure no replacements
     * @param {string} path
     * @param {string} start
     * @param {string} stop
     * @param {string} msg
     * @return {string}
     */
    addSession: function(tag, start, stop, msg) {
      // default parameters
      msg = msg || "";

      var elem = {
        tag: tag,
        start: (new Date(start)).toISOString(),
        stop: (new Date(stop)).toISOString(),
        msg: msg
      };

      var sessions = this.readJson("data/sessions.json");
      var sessioncount = store.get("sessioncount");
      // add to sessions.json
      this.add(sessions, "", elem, sessioncount);
      this.writeJson("data/sessions.json", sessions);
      // add to tasks
      var tags = this.readJson("data/tags.json");
      this.add(tags, tag + "/s", sessioncount);
      this.writeJson("data/tags.json", tags);
      // increment sessioncount
      store.set("sessioncount", sessioncount + 1);
    },

    /*
    TODO ensure no replacements
    */
    addTag: function(path, name) {
      var tags = this.readJson("data/tags.json");
      var elem = {
        t: [],
        s: []
      };
      this.add(tags, path, elem, name);
      this.writeJson("data/tags.json", tags);
    },

    add: function(object, path, elem, key) {
      var c = object;
      if (path.length) {
        var paths = path.split("/");
        var x;
        for (x in paths) {
          c = c[paths[x]];
        }
      }
      console.log(c);
      if (key) {
        c[key] = elem;
      } else {
        c.push(elem);
      }
    }
  };
})();
