# Library Management Rest APi
The project is using technology like Express Js And MongoDB.

## ForSetup
``` npm install ```

## User endpoint
> https://tuhin-library-management.herokuapp.com/user/signup \
> https://tuhin-library-management.herokuapp.com/user/signin

### User required data 
> (For Signup) email, password, userType (librarian, student) \
> (For Sign) email, password

## Book (Librarian) Endpoint
> https://tuhin-library-management.herokuapp.com/book/add \
> https://tuhin-library-management.herokuapp.com/book/update/:id \
> https://tuhin-library-management.herokuapp.com/book/delete/:id \
> https://tuhin-library-management.herokuapp.com/book/status/:id

### Book required data 
> (For add) bookName, author, genre, releaseDate, bookImage \
> (For update status) status (true or false)

## Book (Student) Endpoint
> https://tuhin-library-management.herokuapp.com/book (All books) \
> https://tuhin-library-management.herokuapp.com/book/:id (Single book)

