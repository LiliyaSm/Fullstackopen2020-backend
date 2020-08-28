## Phonebook application

Application is hosted on Heroku:
http://frozen-bayou-48281.herokuapp.com

**Frontend**: React frontend from another part of Fullstackopen course: https://github.com/LiliyaSm/Fullstackopen2020/tree/master/part2/phonebook

**Database**: MongoDB, provider is [MongoDB Atlas](https://cloud.mongodb.com).


## Api:

`/info`
returns the number of entries in the Phonebook and the time that the request was received

`/api/persons`
returns a JSON list of entries

`/api/persons/:id`
returns JSON person's entry with the correspondent ID if exists.
