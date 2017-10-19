## keeptime
# A hierarchical time manager for Bash in Node.js

This is a rather convoluted system of time management and task organization based around an atom called a "session". These sessions are part of tasks, which are atoms of tags. This structure enabled interesting things like to-do lists and tracking time analytics for any arbitrary tag.

## TODO
# Necessary
- [x] Start Time
- [x] Cancel Time
- [x] Stop Time
- [ ] Display All
- [x] Add Session
- [ ] Add Tag
- [ ] Show Times in Tag
- [ ] Remove Session
- [ ] Remove Tag
- [ ] Total Time in Tag
- [ ] Run from Bash
- [ ] Autocomplete
# Optional
- [ ] Add Include
- [ ] Remove Include
- [ ] Add Sequence
- [ ] Remove Sequence

JSON Structure:
Reserved words: "include", "sequence"
Define a task as an element such that its key is not a reserved word and its value is an array. Each non-task is essentially a namespace.
i.e. with
"foo": {
  "include": [],
  "bar": []
}
/foo is the tag containing all elements of foo
/foo/bar is the task
/foo/include lists links to other elements, referenced e.g. "project/src"

AddSession adds a session to a task, where a session is defined e.g.
```json
{
  "start": "2017-10-16T14:54:00.000Z",
  "stop": "2017-10-16T14:57:00.000Z",
  "msg": "Message"
}
```

AddTag <tagname> adds the tag tagname with a blank include. Note that tagname can be of the form /first/second, in which case nested tags are indicated. Remember that nested tags are simply namespaced objects i.e. they have no significance except providing shorthand for long-written names.

AddInclude <tagname> <include/dir> adds the include to tagname

Sequences are an ordering on the elements of a tag and are indicted in the following format:
"sequence": ["first", ["second-1", "second-2"], "third"]
where "second-1" and "second-2" can be completed in any order.
If an element has the property "completed", the element is able to be completed. Any task is automatically completable, and tags may or may not be completable. A tag is completed if all completable children are completed. This enables a to-do list structure.

Example file:
```json
{
  "books": {
    "include": ["chinese/englishbook"],
    "the-jungle": [],
    "guns-germs-and-steel": [],
  },
  "newspaper": [],
  "sleep": [],
  "breakfast": [],
  "lunch": [],
  "dinner": [],
  "chinese": {
    "lessons": {
      "1": [],
      "2": []
    },
    "englishbook": []
  },
  "learnopengl.com": {
    "hello-triangle": [{
        "start": "2017-10-16T14:54:00.000Z",
        "stop": "2017-10-16T14:57:00.000Z",
        "msg": ""
      },
      {
        "start": "2017-10-16T15:00:00.000Z",
        "stop": "2017-10-16T15:11:00.000Z",
        "msg": ""
      }
    ]
  },
  "read": {
    "include": ["newspaper", "books"]
  },
  "computer-science": {
    "include": ["opengl", "ctf", "c++", "node.js"]
  },
  "to-do": {
    "include": ["learnopengl.com/hello-triangle", "chinese/lessons/1"]
  }
}
```

# New format thoughts
Same indictes improvements in efficiency by separating sessions from tasks by hashing
"AddSession: Same
AddTask: Same
AddTag: Same
ViewTag: Same
ViewTimeWithinTag: Same
ViewTimeOverall: before: Search every tag;now: search sessions
DeleteSession: before: use array indices ? now : display under tag or time period,
then choose has to delete
Delete task: same
delete tag: same

Separation of sessions from tasks allows sorting by time
while maintaining fast lookup.It also allow convenient deletion.
AddSession: Add hashed session w / task element,
add link to task list
AddTask: Add to tag
AddTag: Add tag
Today: show sessions today.Log(n)
Sessions over a time period: now,
no need to search entire space.Search over sessions.Log(n)
Tag: Same as before
Session tag: ": {}
