const categoriesRouter = require('express').Router()
const Product = require('../models/product')
const Category = require('../models/category')
const logger = require('../utils/logger')

categoriesRouter.get('/', async (request, response, next) => {
  try {
    const categories = await Category.find({})
    response.json(categories.map(e => e.toJSON()))
  } catch (error) {
    next(error)
  }
})

categoriesRouter.get('/:id', async (request, response, next) => {
  const id = request.params.id

  if (id) {
    try {
      const category = await Category.findById(id)
      if (category) {
        const responseList = await Product
          .find()
          .where('_id')
          .in(category.products)
        response.json(responseList.map(e => e.toJSON())).end()
      } else {
        response.status(404).send({error: 'no category by id'}).end()
      }
    } catch (exception) {
      next(exception)
    }
  } else {
    response.status(400)
  }
})

categoriesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const auth_key = body.auth_key

  if (auth_key == process.env.ADMIN_AUTH) {
    const category = new Category({
      name: body.name,
      items: 0,
      image: body.image,
      description: body.description,
      products: []
    })

    const savedCategory = await category.save()
    response.json(savedCategory.toJSON()).end()
  } else {
    response.status(401)
  }
})

categoriesRouter.post('/:id', async (request, response, next) => {
  const id = request.params.id
  const auth_key = body.auth_key
  const product_id = body.product_id

  if (id && product_id) {
    if (auth_key == process.env.ADMIN_AUTH) {
      const category = await Category.findById(id)
      category.products.push(product_id)
      category.items += 1
      const savedCategory = await category.save()

      const product = await Product.findById(product_id)
      product.categories.push(category._id)
      await product.save()

      response.json(savedCategory.toJSON()).end()
    } else {
      response.status(401)
    }

  } else {
    response.status(400)
  }
})


module.exports = categoriesRouter