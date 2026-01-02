const { Client } = require('pg')

const SQL = `
    INSERT INTO clubs (name, country, league) VALUES
    ('Real Madrid', 'Spain', 'La Liga'),
    ('Manchester City', 'England', 'Premier League'),
    ('Paris Saint-Germain', 'France', 'Ligue 1'),
    ('Bayern Munich', 'Germany', 'Bundesliga'),
    ('Barcelona', 'Spain', 'La Liga');

    INSERT INTO players (full_name, birth_date, nationality, preferred_foot, height_cm)
    VALUES
    ('Jude Bellingham', '2003-06-29', 'England', 'right', 186),
    ('Kylian Mbappé', '1998-12-20', 'France', 'right', 178),
    ('Erling Haaland', '2000-07-21', 'Norway', 'left', 195),
    ('Pedri', '2002-11-25', 'Spain', 'right', 174),
    ('Joshua Kimmich', '1995-02-08', 'Germany', 'right', 177);

    INSERT INTO player_positions (player_id, position_id, is_primary) VALUES
    (1, (SELECT position_id FROM positions WHERE code = 'CM'), TRUE),
    (2, (SELECT position_id FROM positions WHERE code = 'ST'), TRUE),
    (3, (SELECT position_id FROM positions WHERE code = 'ST'), TRUE),
    (4, (SELECT position_id FROM positions WHERE code = 'CM'), TRUE),
    (5, (SELECT position_id FROM positions WHERE code = 'CDM'), TRUE);

    INSERT INTO player_club_contracts
    (player_id, club_id, shirt_number, start_date, end_date, is_current)
    VALUES
    (1, 1, 5, '2023-07-01', '2029-06-30', TRUE),
    (2, 3, 7, '2018-07-01', '2025-06-30', TRUE),
    (3, 2, 9, '2022-07-01', '2027-06-30', TRUE),
    (4, 5, 8, '2020-07-01', '2026-06-30', TRUE),
    (5, 4, 6, '2015-07-01', '2026-06-30', TRUE);

    INSERT INTO listings
    (player_id, selling_club_id, status, currency, asking_price, min_price, notes)
    VALUES
    (1, 1, 'listed', 'EUR', 180000000, 160000000, 'Young star, untouchable unless massive offer'),
    (2, 3, 'listed', 'EUR', 150000000, 130000000, 'Contract ending soon'),
    (4, 5, 'listed', 'EUR', 90000000, 80000000, 'Midfield playmaker'),
    (5, 4, 'unlisted', 'EUR', 70000000, NULL, 'Key squad leader');

    INSERT INTO transfers
    (player_id, from_club_id, to_club_id, currency, fee, transfer_date, notes)
    VALUES
    (1, NULL, 1, 'EUR', 103000000, '2023-07-01', 'Signed from Dortmund'),
    (3, NULL, 2, 'EUR', 60000000, '2022-07-01', 'Record signing');
`

async function main() {
    console.log('seeding...')
    const client = new Client({
        connectionString: 'postgresql://postgres:tinyteo158@localhost:5432/transfer_market'
    })
    await client.connect()
    await client.query(SQL)
    await client.end()
    console.log('done')
}

main()