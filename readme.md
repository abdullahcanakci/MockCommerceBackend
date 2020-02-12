# Info

Backend application for [MockCommerce](https://github.com/abdullahcanakci/MockCommerce) demo app.

# What does it use?

Framework used is ExpressJS,

Database is handled by MongoDB and ODM is mongoose,

Database is stored on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

bcrpyt for hashing and checking passwords,

jsonwebtoken for generation of user tokens and retrieval of info from tokens.

## Environment Variables

```
MONGODB_URI=<mongodb connection url>
PORT=3000
TOKEN_SECRET=<secret for jwt web token>
ADMIN_AUTH=<secret for admin authorization>
```

## Auth

User auth method is JWT with response 

```json
{
	"token": "<key>"
}
```

Requested key delivery method is Header payload

```
Authorization: bearer <key>
```

For admin purposes for adding a category, product etc. authorization is handled by JSON parameter. This key is retrieved from environment variables named "ADMIN_AUTH".

```json
{
	"auth_key": "<key>",
	<!--
	properties.
	-->
}
```

## Endpoints

All endpoints reside within `*/api/` path.

### `POST /login`

User login authentication and token response handled here.

Request should conform to JSON file below.

```
{
	"email": "<user email>",
	"password": "<user password>"
}
```

If supplied credentials are valid response below will be supplied with status code 200

```
{
	"token": "<user session token>"
}
```

If a field is missing `{"error": "insufficient data to login"}`will be returned.

If credentials are invalid `{"error": "wrong credentials"` response with status code 401 will be returned.

### `GET /categories/`

### `GET /categories/:id`

All products reside within provided category id will be returned.

If a category can't be found `{"error": "no category by id"}`response with status code 404 will be returned.

### `POST /categories`

To be use for adding a new category. Newly created category will be returned.

```json
{
  "auth_key": "<admin auth key>",
  "name": "Kitap",
  "description": "En yeni kitaplar",
  "image": "i_5.png"
}
```

### `POST /categories/:id`

To be used for adding a product to a category.

```
{
  "auth_key": "<admin auth key>",
  "product_id": "<product id>"
}
```

### `GET /products`

To get all products should only be used for either small databases or debug systems.

### `GET /products/:id`

Get a product by id, if not found a response status of 404 will be returned.

```json
{
    "id": "5e3d2a4e97fb98286804c225",
    "name": "Bambung Televizyon",
    "price": 1950,
    "oldPrice": 1600,
    "images": [
        "i_2.png",
        "i_7.png",
        "i_1.png"
    ],
    "categories": [
        "5e3d2a3c97fb98286804c224"
    ]
}
```



### `POST /products`

To be use for adding a new product. Newly created product will be returned with 201 status code.

```json
{
  "auth_key": "<admin auth key>",
  "name": "Körlük",
  "price": 22.50,
  "oldPrice": 27.50, <!-- Can be omitted -->
  "images": [
    "i_4.png",
    "i_1.png"
    <!-- Product images should be uploaded to /public/images directory beforehand. Server does not have any capability for file upload. -->
  ],
  "categories": [
    "<category id>"
  ]
}
```

### `POST /user`

Will be used for registering new users. Email must be unique. 

```json

{
  "name": "Abdullah",
  "surname": "C",
  "password": "123456",
  "email": "ac@mail",
  "phone": "0123 456 78"
}
```

----

Endpoints below here requires client to provide session token.  Otherwise all call will return with 401 code.

### `GET /user`

Responds with user information to be displayed.

```json
{
  "name": "Abdullah",
  "surname": "C",
  "email": "ac@mail",
  "phone": "0123 456 78",
  "id": "5e3d55d5ba314a32b4f3c511"
}
```

### `GET /user/addresses`

Responds with an array of addresses, empty array if the user has none.

### POST /user/addresses

For adding a new address.

```json
{
  "title": "Ev",
  "receiver": "Abdullah C",
  "phoneNumber": "0123 456 78 90",
  "address": "Açık adres",
  "city": "Ankara",
  "district": "Merkez",
  "selected": true <!-- Has no effect right now -->
}
```

### `GET /user/basket`

To retrieve user basket. Response will be an array of products. This endpoint is not optimized might take long time for highly populated lists.

### ```POST /user/basked/:id/:amount```

For adding a product to the basket. Amount may be omitted which only 1 item will be added.

### ```GET /user/postponed```

Retrieve user postponed.

### ```POST /user/postponed/:id```

Add to postponed list.

### ```GET /user/orders/:id```

Retrieve user orders. Id may be omitted which returns all orders. For request with id only one order will be returned, no array.

```json
[
    {
      "date": "2020-02-11T16:25:54.515Z",
      "items": [
        {
          "amount": 1,
          "price": 1769,
          "id": "5e42d592fb2b751ca2481e2a"
        },
        {
          "amount": 2,
          "price": 170,
          "id": "5e42d592fb2b751ca2481e2b"
        },
        {
          "amount": 1,
          "price": 39,
          "id": "5e42d592fb2b751ca2481e2c"
        }
      ],
      "total": "1260.75",
      "id": "5e42d592fb2b751ca2481e29"
    },
]
```



### ```POST /user/orders```

For creating a new orders.

```json
{
  "total": 1260.75,
  "billingAddress": "<address id>",
  "shippingAddress": "<address id>",
  "items": [
    {
      "id": "5e3d2a4e97fb98286804c225",
      "price": 1769.0,
      "amount": 1
    },
    {
      "id": "5e3d2bc997fb98286804c228",
      "price": 170.0,
      "amount": 2
    },
    {
      "id": "5e3d304297fb98286804c22c",
      "price": 39,
      "amount": 1
    }
  ]
}

```

