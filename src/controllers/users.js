const bcrpyt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Address = require('../models/address')
const Product = require('../models/product')
const Basket = require('../models/basket')
const Order = require('../models/order')
const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')

/*
 *  REGISTER
 */
usersRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body

    const passHash = await bcrpyt.hash(body.password, 10)

    const user = new User({
      name: body.name,
      surname: body.surname,
      passwordHash: passHash,
      email: body.email,
      phone: body.phone
    })

    await user.save()

    response
      .status(200)
      .json(user.toJSON())
      .end()
  } catch (exception) {
    next(exception)
  }
})

/*
 * RETRIEVING USER INFO
 */

usersRouter.get('/', async (request, response, next) => {
  const body = request.body
  const token = request.token

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)
    response.status(201).json(user.toJSON())
  } catch (error) {
    next(error)
  }
})

/*
 * RETRIEVE ADRESSES
 */

usersRouter.get('/addresses', async (request, response, next) => {
  const token = request.token

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)
    const addr = user.addresses
    if (!addr) {
      addr = []
    }
    response
      .status(201)
      .json(user.addresses.map(e => e.toJSON()))
      .end()
  } catch (error) {
    next(error)
  }
})

/*
 * ADD NEW ADDRESS
 */
usersRouter.post('/addresses', async (request, response, next) => {
  const token = request.token
  const body = request.body

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const address = new Address({
      title: body.title,
      receiver: body.receiver,
      address: body.address,
      phoneNumber: body.phoneNumber,
      city: body.city,
      district: body.district,
      selected: body.selected
    })

    const user = await User.findById(decodedToken.id)
    user.addresses.push(address)
    await user.save()
    response.status(200).end()
  } catch (error) {
    next(error)
  }
})

/*
 * RETRIEVE USER BASKET
 */
usersRouter.get('/basket', async (request, response, next) => {
  const token = request.token

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const responseList = []

    await Promise.all(
      user.basket.map(async basketModel => {
        const c = await Product.findById(basketModel.product)
        if (c) {
          c.amount = basketModel.amount
          responseList.push(c)
        }
      })
    )

    response.status(201).json(responseList.map(e => e.toJSON()))
  } catch (error) {
    next(error)
  }
})

/*
 * ADD TO BASKET
 */
usersRouter.post('/basket/:id', async (request, response, next) => {
  const token = request.token
  const id = request.params.id

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    if (!id) {
      return response.status(401).json({ error: 'invalid product id' })
    }

    const user = await User.findById(decodedToken.id)

    var handled = false
    user.basket.map(basketItem => {
      if (basketItem.product === id) {
        basketItem.amount = amount
        handled = true
      }
    })
    if (!handled) {
      user.basket.push(Basket({ product: id, amount: 1 }))
    }
    await user.save()
    const product = await Product.findById(id)
    response
      .status(200)
      .json(product.toJSON())
      .end()
  } catch (error) {
    next(error)
  }
})

/*
 * ADD TO BASKET
 */
usersRouter.post('/basket/:id/:amount', async (request, response, next) => {
  const token = request.token
  const id = request.params.id
  const amount = request.params.amount

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    if (!product_id) {
      return response.status(401).json({ error: 'invalid product id' })
    }

    const user = await User.findById(decodedToken.id)

    var handled = false
    user.basket.map(basketItem => {
      if (basketItem.product === product_id) {
        basketItem.amount = amount
        handled = true
      }
    })
    if (!handled) {
      user.basket.push(Basket({ product: id, amount: amount }))
    }
    await user.save()
    response.status(200).end()
  } catch (error) {
    next(error)
  }
})

/*
 * RETRIEVE USER POSTPONED
 */
usersRouter.get('/postponed', async (request, response, next) => {
  const token = request.token

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const responseList = []

    await Promise.all(
      user.postponed.map(async productId => {
        const c = await Product.findById(productId)
        if (c) {
          responseList.push(c)
        }
      })
    )

    response
      .status(201)
      .json(responseList.map(e => e.toJSON()))
      .end()
  } catch (error) {
    next(error)
  }
})

/*
 * ADD TO POSTPONED
 */
usersRouter.post('/postponed/:id', async (request, response, next) => {
  const token = request.token
  const product_id = request.params.id

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    if (!product_id) {
      return response.status(401).json({ error: 'invalid product id' })
    }

    const user = await User.findById(decodedToken.id)

    user.postponed.push(product_id)

    await user.save()
    response.status(200).end()
  } catch (error) {
    next(error)
  }
})

usersRouter.get('/orders', async (request, response, next) => {
  const token = request.token

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)
    const orders = user.orders

    response.json(user.orders.map(e => e.toJSON())).end()
  } catch (error) {
    next(error)
  }
})

usersRouter.get('/orders/:id', async (request, response, next) => {
  const token = request.token
  const order_id = request.params.id

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)
    const order = user.orders.filter(order => {
        return order._id == order_id
      }).pop()

      logger.info(order)
    if (order) {
      response.status(200).json(order.toJSON()).end
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.post('/orders', async (request, response, next) => {
  const token = request.token
  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const body = request.body

    const user = await User.findById(decodedToken.id)

    const order = new Order({
      total: body.total,
      billingAddress: body.billingAddress,
      shippingAddress: body.shippingAddress,
      items: body.items
    })
    logger.info(order)
    user.orders.push(order)
    await user.save()
    return response.status(200).end
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter
