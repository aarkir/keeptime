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

    /** UTIL **/
    findPath: function(object, path) {
      var c = object;
      if (path.length) {
        var paths = path.split("/");
        var x;
        for (x in paths) {
          c = c[paths[x]];
        }
      }
      return c;
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
    addTag: function(path) {
      var tags = this.readJson("data/tags.json");
      var elem = {
        t: [],
        s: []
      };
      var l = path.lastIndexOf('/');
      this.add(tags, path.substring(0, l), elem, path.substring(l + 1));
      this.writeJson("data/tags.json", tags);
    },

    add: function(object, path, elem, key) {
      var c = this.findPath(object, path);
      console.log(c);
      if (key) {
        c[key] = elem;
      } else {
        c.push(elem);
      }
    },

    /** DELETE **/

    delS: function(hash) {
      var ss = this.readJson("data/sessions.json");
      delete ss[hash];
      this.writeJson("data/sessions.json", ss);
    },

    delT: function(path) {
      var ts = this.readJson("data/tags.json");
      var l = path.lastIndexOf('/');
      var o = this.findPath(ts, path.substring(0, l));
      delete o[path.substring(l + 1)];
      this.writeJson("data/tags.json", ts);
    },

    /** SHOW **/

    showS: function(hash) {
      var ss = this.readJson("data/sessions.json");
      var prettyjson = require("prettyjson");
      console.log(prettyjson.render(ss[hash]));
    },

    getParts: function(path) {
      var l = path.lastIndexOf('/');
      return [path.substring(0, l), path.substring(l + 1)];
    },

    showT: function(path) {
      var tags = this.readJson("data/tags.json");

      // initialize obj to the given object
      var obj = this.findPath(tags, path);

      // remove initial name from path
      var slash = path.indexOf('/');
      path = path.substring(slash + 1);

      var q = [];
      for (var i in obj.t) {
        q.push(["", obj.t[i]]);
      }
      delete obj.t;

      // ["", "chinese360/englishbook"]
      while (q.length) {
        // first, get the object the top of q references, called o
        var top = q.pop();
        // get referenced, the object that newpath references
        var referenced = this.findPath(tags, top[1]);
        // old points to the location in obj we will add to
        var old = this.findPath(obj, top[0]);
        // now we add
        old[top[1]] = referenced;


        // now, add t references to q
        // TODO make this recursive


        for (i in referenced.t) {
          q.push([newpath, referenced.t[i]]);
        }
        delete referenced.t;
        // for (var i in referenced) {
        //   if (referenced.hasOwnProperty(i) && i != s) {
        //
        //   }
        // }
      }

      var prettyjson = require("prettyjson");
      console.log(JSON.stringify(obj, null, 2));
    }
  };
})();
