const pool = require('./pool')

async function getAllPlayers() {
    const { rows } = await pool.query('SELECT * FROM players')
    return rows
}

async function getAllClubs() {
    const { rows } = await pool.query('SELECT * FROM clubs')
    return rows
}

async function getAllListings() {
    const { rows } = await pool.query('SELECT * FROM listings')
    return rows
}

async function getAllTransfers() {
    const { rows } = await pool.query('SELECT * FROM transfers')
    return rows
}

async function getAllContracts() {
    const { rows } = await pool.query('SELECT * FROM player_club_contracts')
    return rows
}

module.exports = {
    getAllPlayers,
    getAllClubs,
    getAllListings,
    getAllTransfers,
    getAllContracts
}