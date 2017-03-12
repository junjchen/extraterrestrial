(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.EventFinderFactory = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = require("./lib/finder")

},{"./lib/finder":2}],2:[function(require,module,exports){
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
},{"./lib":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var Event = function Event(id, tickets) {
	return { id: id, name: "EVENT-" + id, tickets: tickets };
};

var Ticket = function Ticket(id, evtId, price) {
	return { id: id, evtId: evtId, price: price };
};

var World = function World(rows, cols) {
	var createEvent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

	var i = 0,
	    ret = [];
	for (; i < rows; i++) {
		var j = 0,
		    thisrow = [];
		for (; j < cols; j++) {
			thisrow.push(createEvent());
		}
		ret.push(thisrow);
	}
	return ret;
};

// identical to python range()
var range = function range(n) {
	return Array.from(Array(n).keys());
};

// search nodes that have a particular manhattan distance from the origin
var manhattanSearch = function manhattanSearch(rows, cols) {
	return function (origin) {
		return function (d) {
			if (d === 0) return [origin];

			var _origin = _slicedToArray(origin, 2),
			    x = _origin[0],
			    y = _origin[1],
			    ret = [],
			    xmax = cols - 1,
			    ymax = rows - 1,
			    dxmin = Math.max(0 - d, 0 - x),
			    dxmax = Math.min(d, xmax - x);

			var dx = dxmin;
			while (dx <= dxmax) {
				var dy = d - Math.abs(dx);
				if (y + dy <= ymax) ret.push([x + dx, y + dy]);
				if (dy !== 0 && y - dy >= 0) {
					ret.push([x + dx, y - dy]);
				}
				dx++;
			}
			return ret;
		};
	};
};

// find nearest events that have available tickets
// search argument decides a distance based search method and will be called by origin and distance
// returns a list of events that have length less than the number argument max spcified and sorted by cheapest ticket price and distance
// if the maxium event number is exceeded, evnets with higher price will not be included in the returned list
var findCheapestEvents = function findCheapestEvents(_ref) {
	var world = _ref.world,
	    search = _ref.search;
	return function (max) {
		return function (_ref2) {
			var _ref3 = _slicedToArray(_ref2, 2),
			    x = _ref3[0],
			    y = _ref3[1];

			var cols = world.length,
			    rows = world[0].length,
			    currentSearch = search([x, y]),
			    maxdist = Math.max(x, y, rows - 1 - y, cols - 1 - x);
			var dist = 0,
			    ret = [];
			while (ret.length < max && dist <= maxdist) {
				var nodes = currentSearch(dist);
				var events = nodes.map(function (_ref4) {
					var _ref5 = _slicedToArray(_ref4, 2),
					    x = _ref5[0],
					    y = _ref5[1];

					return world[x][y] && Object.assign({}, world[x][y], { x: x, y: y });
				}).filter(function (x) {
					return x !== undefined && x.tickets.length > 0;
				}).map(function (x) {
					return Object.assign({}, x, {
						cheapest: x.tickets.reduce(function (ret, x) {
							return ret === undefined || x.price < ret.price ? x : ret;
						}),
						distance: dist
					});
				});
				ret = ret.concat(events);
				dist++;
			}
			return ret.sort(function (a, b) {
				var dprice = a.cheapest.price - b.cheapest.price;
				return dprice === 0 ? a.distance - b.distance : dprice;
			}).slice(0, max);
		};
	};
};

exports.Event = Event;
exports.Ticket = Ticket;
exports.World = World;
exports.range = range;
exports.manhattanSearch = manhattanSearch;
exports.findCheapestEvents = findCheapestEvents;
},{}]},{},[1])(1)
});