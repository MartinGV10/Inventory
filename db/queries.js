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

const toIntOrNull = (v) => {
    const x = toNull(v);
    if (x === null) return null;
    const n = Number(x);
    return Number.isInteger(n) ? n : null;
};



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

async function getPlayerInfo(playerId) {
    const { rows } = await pool.query(`
        SELECT
        -- player core
        p.player_id,
        p.full_name,
        p.birth_date,
        p.nationality,
        p.preferred_foot,
        p.height_cm,
        p.created_at,

        -- positions
        pos.code           AS position_code,
        pos.name           AS position_name,
        pp.is_primary,

        -- contract
        pc.contract_id,
        pc.shirt_number,
        pc.start_date      AS contract_start,
        pc.end_date        AS contract_end,
        pc.is_current,
        c.name             AS club_name,
        c.country          AS club_country,
        c.league           AS club_league,

        -- listing
        l.listing_id,
        l.status           AS listing_status,
        l.asking_price,
        l.min_price,
        l.currency,
        l.notes            AS listing_notes,

        -- transfers
        t.transfer_id,
        t.fee,
        t.transfer_date,
        from_club.name     AS from_club,
        to_club.name       AS to_club,
        t.notes            AS transfer_notes

        FROM players p

        -- positions (many)
        LEFT JOIN player_positions pp
        ON pp.player_id = p.player_id
        LEFT JOIN positions pos
        ON pos.position_id = pp.position_id

        -- contracts (usually 1 current)
        LEFT JOIN player_club_contracts pc
        ON pc.player_id = p.player_id
        LEFT JOIN clubs c
        ON c.club_id = pc.club_id

        -- listing (0–1 active)
        LEFT JOIN listings l
        ON l.player_id = p.player_id

        -- transfers (many)
        LEFT JOIN transfers t
        ON t.player_id = p.player_id
        LEFT JOIN clubs from_club
        ON from_club.club_id = t.from_club_id
        LEFT JOIN clubs to_club
        ON to_club.club_id = t.to_club_id

        WHERE p.player_id = $1
    `, [playerId]);
    return rows;
}

async function updatePlayer(playerId, data) {
    const shirt = toIntOrNull(data.shirt_number);
    const posCode = (data.position || '').trim().toUpperCase();

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        await client.query(
        `UPDATE players
        SET full_name = $1,
            nationality = $2,
            height_cm = $3,
            preferred_foot = $4,
            birth_date = $5
        WHERE player_id = $6`,
        [
            data.full_name,
            data.nationality,
            data.height_cm,
            data.preferred_foot,
            data.birth_date,
            playerId
        ]
        );

        if (shirt !== null && (shirt < 1 || shirt > 99)) {
            throw new Error('Shirt number must be between 1 and 99.');
        }

        await client.query(
            `UPDATE player_club_contracts
            SET shirt_number = $1
            WHERE player_id = $2 AND is_current = TRUE`,
            [shirt, playerId]
        );

        await client.query(
        `DELETE FROM player_positions WHERE player_id = $1`,
        [playerId]
        );

        await client.query(
        `INSERT INTO player_positions (player_id, position_id, is_primary)
        VALUES ($1, (SELECT position_id FROM positions WHERE code = $2), TRUE)`,
        [playerId, data.position]
        );

        await client.query(
        `UPDATE listings
        SET asking_price = $1,
            min_price = $2,
            notes = $3
        WHERE player_id = $4`,
        [
            data.asking_price,
            data.min_price,
            data.notes,
            playerId
        ]
        );

        if (posCode) {
  // optional: ensure exists
  await client.query(
    `INSERT INTO positions (code, name)
     VALUES ($1, $1)
     ON CONFLICT (code) DO NOTHING`,
    [posCode]
  );

  // replace positions
  await client.query(`DELETE FROM player_positions WHERE player_id = $1`, [playerId]);

  await client.query(
    `INSERT INTO player_positions (player_id, position_id, is_primary)
     VALUES ($1, (SELECT position_id FROM positions WHERE code = $2), TRUE)`,
    [playerId, posCode]
  );
}

        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

async function getAllPositions() {
    const { rows } = await pool.query('SELECT * FROM positions')
    return rows
}


module.exports = {
    getAllPlayers,
    getAllClubs,
    getAllListings,
    getAllTransfers,
    getAllContracts,
    getAllPositions,
    createNewPlayer,
    deletePlayer,
    getPlayerInfo,
    updatePlayer
}