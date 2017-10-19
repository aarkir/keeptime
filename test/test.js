(function() {
  "use strict";

  require("should");
  var keeptime = process.env.EXPRESS_COV ?
    require("../lib-cov/keeptime") :
    require("../lib/keeptime");

  describe("keeptime general tests", function() {
    // keeptime.init();
    // keeptime.start("books/the-jungle");
    // keeptime.cancel();
    // keeptime.stop("example message");
    // keeptime.addTag("chinese360", "lessons");
  });

})();
