let DatabaseTemplate1 = {
  Teams: [
    "id",
    "team name",
    members = [ [ 'id', "role" ] ],
    channels = [ [
      'channel id',
      "channel name",
      tasks = [ [ "id", "title", "desc", "priority", "assigneeID", "reporterID" ] ],
    ] ],

  ],
  Users: [
    "id",
    "name",
    "email",
    "joined Teams" = [ [ "id", "name", "role in that team" ] ]
  ]

};

let DatabaseTemplate2 = {
  Teams: [
    "id",
    "team name",
    members = [ [ "id", "role", "name" ] ]
  ],
  Users: [
    "id",
    "name",
    "email",
    "joined Teams" = [ [ "id", "role in that team" ] ]
  ],
  Channels: [
    "id",
    "name",
    "Parent Team ID"
  ],
  Tasks: [
    "id",
    "title",
    "desc",
    "assignee",
    "reporter",
    "priority",
    "parent Channel ID"
  ]

};