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

		// a detail box to show information
		var $detail = $('<dl/>', { class: 'detail' })
		var $name = $('<dd/>', { class: 'detail__name' })
		var $cheapest = $('<dd/>', { class: 'detail__cheapest' })
		var $distance = $('<dd/>', { class: 'detail__distance' })
		$detail.append($name)
			.append($cheapest)
			.append($distance)
			.appendTo($boxes)

		var onCellClick = (function onCellClick() {
			var $prevCell, $prevHighlights = []
			return function handle(e) {
				var $currCell = $(e.target)
				if ($prevCell !== $currCell) {
					var evts = ef([$currCell.data('x'), $currCell.data('y')])
					var $highlights = evts.map(function(evt) {
						return $boxes.children(':nth-child(' + (evt.y + 1) + ')')
							.children(':nth-child(' + (evt.x + 1) + ')')
							.data('evt', evt)
					})
					$prevCell && $prevCell.removeClass('boxes__cell--origin')
					$currCell.addClass('boxes__cell--origin')
					// remove highlights for elments nolonger should be highlighted
					$($prevHighlights)
						.not($highlights)
						.get()
						.forEach(function($h) {
							$h.removeClass('boxes__cell--highlight')
						})
					// highlight elments
					$($highlights)
						.not($prevHighlights)
						.get()
						.forEach(function($h) {
							$h.addClass('boxes__cell--highlight')
						})
					$prevCell = $currCell
					$prevHighlights = $highlights
				}
			}
		})()

		function onMouseOver(e) {
			var $cell = $(e.target),
				evt = $cell.data('evt'),
				pos = $cell.position()
			$boxes.addClass('boxes--fade')
			$detail.addClass('detail--show').css({
				top: pos.top,
				left: pos.left + 40
			})
			$name.text(evt.name)
			$distance.text('distance ' + evt.distance)
			$cheapest.text('$' + evt.cheapest.price)
		}

		function onMouseOut() {
			$detail.removeClass('detail--show')
			$boxes.removeClass('boxes--fade')
		}

		$boxes.on('click', '.boxes__cell', onCellClick)
		$boxes.on('mouseover', '.boxes__cell--highlight', onMouseOver)
		$boxes.on('mouseout', '.boxes__cell--highlight', onMouseOut)
	}
})(jQuery, EventFinderFactory)
