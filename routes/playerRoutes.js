const { Router } = require('express')
const playerRoutes = Router()
const playerController = require('../controllers/playerController')

const links = [
    { href: '/', text: 'Home'},
    { href: '/players', text: 'Players'},
    { href: '/clubs', text: 'Clubs'},
    { href: '/contracts', text: 'Contracts'},
    { href: '/listings', text: 'Listings'},
    { href: '/transfers', text: 'Transfers'},
]

playerRoutes.get('/', (req, res) => res.render('index', { links: links }))


// playerRoutes.get('/', playerController.getSelection)
playerRoutes.get('/players', playerController.getPlayers)
playerRoutes.get('/clubs', playerController.getClubs)

module.exports = playerRoutes