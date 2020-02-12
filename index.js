const app = require('./src/app')
const https = require('http')
const config = require('./src/utils/config')
const logger = require('./src/utils/logger')

const server = https.createServer(app)

server.listen(config.PORT, () => {
  logger.info(`Server is running on port ${config.PORT}`)
})