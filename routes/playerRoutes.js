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
    { href: '/createNew', text: 'Create New Player'},
]

playerRoutes.get('/', (req, res) => res.render('index', { links: links, title: 'Homepage', currentLink: req.path }))


playerRoutes.get('/players', playerController.getPlayers)
playerRoutes.get('/clubs', playerController.getClubs)
playerRoutes.get('/contracts', playerController.getContracts)
playerRoutes.get('/listings', playerController.getListings)
playerRoutes.get('/transfers', playerController.getTransfers)

playerRoutes.get('/createNew', playerController.getCreateNew)
playerRoutes.post('/createNew', playerController.postCreateNew)

playerRoutes.post('/delete', playerController.postDeletePlayer)

module.exports = playerRoutes