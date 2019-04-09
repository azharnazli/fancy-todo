MyTodo
===

USAGE
```javascript
npm install
npm run dev
```
Access server port:  3000
Access client port:  8080

### USERS ROUTES

| Routing | HTTP | Header(s) | Body | Response | Description
| -- | -- | -- | -- | -- | -- |
/users/register | POST | none | first_name : String (***required***), last_name : String (***required***), email : String (***required***), password : String (***required***) | Error: Internal server error Success: add new user | Create new user
/users/loginNormal | POST | none | email : String (***required***), password : String (***required***) | Error: Internal server error Success: login user | normal user login
/users/loginGoogle | POST | none |  | Error: Internal server error Success: login google member | google user login

### TODO ROUTES

| Routing | HTTP | Header(s) | Body | Response | Description
| -- | -- | -- | -- | -- | -- |
/addTodo | POST | token | title: STRING (***required***), body: STRING (***required***), due_date: DATE,(***required***) | Error: Internal server error, Validation error, Success: create new todo | create new todo 
/showAll | GET | token | |  Error: Internal server error, Success: Show all todos | Show all todos to user
/finishTask/:todoId| PATCH | token |  | Error: Internal server error, Success: change finish from false to true | change todo to finished
/finishedTask/:todoId | DELETE | token | |  Error: Internal server error, Success: delete finish selected todo | delete todo
/edit/:todoId | PUT | token | title: STRING (required), body: STRING (required), due_date: DATE,(required) | Error: Internal server error, Validation Error, Success: Edit selected todo | Edit selected todo


