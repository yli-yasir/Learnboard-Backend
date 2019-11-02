# Technologies used:
* Node
* Express
* MongoDB

# MongoDB Collections:

## Posts

Schema:

```
_id: ObjectId
title: String (3-150)
type: String (Offer | Request)
author: {name: String, authorId: ObjectId}
languages: [String]
shortDescription: String (50-500 chars)
description: String (50-2000 chars)
```
## Users

Schema:

```
_id: ObjectId
name: String (3-150)
contact: String (50-1000 chars)
bio: String (0-2000 chars)
```

## Reports

Schema:

```
_id: ObjectId
author: ObjectId(userId)
post: ObjectId(postId)
title: String (3-150)
message: String (0-2000 chars)
```

# RESTFUL API Routes:

## Posts

* ### `GET /posts?queryString` 

    * Query String Params:
        * `q`: Search term
        * `postType`: "Offer" | "Request"
        * `by`: Author id

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