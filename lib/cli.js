'use strict';

var _prompt = require('prompt');

var _finder = require('./finder');

var _finder2 = _interopRequireDefault(_finder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _prompt.start)();
(0, _prompt.get)([{
	name: 'x0',
	type: 'integer',
	description: 'left most coordinate',
	default: '-10'
}, {
	name: 'x1',
	type: 'integer',
	description: 'right most coordinate',
	default: '10'
}, {
	name: 'y0',
	type: 'integer',
	description: 'bottom most coordinate',
	default: '-10'
}, {
	name: 'y1',
	type: 'integer',
	description: 'top most coordinate',
	default: '10'
}, {
	name: 'max',
	type: 'integer',
	minimum: 0,
	message: 'Only allow positive integer',
	description: 'Number of events to return',
	default: 5
}], function (err, input) {
	if (err) {
		//ignore
	} else {
		var x0 = input.x0,
		    x1 = input.x1,
		    y0 = input.y0,
		    y1 = input.y1,
		    max = input.max;

		var eventFinder = (0, _finder2.default)({ x0: x0, x1: x1, y0: y0, y1: y1, max: max });
		var listen = function listen() {
			(0, _prompt.get)([{
				name: 'x',
				type: 'integer',
				message: 'x should be in range ' + x0 + ' to ' + x1,
				description: 'origin coordinate\'s x',
				conform: function conform(x) {
					return x >= x0 && x <= x1;
				},
				default: 0
			}, {
				name: 'y',
				type: 'integer',
				message: 'y should be in range ' + y0 + ' to ' + y1,
				description: 'origin coordinate\'s y',
				conform: function conform(y) {
					return y >= y0 && y <= y1;
				},
				default: 0
			}], function (err, input) {
				if (err) {
					//ignore
				} else {
					var x = input.x,
					    y = input.y;

					var events = eventFinder([x, y]);
					console.log(events.map(function (_ref) {
						var name = _ref.name,
						    cheapest = _ref.cheapest,
						    distance = _ref.distance;
						return name + ' ' + cheapest.price + ', Distance ' + distance;
					}));
					listen();
				}
			});
		};
		listen();
	}
});