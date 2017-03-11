'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _lib = require('./lib');

var random = function random(lower, upper) {
	var digits = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
	return (lower + Math.random() * (upper - lower)).toFixed(digits);
};
var chance = function chance(rate) {
	return Math.random() > 1 - rate;
};
var sameSign = function sameSign(a, b) {
	return a * b > 0;
};
var eventCreator = function eventCreator() {
	var evtId = 0;
	return function () {
		if (chance(0.05)) {
			// 5% of the time there generate tickets
			var thisEvtId = ++evtId;
			var tickets = (0, _lib.range)(random(0, 100)) // randomly generate 0 to 100 tickets
			.map(function (x) {
				return (0, _lib.Ticket)(x + 1, thisEvtId, random(20, 200, 2));
			}); // random price between 20 to 200
			return (0, _lib.Event)(thisEvtId, tickets);
		}
	};
};

var eventFinderFactory = function eventFinderFactory(_ref) {
	var x0 = _ref.x0,
	    x1 = _ref.x1,
	    y0 = _ref.y0,
	    y1 = _ref.y1,
	    max = _ref.max;

	var rows = x1 - x0 + (sameSign(x1, x0) ? -1 : 1),
	    cols = y1 - y0 + (sameSign(y1, y0) ? -1 : 1),
	    world = (0, _lib.World)(rows, cols, eventCreator()),
	    manhattanSearcher = (0, _lib.manhattanSearch)(rows, cols),
	    find = (0, _lib.findCheapestEvents)({ world: world, search: manhattanSearcher })(max);
	return function (_ref2) {
		var _ref3 = _slicedToArray(_ref2, 2),
		    x = _ref3[0],
		    y = _ref3[1];

		return find([x - x0, y - y0]);
	};
};

exports.default = eventFinderFactory;