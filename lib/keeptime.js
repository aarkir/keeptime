(function() {
  "use strict";

  var store = require("data-store")("my-app");

  /*
   * @param {string} test
   * @return {string}
   */
  module.exports = {
    init: function(dir) {

    },

    add: function(path, start, stop, msg) {
      msg = msg || "";

      var fs = require("fs");
      var data = fs.readFileSync("data/time.json");

      var content = JSON.parse(data.toString());
      var paths = path.split("/");
      var c = content;
      var x;
      for (x in paths) {
        c = c[paths[x]];
      }
      var elem = {
        start: start,
        stop: stop,
        msg: msg
      };
      c.push(elem);
      fs.writeFileSync("data/time.json", JSON.stringify(content, null, 2));
    },

    start: function(path) {
      store.set('path', path);
      var time = new Date().toISOString();
      store.set('start', time);
      console.log(time);
    },

    stop: function(msg) {
      var path = store.get("path");
      var start = store.get("start");
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

    log: function() {
      var str = "";
      str += "Start time: " + store.get("starttime") + "\n";
      str += "Stop time: " + store.get("stoptime") + "\n";
      console.log(str);
    },

    today: function() {
      return "today";
    }
  };
})();
