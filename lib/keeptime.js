(function() {
  "use strict";

  var store = require("data-store")("my-app");


  module.exports = {
    init: function(dir) {

    },

    /*
     * @param {string} path
     * @param {string} start
     * @param {string} stop
     * @param {string} msg
     * @return {string}
     */
    add: function(path, start, stop, msg) {
      msg = msg || "";

      var fs = require("fs");
      var data = fs.readFileSync("data/time.json");
      var content = JSON.parse(data.toString());
      // var content = this.readJson();
      var paths = path.split("/");
      var c = content;
      var x;
      for (x in paths) {
        c = c[paths[x]];
      }
      var elem = {
        start: (new Date(start)).toISOString(),
        stop: (new Date(stop)).toISOString(),
        msg: msg
      };
      console.log(c);
      c.push(elem);
      this.writeJson(content);
    },

    addDir: function(path, name) {
      var content = this.readJson();
      var paths = path.split("/");
      var c = content;
      var x;
      for (x in paths) {
        c = c[paths[x]];
      }
      if (!c.hasOwnProperty(name)) {
        c[name] = {};
        this.writeJson(content);
      }
    },

    readJson: function() {
      var fs = require("fs");
      var data = fs.readFileSync("data/time.json");
      return JSON.parse(data.toString());
    },

    writeJson: function(data) {
      var fs = require("fs");
      fs.writeFileSync("data/time.json", JSON.stringify(data, null, 2));
    },

    start: function(path) {
      store.set('path', path);
      var time = new Date().toISOString();
      store.set('start', time);
      console.log(time);
    },

    cancel: function() {
      store.del("path");
      store.del("start");
    },

    stop: function(msg) {
      var path = store.get("path");
      var start = store.get("start");
      if (!path || !start) {
        console.log("Path or start undefined; did you start the timer?");
        return;
      }
      var stop = new Date().toISOString();

      this.add(path, start, stop, msg);
      console.log(path, start, stop, msg);
    },

    display: function() {
      var prettyjson = require("prettyjson");
      var fs = require("fs");
      var content = fs.readFileSync("data/time.json").toString();
      console.log(prettyjson.render(JSON.parse(content)));
    },

    /*
     * logs saved variables
     */
    log: function() {
      var str = "";
      str += "Path: " + store.get("path") + "\n";
      str += "Start: " + store.get("start") + "\n";
      console.log(str);
    }
  };
})();
