# ecovia

## Setup

Make sure to follow all these steps exactly as explained below. Do not miss any steps or you won't be able to run this application.

### Install MongoDB

To run this project, you need to install the latest version of MongoDB Community Edition first.

https://docs.mongodb.com/manual/installation/

Once you install MongoDB, make sure it's running.

### Install the Dependencies

Next, from the project folder, install the dependencies:

    npm i

### Set Environment variable

Create one .env file in the root directory of your project. Add environment-specific variables on new lines in the form of NAME=VALUE. 

```dosini
PORT = your_port_number
MONGO_CONNECTION_URL = your_mongodb_url
```

### Start the Server

    node index.js

This will launch the Node server on port 5000. If that port is busy, you can set a different point in .env file.


### Postman collection

You can import postman api collection using below link.

https://www.getpostman.com/collections/a319989e9ff38416d86e

Notes:-
1) Please set environment as local in your postman collection before testing apis.
2) In local environment make one variable called 'token' and set initial and current value as token value returned in sign-in api response.
3) Please sign-up first and after that please sign-in with same credentials so jwt token will be set in environment variable.

### APIs

1) /sign-up
-> Ecovian can be created using name, email and password. I also put email validation and email must be unique. For password, It must contain atleast 6 characters.

2) /sign-in
-> Ecovian can sign-in into system using email and password. After sign-in JWT token will be generated.

3) /create-store
-> Ecovian can create store using store name, address, userId(ecovian who is creating this store).

4) /stores
-> Ecovian can see all of its store by providing his userId.

5) /create-bag
-> Ecovian can create bag by providing size, weight, color, area(value must be DAMAGED or REPAIR or READY otherwise it will generate an error), storeId.

6) /bags
-> Ecovian can see all of its bags by providing storeId and area. 
 Case-1 : If area is not present in request then api will return all bags of that store in response.
 Case-2 : If area has present then api will return response specific to provided area.

7) /delete-bag
-> Ecovian can delete bag by providing bagId. Bag will only be deleted if it is in READY area. Otherwise It will generate error.

8) /update-area
-> Ecovian can update area by providing bagId and newArea which he wants update. Please provide new area from only these values(DAMAGED, REPAIR, READY).

9) /transfer-ownership
-> This api is for transfering stores to another ecovian. In this api ecovian provide oldOwnerId(this means current userId), newOwnerEmail(This is for new ecovian or new owner) and stores. stores is array of store ids which ecovian wants to transfer to new ecovian. We can transfer ownership by just providng new ecovian's email id.
