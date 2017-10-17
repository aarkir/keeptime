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

    addtime: function(task, starttime, endtime, description) {
      description = description || "";
    },

    starttimer: function() {
      var time = new Date().toISOString();
      store.set('starttime', time);
      console.log(time);
    },

    stoptimer: function() {
      var time = new Date().toISOString();
      store.set('stoptime', time);
      console.log(time);
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
