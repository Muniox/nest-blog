# nest-blog

## Table of content

- [General Info](https://github.com/Muniox/blog-megak-back/blob/develop/README.md#general-info)
- [Demo](https://github.com/Muniox/blog-megak-back/blob/develop/README.md#demo)
- [Technologies/frameworks/libraries used on back-end side of project](https://github.com/Muniox/blog-megak-back/blob/develop/README.md#technologiesframeworkslibraries-used-on-front-end-side-of-project)
- [Routes](https://github.com/Muniox/blog-megak-back/tree/develop#routes)
- [How to test api](https://github.com/Muniox/blog-megak-back/blob/develop/README.md#how-to-test-api)
- [How to make user with admin privilage]()
- [What has been accomplished](https://github.com/Muniox/blog-megak-back/blob/develop/README.md#what-has-been-accomplished)
- [What has not been accomplished](https://github.com/Muniox/blog-megak-back/blob/develop/README.md#what-has-not-been-accomplished)
- [How to run api](https://github.com/Muniox/blog-megak-back/blob/develop/README.md#how-to-run-api)
- [Link to front-end]()

## General info

A blog api built on the Nest.js framework. It was created to try its hand at implementing jwt authentication using a refresh token. Below I present the full range of implemented functionality.

## Demo

Api is in the process of being implemented on the server

## Technologies/frameworks/libraries used on back-end side of project

MySQL, Node.js, Express.js, Nest.js

## Routes

#### user

DELETE /user
PATCH /user

#### admin-panel

POST /admin-panel/user
GET /admin-panel/user
GET /admin-panel/user/logout/{id}
GET /admin-panel/user/user/{id}
PATCH /admin-panel/user/{id}
DELETE /admin-panel/user/{id}
PATCH /admin-panel/post/{id}
DELETE /admin-panel/post/{id}

#### auth

POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/refresh

#### post

POST /post/upload
GET /post
GET /post/image/{filename}
GET /post/{id}
PATCH /post/{id}
DELETE /post/{id}

### How to test api

#### Swagger docs

http://localhost:3000/api

#### http-requests

In folder are implemented http request for VS code (REST client extension needed)

### How to make user with admin privilage

### What has been accomplished

- [x] Authentication
- [x] Authorization (JWT refresh-token)
- [x] Asynchronous api (non blocking requests)
- [x] Databse connection
- [x] Entity Repository pattern
- [x] CRUD posts
- [x] admin panel
- [x] Permision scope for user/admin
- [x] Verifying environment variables in the .env file
- [x] File storage on server
- [x] Hashing passwords and refresh-token(argon2)
- [x] Error handling
- [x] Development/Production mode (NODE_ENV)
- [x] strategy for limiting network traffic (@nestjs/throttler)
- [x] Helmet (Helmet can help protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately)
- [x] CORS (Cross-origin resource sharing (CORS) is a mechanism that allows resources to be requested from another domain)
- [x] Swagger documentation
- [x] Sanitizing post description and title provided in body request (sanitize-html)
- [x] setup TypeORM migrations
- [x] simple docker prod/dev setup

## What has not been accomplished on the back-end

- [ ] Unit tests are incomplete due to a lack of time
- [ ] no 403 error for route /post/image/{filename} (route guard setup)
- [ ] creation of list post category with CRUD options

## How to run api

go to api directory and run

```
$ docker compose up
```

this command will run developer deocker setup

## Front-end

Not implemented yet
