const http = require('http')
const express = require('express')
const indexRouter =  require('./routes/index')

const app = express()
app.use((req,res,next)=> {
    console.log("in the middleware")
    next()
})
app.use(indexRouter);
const  server = http.createServer(app)
server.listen(3000)
module.exports = app;