export function goToTop() {
	let scrollFrom = document.documentElement.scrollTop;
	let scrollTo = 0;

	easeFrom(scrollFrom, scrollTo, (value) => {
		document.documentElement.scrollTop = value;
	});
}

export function scrollTo(target) {
	if (!target) return;

	const scrollFrom = document.documentElement.scrollTop;

	const bcr = target.getBoundingClientRect();

	const scrollTo = scrollFrom + bcr.top;

	easeTo(scrollFrom, scrollTo, (value) => {
		document.documentElement.scrollTop = value;
	});
}

function easeFrom(x, y, callback, options) {
	options = options || {};

	const time = {
		start: performance.now(),
		duration: options.duration || 500,
	};

	const tick = (now) => {
		time.elapsed = now - time.start;

		const progress = time.elapsed / time.duration;
		const eased = easeInOutQuad(progress);

		let value = x + eased * (y - x);

		callback(value);

		if (progress < 1) requestAnimationFrame(tick);
	};

	requestAnimationFrame(tick);
}

function easeTo(x, y, callback, options) {
	options = options || {};

	const time = {
		start: performance.now(),
		duration: options.duration || 500,
	};

	const tick = (now) => {
		time.elapsed = now - time.start;

		const progress = time.elapsed / time.duration;
		const eased = easeInOutQuad(progress);

		let value = x + eased * (y - x);

		callback(value);

		if (progress < 1) {
			requestAnimationFrame(tick);
		} else {
			callback(y);
		}
	};

	requestAnimationFrame(tick);
}

function easeInOutQuad(t) {
	return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
