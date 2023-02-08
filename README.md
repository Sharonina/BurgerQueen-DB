# Burger Queen API

https://burguerqueenapi.onrender.com

## API Reference: auth

```http
  POST /users/login
```

Request body

```
    {
        "email": "shadmin@test.com",
        "password": "1234abc"
    }
```

#### Responses

| Code  | Message               |
| :---- | :-------------------- |
| `200` | OK                    |
| `400` | All input is required |
| `404` | Invalid credentials   |

## API Reference: admin user

```http
  POST /users/admin
```

#### Headers

```
    adminregisterkey: key value
```

#### Request body

```
    {
        "first_name": "Sharon",
        "last_name": "Test",
        "email": "shadmin@test.com",
        "password": "1234abc",
        "role": "admin",
        "admin": "true",
        "restaurant": {
            "name": "Las Hamburguesitas",
        }
    }
```

| Parameter    | Type      | Description      |
| :----------- | :-------- | :--------------- |
| `first_name` | _string_  | Required         |
| `last_name`  | _string_  | Required         |
| `email`      | _string_  | Required, unique |
| `password`   | _string_  | Required         |
| `role`       | _string_  | Required         |
| `admin`      | _boolean_ |                  |
| `restaurant` | _object_  | ref: restaurant  |

#### Responses

| Code  | Message                                     |
| :---- | :------------------------------------------ |
| `201` | User created                                |
| `400` | All input is required                       |
| `400` | Role must be waiter, chef, admin or manager |
| `409` | User already exist                          |

## API Reference: users

```http
  POST /users
```

#### Headers

```
    authorization: admin token
```

#### Request body

```
    {
        "first_name": "Sharon",
        "last_name": "Test",
        "email": "shachef@test.com",
        "password": "1234abc",
        "role": "chef",
        "admin": "false",
        "restaurant": "63db2d8dd4a39b95d1f7f5eb",

    }
```

| Parameter    | Type      | Description      |
| :----------- | :-------- | :--------------- |
| `first_name` | _string_  | Required         |
| `last_name`  | _string_  | Required         |
| `email`      | _string_  | Required, unique |
| `password`   | _string_  | Required         |
| `role`       | _string_  | Required         |
| `admin`      | _boolean_ |                  |
| `restaurant` | _string_  | ref: restaurant  |

#### Responses

| Code  | Message                                     |
| :---- | :------------------------------------------ |
| `201` | User created                                |
| `400` | All input is required                       |
| `400` | Role must be waiter, chef, admin or manager |
| `409` | User already exist                          |

##

```http
  GET /users
```

#### Headers

```
    authorization: admin token
```

#### Querys

```
    /users?limit=5&page=1
```

| Query   | Type     | Description                      |
| :------ | :------- | :------------------------------- |
| `limit` | _number_ | number of users by page          |
| `page`  | _number_ | page number based on users limit |

#### Responses

| Code  | Message                               |
| :---- | :------------------------------------ |
| `200` | OK                                    |
| `400` | Limit and page must be numbers        |
| `400` | Limit and page must be greater than 1 |

##

```http
  GET /users/:userId
```

#### Headers

```
    authorization: admin token
```

#### Responses

| Code  | Message         |
| :---- | :-------------- |
| `200` | OK              |
| `400` | Invalid user id |
| `404` | User not found  |

##

```http
  PUT /users/:userId
```

#### Headers

```
    authorization: admin token
```

#### Request body

```
    {
        "first_name": "Sharon",
        "last_name": "Test",
        "email": "shachef@test.com",
        "password": "1234abc",
        "role": "chef",
        "restaurant": "63db2d8dd4a39b95d1f7f5eb",
    }
```

| Parameter    | Type     | Description      |
| :----------- | :------- | :--------------- |
| `first_name` | _string_ | Required         |
| `last_name`  | _string_ | Required         |
| `email`      | _string_ | Required, unique |
| `password`   | _string_ | Required         |
| `role`       | _string_ | Required         |
| `restaurant` | _string_ | ref: restaurant  |

#### Responses

| Code  | Message                                     |
| :---- | :------------------------------------------ |
| `200` | User updated                                |
| `400` | Invalid user id                             |
| `400` | Role must be waiter, chef, admin or manager |
| `404` | User not found                              |

##

```http
  DELETE /users/:userId
```

#### Headers

```
    authorization: admin token
```

#### Responses

| Code  | Message         |
| :---- | :-------------- |
| `200` | Deleted user    |
| `400` | Invalid user id |
| `404` | User not found  |

## API Reference: restaurants

```http
  POST /restaurants
```

#### Headers

```
    authorization: admin token
```

#### Request body

```
    {
        "name": "Las hamburguesitas"
    }
```

| Parameter | Type     | Description |
| :-------- | :------- | :---------- |
| `name`    | _string_ | Required    |

#### Responses

| Code  | Message               |
| :---- | :-------------------- |
| `201` | Restaurant created    |
| `400` | All input is required |

##

```http
  GET /restaurants/:restaurantId
```

#### Headers

```
    authorization: admin token
```

#### Responses

| Code  | Message               |
| :---- | :-------------------- |
| `200` | OK                    |
| `400` | Invalid restaurant id |
| `404` | Restaurant not found  |

##

```http
  PUT /restaurants/:restaurantId
```

#### Headers

```
    authorization: admin token
```

#### Request body

```
    {
        "name": "Las hamburguesotas",
    }
```

| Parameter | Type     | Description |
| :-------- | :------- | :---------- |
| `name`    | _string_ | Required    |

#### Responses

| Code  | Message               |
| :---- | :-------------------- |
| `200` | Restaurant updated    |
| `400` | Invalid restaurant id |
| `404` | Restaurant not found  |

##

```http
  DELETE /restaurants/:restaurantId
```

#### Headers

```
    authorization: admin token
```

#### Responses

| Code  | Message               |
| :---- | :-------------------- |
| `200` | Deleted restaurant    |
| `400` | Invalid restaurant id |
| `404` | Restaurant not found  |

## API Reference: products

```http
  POST /products
```

#### Headers

```
    authorization: admin token
```

#### Request body

```
    {
        "name": "hot dog",
        "price": "150",
        "type": "alimentos",
        "image": "https://thumbs.dreamstime.com/b/homemade-detroit-style-chili-dog-rustic-wooden-board-black-surface-side-view-close-up-homemade-detroit-style-chili-dog-156599438.jpg",
        "restaurant": "63e131ceb2fba17a85ebf9be"
    }
```

| Parameter    | Type     | Description      |
| :----------- | :------- | :--------------- |
| `name`       | _string_ | Required, unique |
| `price`      | _number_ | Required         |
| `type`       | _string_ | Required         |
| `image`      | _url_    | Required         |
| `restaurant` | _string_ | ref: restaurant  |

#### Responses

| Code  | Message               |
| :---- | :-------------------- |
| `201` | Product created       |
| `400` | All input is required |
| `400` | Invalid restaurant id |
| `404` | Restaurant not found  |
| `409` | Product already exist |

##

```http
  GET /products
```

#### Headers

```
    authorization: user token
```

#### Querys

```
    /products?limit=5&page=1
```

| Query   | Type     | Description                      |
| :------ | :------- | :------------------------------- |
| `limit` | _number_ | number of users by page          |
| `page`  | _number_ | page number based on users limit |

#### Responses

| Code  | Message                               |
| :---- | :------------------------------------ |
| `200` | OK                                    |
| `400` | Limit and page must be numbers        |
| `400` | Limit and page must be greater than 1 |

##

```http
  GET /products/:productId
```

#### Headers

```
    authorization: user token
```

#### Responses

| Code  | Message            |
| :---- | :----------------- |
| `200` | OK                 |
| `400` | Invalid product id |
| `404` | Product not found  |

##

```http
  PUT /products/:productId
```

#### Headers

```
    authorization: admin token
```

#### Request body

```
    {
        "name": "hot dog mini",
        "price": "100",
        "type": "alimentos",
        "image": "https://thumbs.dreamstime.com/b/homemade-detroit-style-chili-dog-rustic-wooden-board-black-surface-side-view-close-up-homemade-detroit-style-chili-dog-156599438.jpg",
    }
```

| Parameter | Type     | Description      |
| :-------- | :------- | :--------------- |
| `name`    | _string_ | Required, unique |
| `price`   | _number_ | Required         |
| `type`    | _string_ | Required         |
| `image`   | _url_    | Required         |

#### Responses

| Code  | Message               |
| :---- | :-------------------- |
| `201` | Product updated       |
| `400` | Invalid restaurant id |
| `404` | Product not found     |

##

```http
  DELETE /products/:productId
```

#### Headers

```
    authorization: admin token
```

#### Responses

| Code  | Message            |
| :---- | :----------------- |
| `200` | Deleted product    |
| `400` | Invalid product id |
| `404` | Product not found  |
