import { start, get } from 'prompt'
import eventFinderFactory from './finder'

start()
get([
	{
		name: 'x0',
		type: 'integer',
		description: 'left most coordinate',
		default: '-10'
    },
	{
		name: 'x1',
		type: 'integer',
		description: 'right most coordinate',
		default: '10'
    },
	{
		name: 'y0',
		type: 'integer',
		description: 'bottom most coordinate',
		default: '-10'
    },
	{
		name: 'y1',
		type: 'integer',
		description: 'top most coordinate',
		default: '10'
    },
	{
		name: 'max',
		type: 'integer',
		minimum: 0,
		message: 'Only allow positive integer',
		description: 'Number of events to return',
		default: 5
    }
], (err, { x0, x1, y0, y1, max }) => {
	if (err) {
		console.error(err)
		return
	} else {
		const eventFinder = eventFinderFactory({ x0, x1, y0, y1, max })
		const listen = () => {
			get([{
					name: 'x',
					type: 'integer',
					message: `x should be in range ${x0} to ${x1}`,
					description: 'origin coordinate\'s x',
					conform: x => (x >= x0 && x <= x1),
					default: 0
        },
				{
					name: 'y',
					type: 'integer',
					message: `y should be in range ${y0} to ${y1}`,
					description: 'origin coordinate\'s y',
					conform: y => (y >= y0 && y <= y1),
					default: 0
        }], (err, { x, y }) => {
				if (err) {
					//ignore
				} else {
					const events = eventFinder([x, y])
					console.log(events.map(({ name, cheapest, distance }) => `${name} ${cheapest.price}, Distance ${distance}`))
					listen()
				}
			})
		}
		listen()
	}
})
