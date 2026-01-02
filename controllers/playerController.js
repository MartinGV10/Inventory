const db = require('../db/queries')

async function getPlayers(req, res) {
    const players = await db.getAllPlayers()
    console.log(`Player -> ${players}`)
    res.send(`Players -> ${players.map(player => player.full_name)}`)
}

async function getClubs(req, res) {
    const clubs = await db.getAllClubs()
    console.log(`Club -> ${clubs}`)
    res.send(`Club -> ${clubs.map(club => club.name)}`)
}

async function getListings(req, res) {
    const listings = await db.getAllListings()
    console.log(`Listing -> ${listings}`)
    res.send(`Listing -> ${listings.map(listing => listings.min_price)}`)
}

async function getTransfers(req, res) {
    const trasnfers = await db.getAllTransfers()
    console.log(`Trasnfer -> ${trasnfers}`)
    res.send(`Trasnfer -> ${trasnfers.map(trasnfer => trasnfer.fee)}`)
}

async function getContracts(req, res) {
    const contracts = await db.getAllContracts()
    console.log(`Contract -> ${contracts}`)
    res.send(`Contract -> ${contracts.map(contract => contract.shirt_number)}`)
}

// function getSelection(req, res) {
//     res.render('index', {
//         title: 'Hi'
//     })
// }

module.exports = {
    getPlayers,
    getClubs,
    getContracts,
    getTransfers,
    getListings,
    // getSelection
}