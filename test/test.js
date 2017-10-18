(function() {
  "use strict";

  require("should");
  var keeptime = process.env.EXPRESS_COV ?
    require("../lib-cov/keeptime") :
    require("../lib/keeptime");

  describe("keeptime general tests", function() {
    keeptime.start("social/friends");
    keeptime.stop("example");
    keeptime.display();
    keeptime.add("computer-science/opengl/learnopengl.com/hello-triangle",
      "2017-10-16T14:54:00.000Z", "2017-10-16T14:57:00.000Z", "");
    keeptime.display();
  });

})();
