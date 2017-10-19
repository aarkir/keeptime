(function() {
  "use strict";

  var store = require("data-store")("my-app");


  module.exports = {
    init: function() {
      store.set("sessioncount", 0);
    },

    /* path is the direct path. there is no resolving of the path.
     * @param {string} path
     * @param {string} start
     * @param {string} stop
     * @param {string} msg
     * @return {string}
     */
    addSession: function(task, start, stop, msg) {
      // default parameters
      msg = msg || "";

      var elem = {
        task: task,
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
      this.add(tags, task, sessioncount);
      // increment sessioncount
      store.set("sessioncount", sessioncount + 1);
    },

    add: function(object, path, elem, key) {
      var c = object;
      if (path != "") {
        var paths = path.split("/");
        var x;
        for (x in paths) {
          c = c[paths[x]];
        }
      }
      if (key !== undefined) {
        c[key] = elem;
      } else {
        c.push(elem);
      }
    },

    // addTask: function(path, name) {
    //   var content = this.readJson();
    //   var paths = path.split("/");
    //   var c = content;
    //   var x;
    //   for (x in paths) {
    //     c = c[paths[x]];
    //   }
    //   if (!c.hasOwnProperty(name)) {
    //     c[name] = {};
    //     this.writeJson(content);
    //   }
    // },

    readJson: function(path) {
      var fs = require("fs");
      var data = fs.readFileSync(path);
      return JSON.parse(data.toString());
    },

    writeJson: function(file, data) {
      var fs = require("fs");
      fs.writeFileSync(file, JSON.stringify(data, null, 2));
    },

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

    // display: function() {
    //   var prettyjson = require("prettyjson");
    //   var fs = require("fs");
    //   var content = fs.readFileSync("data/time.json").toString();
    //   console.log(prettyjson.render(JSON.parse(content)));
    // },

    /*
     * logs saved variables
     */
    // log: function() {
    //   var str = "";
    //   str += "Path: " + store.get("path") + "\n";
    //   str += "Start: " + store.get("start") + "\n";
    //   console.log(str);
    // }
  };
})();
