=> created a server using express
=> splitted the code into multiple files for readability
=> installed mongoose npm package to use mongodb as a databse in this project to establish a connection to mongodb atlas we need mongoose
=> installed dotenv for environment variables configuration(to access env var inside file)

//auth user
=> for user authentication i implemented two function one is to register the user into the app, another one is to login the user into the app
=> used jsonwebtoken npm package to create/generate a web token which will help in future for autherization purpose
=> used bcrypt npm package to hash/secure the password which is to be stored in db
=> used validator npm package to validate the email and password in the app, like checking email format and password format. For password it should contain "length 8 or more charaters, 1 uppercase letter, 1 special symbol" using validator.isStrongPassword() Method
