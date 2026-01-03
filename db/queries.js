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

const toNull = (v) => (v === '' || v === undefined ? null : v);

async function createNewPlayer({ full_name, nationality, height_cm, preferred_foot, birth_date }) {
    const foot = toNull(preferred_foot)?.trim().toLowerCase()
    const safeFoot = foot && ['right', 'left', 'both'].includes(foot) ? foot : null
    return pool.query(
        `
        INSERT INTO players (full_name, nationality, height_cm, preferred_foot, birth_date)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [
        full_name,
        toNull(nationality),
        toNull(height_cm) ? Number(height_cm) : null,
        safeFoot,
        toNull(birth_date)
        ]
    );
}


module.exports = {
    getAllPlayers,
    getAllClubs,
    getAllListings,
    getAllTransfers,
    getAllContracts,
    createNewPlayer
}