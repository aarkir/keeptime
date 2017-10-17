(function() {
  "use strict";

  require("should");
  var keeptime = process.env.EXPRESS_COV ?
    require("../lib-cov/keeptime") :
    require("../lib/keeptime");

  describe("keeptime general tests", function() {
    console.log(keeptime.today());
  });

})();
