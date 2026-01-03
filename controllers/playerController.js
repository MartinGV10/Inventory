const db = require('../db/queries')

const links = [
    { href: '/', text: 'Home'},
    { href: '/players', text: 'Players'},
    { href: '/clubs', text: 'Clubs'},
    { href: '/contracts', text: 'Contracts'},
    { href: '/listings', text: 'Listings'},
    { href: '/transfers', text: 'Transfers'},
    { href: '/createNew', text: 'Create New Player'},
]

async function getPlayers(req, res) {
    const players = await db.getAllPlayers()
    console.log(`Player -> ${players}`)
    // res.send(`Players -> ${players.map(player => player.full_name)}`)
    res.render('viewItem', {
        title: 'View Players',
        links: links,
        currentLink: req.path,
        items: players,
        attr: [
            {key: 'full_name', label: 'Player Name'},
            {key: 'nationality', label: 'Nationality'},
            {key: 'height_cm', label: 'Height (CM)'},
        ]
    })
}

async function getClubs(req, res) {
    const clubs = await db.getAllClubs()
    console.log(`Club -> ${clubs}`)
    // res.send(`Club -> ${clubs.map(club => club.name)}`)
    res.render('viewItem', {
        title: 'View Clubs',
        links: links,
        currentLink: req.path,
        items: clubs,
        attr: [
            {key: 'name', label: 'Club Name'},
            {key: 'country', label: 'Country'},
            {key: 'league', label: 'League'},
        ]
    })
}

async function getListings(req, res) {
    const listings = await db.getAllListings()
    console.log(`Listing -> ${listings}`)
    // res.send(`Listing -> ${listings.map(listing => listing.min_price)}`)
    res.render('viewItem', {
        title: 'View Listings',
        links: links,
        currentLink: req.path,
        items: listings,
        attr: [
            {key: 'player_id', label: 'Listed Player'},
            {key: 'selling_club_id', label: 'Selling Club'},
            {key: 'status', label: 'Player Status'},
            {key: 'asking_price', label: 'Asking Price'},
            {key: 'min_price', label: 'Minimum Price'},
            {key: 'notes', label: 'Notes'},
        ]
    })
}

async function getTransfers(req, res) {
    const trasnfers = await db.getAllTransfers()
    console.log(`Trasnfer -> ${trasnfers}`)
    // res.send(`Trasnfer -> ${trasnfers.map(trasnfer => trasnfer.fee)}`)
    res.render('viewItem', {
        title: 'View Transfers',
        links: links,
        currentLink: req.path,
        items: trasnfers,
        attr: [
            {key: 'player_id', label: 'Sold Player'},
            {key: 'from_club_id', label: 'Selling Club'},
            {key: 'to_club_id', label: 'Buying Club'},
            {key: 'fee', label: 'Transfer Fee'},
            {key: 'transfer_date', label: 'Date of Transfer'},
            {key: 'notes', label: 'Notes'},
        ]
    })
}

async function getContracts(req, res) {
    const contracts = await db.getAllContracts()
    console.log(`Contract -> ${contracts}`)
    // res.send(`Contract -> ${contracts.map(contract => contract.shirt_number)}`)
    res.render('viewItem', {
        title: 'View Contracts',
        links: links,
        currentLink: req.path,
        items: contracts,
        attr: [
            {key: 'player_id', label: 'Player Under Contract'},
            {key: 'club_id', label: 'Club'},
            {key: 'shirt_number', label: 'Shirt Number'},
            {key: 'start_date', label: 'Start Date'},
            {key: 'end_date', label: 'End Date'},
            {key: 'is_current', label: 'Are they currently playing here'},
        ]
    })
}

async function postCreateNew(req, res) {
    try {
        const { full_name, nationality, height_cm, preferred_foot, birth_date } = req.body;
        await db.createNewPlayer({ full_name, nationality, height_cm, preferred_foot, birth_date });
        res.redirect('/players');
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
}


function getCreateNew(req, res) {
    res.render('createNew', {
        title: 'Create New Player',
        links: links,
        currentLink: req.path,
    })
}

async function getPlayerDetails(req, res) {
    try {
        const { id } = req.params;
        const details = await db.getPlayerInfo(id);
        console.log(`Player details for ${id}:`, details);
        // For now, just send JSON, or render a view
        res.json(details);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
}

async function postDeletePlayer(req, res) {
  try {
    const { id } = req.body;
    await db.deletePlayer(id);
    res.redirect('/players');
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
}

async function getUpdatePlayer(req, res) {
    const rows = await db.getPlayerInfo(req.params.id)
    if (rows.length === 0) {
        return res.status(404).send('Player not found');
    }
    // For now, pass the first row, which has the core player data
    const player = rows[0];
    const positions = await db.getAllPositions();
    res.render('update', {
        title: 'Update Player',
        links: links,
        currentLink: req.path,
        player: player,
        positions: positions
    })
}

async function postUpdatePlayer(req, res) {
    try {
            const rawId = req.params.id;

        if (!rawId) {
            return res.status(400).send('Missing player id');
        }

        const playerId = Number(rawId);
        if (!Number.isInteger(playerId)) {
            return res.status(400).send('Invalid player id');
        }
        const { full_name, nationality, height_cm, preferred_foot, birth_date, shirt_number, position, asking_price, min_price, status, notes } = req.body;

        await db.updatePlayer(playerId, { full_name, nationality, height_cm, preferred_foot, birth_date, shirt_number, position, asking_price, min_price, status, notes });

        res.redirect(`/players`); // or `/player/${playerId}`
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
}


module.exports = {
    getPlayers,
    getClubs,
    getContracts,
    getTransfers,
    getListings,
    postCreateNew,
    getCreateNew,
    postDeletePlayer,
    getPlayerDetails,
    postUpdatePlayer,
    getUpdatePlayer
}