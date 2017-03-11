import { Event, Ticket, World, range, manhattanSearch, findCheapestEvents } from './lib'

const random = (lower, upper, digits = 0) => (lower + Math.random() * (upper - lower))
	.toFixed(digits)
const chance = rate => Math.random() > (1 - rate)
const sameSign = (a, b) => (a * b) > 0
const eventCreator = () => {
	let evtId = 0
	return () => {
		if (chance(0.05)) { // 5% of the time there generate tickets
			const thisEvtId = ++evtId
			const tickets = range(random(0, 100)) // randomly generate 0 to 100 tickets
				.map(x => Ticket(x + 1, thisEvtId, random(20, 200, 2))) // random price between 20 to 200
			return Event(thisEvtId, tickets)
		}
	}
}

const eventFinderFactory = ({
	x0,
	x1,
	y0,
	y1,
	max
}) => {
	const rows = x1 - x0 + (sameSign(x1, x0) ? -1 : 1),
		cols = y1 - y0 + (sameSign(y1, y0) ? -1 : 1),
		world = World(rows, cols, eventCreator()),
		manhattanSearcher = manhattanSearch(rows, cols),
		find = findCheapestEvents({ world, search: manhattanSearcher })(max)
	return ([x, y]) => find([x - x0, y - y0])
}

export default eventFinderFactory
