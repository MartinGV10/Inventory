const express = require('express')
const app = express()
const path = require('node:path')

app.set('view', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.set(express.urlencoded({ extended: true }))

const PORT = process.env.port || 3000

app.listen(PORT, (error) => {
    if (error) {
        throw error
    }
    console.log(`Server open at http://localhost:${PORT}`)
})