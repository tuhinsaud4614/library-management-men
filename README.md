# Library Management Rest APi
The project is using technology like Express Js And MongoDB.

## ForSetup
``` npm install ```

## Swagger Links
> https://final-library-management.herokuapp.com/api-docs/

## User endpoint
> https://final-library-management.herokuapp.com/user/signup \
> https://final-library-management.herokuapp.com/user/signin

### User required data 
> (For Signup) email, password, userType (librarian, student) \
> (For Sign) email, password

## Book (Librarian) Endpoint
> https://final-library-management.herokuapp.com/book/add \
> https://final-library-management.herokuapp.com/book/update/:id \
> https://final-library-management.herokuapp.com/book/delete/:id \
> https://final-library-management.herokuapp.com/book/status/:id

### Book required data 
> (For add) bookName, author, genre, releaseDate, bookImage \
> (For update status) status (true or false)

## Book (Student) Endpoint
> https://final-library-management.herokuapp.com/book (All books) \
> https://final-library-management.herokuapp.com/book/:id (Single book)

