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

async function deletePlayer(playerId) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        await client.query('DELETE FROM listings WHERE player_id = $1', [playerId]);
        await client.query('DELETE FROM player_club_contracts WHERE player_id = $1', [playerId]);
        await client.query('DELETE FROM player_positions WHERE player_id = $1', [playerId]);
        await client.query('DELETE FROM transfers WHERE player_id = $1', [playerId]);

        await client.query('DELETE FROM players WHERE player_id = $1', [playerId]);

        await client.query('COMMIT');
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
}

module.exports = {
    getAllPlayers,
    getAllClubs,
    getAllListings,
    getAllTransfers,
    getAllContracts,
    createNewPlayer,
    deletePlayer
}