
# GraphQL Mini-App

A Mini-App that allows you to create a list of people with basic data (name, phone, street, and city). It also has an Authentication and the possibility of adding friends.




## API and Client startup instruction

First, install all dependencies with npm (In their respective folders)

**Note:** The "API" folder is a classic server created with json-web server, the API created with GraphQL is inside the "graphql_server" folder. 
```bash
  npm install 
```

Second, run the API with:
```bash
  npm run start
```
For the Client use:
```bash
  npm run dev
```
## API Environment Variables

To run this project, you will need to add the following environment variables to your .env file in "API" or "graphql_server" folder

`DB_URL`

`JWT_SECRET`


## Extra

In your port 4000 you will find the GraphQL Sandbox
