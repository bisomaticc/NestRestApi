# NestRestApi

The application implement a nestJS server API communicating with this: https://reqres.in/   
Your REST app should consist of

1. POST /api/users
2. Get /api/users
3. Get /api/users?{id} 
4. Get /api/users?{id}&avatar
5. Post /api/users?{id}&avatar

On the request store the user entry in db. After the creation, send an email and a rabbit event regarding the same.
