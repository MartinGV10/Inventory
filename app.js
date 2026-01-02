const express = require('express')
const app = express()
const path = require('node:path')
const playerRoutes = require('./routes/playerRoutes')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.set(express.urlencoded({ extended: true }))

const assetsPath = path.join(__dirname, 'public')
app.use(express.static(assetsPath))

app.use('/', playerRoutes)

const PORT = process.env.port || 3000

app.listen(PORT, (error) => {
    if (error) {
        throw error
    }
    console.log(`Server open at http://localhost:${PORT}`)
})