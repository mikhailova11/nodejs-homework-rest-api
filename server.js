const app = require('./app')
const {PORT} =  require('./env')

app.listen(PORT, () => {
  console.log(`Server running. Use our API on port: ${PORT}`)
})
