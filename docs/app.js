window.EventFinderApp = (function($, eff) {
	// TODO: check arguments is not undefined

	return function(root) {
		var x0 = -10,
			x1 = 10,
			y0 = -10,
			y1 = 10,
			max = 5,
			ef = eff.default({
				x0: x0,
				x1: x1,
				y0: y0,
				y1: y1,
				max: max
			}),
			$app = $(root)

		// clean up
		$app.empty()

		// boxes are visual representation for locations
		var $boxes = $('<div/>', { class: 'boxes' }),
			i = y0
		for (; i <= y1; i++) {
			var $row = $('<div/>', { class: 'boxes__row' }),
				j = x0
			for (; j <= x1; j++) {
				$('<div/>', { class: 'boxes__cell' })
					.data('x', j)
					.data('y', i)
					.appendTo($row)
			}
			$boxes.append($row)
		}

		$app.append($boxes)

		var onCellClick = (function onCellClick() {
			var $prevCell, $prevHighlights = []
			return function handle(e) {
				var $cell = $(e.target)
				if ($prevCell !== $cell) {
					var evts = ef([$cell.data('x'), $cell.data('y')])
					var $highlights = evts.map(function(evt) {
						return $boxes.find(':nth-child(' + (evt.y + 1) + ')')
							.find(':nth-child(' + (evt.x + 1) + ')')
					})
					unhighlight($prevCell, $prevHighlights)
					highlight($cell, $highlights)
					$prevCell = $cell
					$prevHighlights = $highlights
				}
			}
		})()
		$boxes.on('click', '.boxes__cell', onCellClick)

		function unhighlight($origin, $highlights) {
			$origin && $origin.removeClass('boxes__cell--origin')
			$highlights.forEach(function(h) {
				h.removeClass('boxes__cell--highlight')
			})
		}

		function highlight($origin, $highlights) {
			$origin.addClass('boxes__cell--origin')
			$highlights.forEach(function(h) {
				h.addClass('boxes__cell--highlight')
			})
		}

	}
})(jQuery, EventFinderFactory)
