# Goal
Provide a modern high quality service that facilitiates learning. Users of the service may create posts. A post can either be an offer or a request about learning. User are able to specify a title, a short description, a description, languages and the location of where the learning will take place.

Users are able to rate posts they have taken, and report scam posts. Each user will have a profile, in which they can indicate their contact details and a bio.

# Technologies used:
* Node
* Express
* MongoDB

# Setting up:
* Create a unqiue index on the email field in the `users` collection
* Define the following enviroment variables in a `.env` file located at the root of the project:
  * `PORT` : The port the server will run on.
  * `DB_URI`: .
  * `SECURE_COOKIES`: Ensures the browser only sends cookies over HTTPS. ( true | false )
  * `SMTP_HOST`: e.g. "smtp.gmail.com"
  * `SECURE_SMTP`: if true the connection will use TLS when connecting to server. If false (the default) then TLS is used if server supports the STARTTLS extension. In most cases set this value to true if you are connecting to port 465. For port 587 or 25 keep it false. ( true | false )
  * `SMTP_USERNAME`: ...
  * `SMTP_PASSWORD`: ...
  


  Check https://www.npmjs.com/package/dotenv if you need more info.


# MongoDB Collections:

## Posts

Schema:

```
_id: ObjectId
title: String (3-150)
type: String (offer | request)
author: {name: String, authorId: ObjectId}
languages: [String]
shortDescription: String (50-500 chars)
description: String (50-2000 chars)
location: GeoJSON Object
```
## Users

Schema:

```
_id: ObjectId
email: String
password: String
name: String (3-150)
contact: String (0-1000 chars)
bio: String (0-2000 chars)
```

## Reports

Schema:

```
_id: ObjectId
author: ObjectId(userId)
post: ObjectId(postId)
title: String (3-150)
message: String (50-2000 chars)
```

# RESTFUL API Routes:

## Posts

* ### `GET /posts?queryString` 

    * Query String Params:
        * `q`: Search term
        * `type`: "Offer" | "Request"
        * `author`: Author id

    * Description: returns all posts according to query string.

* ### `GET /posts/:id`

    * Description: get a single post according to the id.


* ### `POST /posts`

    * Description: submits a new post.

* ### `PATCH /posts/:id`

    * Description: updates a single post according to id.

* ### `DELETE /posts/:id` 

    * Description: deletes a post according to id.

## Users

* ### `GET /users` 

    * Description: returns all users.

* ### `GET /users/:id`

    * Description: get a single user according to the id.


* ### `POST /users`

    * Description: submits a new user.

* ### `PATCH /user/:id`

    * Description: updates a single user according to id.

* ### `DELETE /users/:id` 

    * Description: deletes a single user according to id.

## Reports

* ### `GET /Reports?queryString` 

    * Query String Params:
        * `q`: Search term
        * `by`: Author id

    * Description: returns all reports according to query string.

* ### `GET /reports/:id`

    * Description: get a single report according to the id.


* ### `POST /reports`

    * Description: submits a new report.

* ### `PATCH /reports/:id`

    * Description: updates a single report according to id.

* ### `DELETE /reports/:id` 

    * Description: deletes a post according to id.

All posts respond with JSON format, if there is an error then a response with an appropriate html status code is sent with an `errors` object. Containing error messages.
