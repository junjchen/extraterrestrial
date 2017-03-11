const Event = (id, tickets) => ({ id, name: `EVENT-${id}`, tickets })

const Ticket = (id, evtId, price) => ({ id, evtId, price })

const World = (rows, cols, createEvent = () => {}) => {
	let i = 0,
		ret = []
	for (; i < rows; i++) {
		let j = 0,
			thisrow = []
		for (; j < cols; j++) {
			thisrow.push(createEvent())
		}
		ret.push(thisrow)
	}
	return ret
}

// identical to python range()
const range = n => Array.from(Array(n)
	.keys())

// search nodes that have a particular manhattan distance from the origin
const manhattanSearch = (rows, cols) => origin => d => {
	if (d === 0)
		return [origin]
	const [x, y] = origin, ret = [],
		xmax = cols - 1,
		ymax = rows - 1,
		dxmin = Math.max(0 - d, 0 - x),
		dxmax = Math.min(d, xmax - x)
	let dx = dxmin
	while (dx <= dxmax) {
		const dy = d - Math.abs(dx)
		if (y + dy <= ymax)
			ret.push([x + dx, y + dy])
		if (dy !== 0 && y - dy >= 0) {
			ret.push([x + dx, y - dy])
		}
		dx++
	}
	return ret
}

// find nearest events that have available tickets
// search argument decides a distance based search method and will be called by origin and distance
// returns a list of events that have length less than the number argument max spcified and sorted by cheapest ticket price and distance
// if the maxium event number is exceeded, evnets with higher price will not be included in the returned list
const findCheapestEvents = ({ world, search }) => max => ([x, y]) => {
	const cols = world.length,
		rows = world[0].length,
		currentSearch = search([x, y]),
		maxdist = Math.max(x, y, rows - 1 - y, cols - 1 - x)
	let dist = 0,
		ret = []
	while (ret.length < max && dist <= maxdist) {
		const nodes = currentSearch(dist)
		const events = nodes.map(([x, y]) => world[x][y])
			.filter(x => x !== undefined && x.tickets.length > 0)
			.map(x => Object.assign({}, x, {
				cheapest: x.tickets.reduce((ret, x) => (ret === undefined || x.price < ret.price) ? x : ret),
				distance: dist
			}))
		ret = ret.concat(events)
		dist++
	}
	return ret.sort((a, b) => {
			const dprice = a.cheapest.price - b.cheapest.price
			return dprice === 0 ? a.distance - b.distance : dprice
		})
		.slice(0, max)
}

export { Event, Ticket, World, range, manhattanSearch, findCheapestEvents }
