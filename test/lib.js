import { expect } from 'chai'
import { spy } from 'sinon'
import { Event, Ticket, World, range, manhattanSearch, findCheapestEvents } from '../src/lib'

describe('lib', () => {

	describe('Event', () => {

		it('should return an object with correct properties', () => {
			const e = Event(1, [
				{ id: 1 },
				{ id: 2 }
            ])

			expect(e)
				.to.be.an('object')
			expect(e)
				.to.have.property('id', 1)
			expect(e)
				.to.have.property('name', 'EVENT-1')
			expect(e.tickets)
				.to.be.an('array')
			expect(e.tickets)
				.to.deep.equal([{ id: 1 }, { id: 2 }])
		})

	})

	describe('Ticket', () => {

		it('should return a ticket with correct properties', () => {
			const t = Ticket(1, 1, 1.2)

			expect(t)
				.to.be.an('object')
			expect(t)
				.to.have.property('id', 1)
			expect(t)
				.to.have.property('evtId', 1)
			expect(t)
				.to.have.property('price', 1.2)
		})
	})

	describe('World', () => {

		let w,
			g = spy()

		before(() => {
			w = World(10, 10, g)
		})

		it('should return a 10x10 2-d array', () => {
			expect(w)
				.to.be.an('array')
			expect(w)
				.to.have.lengthOf(10)
			w.forEach(r => {
				expect(r)
					.to.be.an('array')
				expect(r)
					.to.have.lengthOf(10)
			})
		})

		it('should call create event 100 times', () => {
			expect(g.callCount)
				.to.equal(100)
		})

	})

	describe('range', () => {

		it('should create an array specifie by the parameter', () => {
			const arr = range(10)
			expect(arr)
				.to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
		})
	})

	describe('manhattanSearch', () => {

		it('should find correct nodes given the size, origin node and distance', () => {
			expect(manhattanSearch(10, 10)([4, 4])(3))
				.to.deep.equal([
                    [1, 4],
                    [2, 5],
                    [2, 3],
                    [3, 6],
                    [3, 2],
                    [4, 7],
                    [4, 1],
                    [5, 6],
                    [5, 2],
                    [6, 5],
                    [6, 3],
                    [7, 4]
                ])
		})

		it('should return itself if distance is 0', () => {
			expect(manhattanSearch(10, 10)([4, 4])(0))
				.to.deep.equal([[4, 4]])
		})

		it('should not include nodes outside of the boundary', () => {
			expect(manhattanSearch(5, 5)([4, 4])(3))
				.to.deep.equal([
                    [1, 4],
                    [2, 3],
                    [3, 2],
                    [4, 1],
                ])
		})
	})

	describe('findCheapestEvents', () => {

		let world, eventFinder

		before(() => {
			world = [
                [
					{ evt: 1, tickets: [{ id: 1, evtId: 1, price: 103.45 }, { id: 2, evtId: 1, price: 100.20 }] },
					{ evt: 2, tickets: [{ id: 1, evtId: 2, price: 140.22 }] },
                    undefined
                ],
                [
					{ evt: 3, tickets: [{ id: 1, evtId: 3, price: 175.87 }] },
					{ evt: 4, tickets: [{ id: 1, evtId: 4, price: 188.08 }] },
					{ evt: 5, tickets: [{ id: 1, evtId: 5, price: 128.34 }] },
                ],
                [
                    undefined,
					{ evt: 6, tickets: [{ id: 1, evtId: 6, price: 120.48 }] },
					{ evt: 7, tickets: [{ id: 1, evtId: 7, price: 106.99 }] },
                ]
            ]
			eventFinder = findCheapestEvents({ world, search: manhattanSearch(3, 3) })(3)
		})

		it('should return correct event list', () => {
			expect(eventFinder([0, 0]))
				.to
				.deep
				.equal(
                    [
						{
							evt: 1,
							tickets: [{ id: 1, evtId: 1, price: 103.45 }, { id: 2, evtId: 1, price: 100.20 }],
							x: 0,
							y: 0,
							cheapest: { id: 2, evtId: 1, price: 100.20 },
							distance: 0
						},
						{
							evt: 2,
							tickets: [{ id: 1, evtId: 2, price: 140.22 }],
							x: 0,
							y: 1,
							cheapest: { id: 1, evtId: 2, price: 140.22 },
							distance: 1
						},
						{
							evt: 3,
							tickets: [{ id: 1, evtId: 3, price: 175.87 }],
							x: 1,
							y: 0,
							cheapest: { id: 1, evtId: 3, price: 175.87 },
							distance: 1
						}
                    ]
				)
		})

	})

})
