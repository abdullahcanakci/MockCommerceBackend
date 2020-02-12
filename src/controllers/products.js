const productsRouter = require('express').Router()
const Product = require('../models/product')
const Category = require('../models/category')

productsRouter.get('/', async (request, response, next) => {
  try {
    const products = await Product.find({})
    response.json(products.map(e => e.toJSON()))
  } catch (error) {
    next(error)
  }
})

productsRouter.get('/:id', async (request, response, next) => {
  const id = request.params.id

  if (id) {
    try {
      const product = await Product.findById(id)
      response.json(product.toJSON())
    } catch (exception) {
      next(exception)
    }
  } else {
    response.status(404).end()
  }
})

productsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const auth_key = body.auth_key

  if (auth_key == process.env.ADMIN_AUTH) {
    const product = new Product({
      name: body.name,
      price: body.price,
      oldPrice: body.oldPrice,
      images: body.images,
      categories: body.categories
    })
    const savedProduct = await product.save()
    response.json(savedProduct.toJSON())

    await Promise.all(
      body.categories.map(async categoryId => {
        const c = await Category.findById(categoryId)
        if (c) {
          c.products.push(savedProduct._id)
          c.items += 1
          c.save()
        }
      })
    )

    response.status(201).json(savedProduct.toJSON()).end()
  } else {
    response.status(401).end()
  }
})

module.exports = productsRouter
