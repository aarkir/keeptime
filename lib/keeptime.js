(function() {
  "use strict";

  var keeptime = {};

  /*
   * @param {string} test
   * @return {string}
   */
  module.exports = {
    display: function(string) {
      return string;
    },

    log: function(string) {
      console.log(string);
    },

    today: function() {
      return "today";
    }
  };
})();
