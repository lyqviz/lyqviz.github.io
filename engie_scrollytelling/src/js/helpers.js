import { goToTop, scrollTo } from '../js/scrollTo.js';

export function getCurrentClass(selected, index) {
	if (selected === index) return 'active';

	return selected > index ? 'seen' : 'unseen';
}

export function navigateTo(id) {
	const target = document.getElementById(id);

	scrollTo(target);
}

export function getParams() {
	return window.location.search
		.replace(/^\?/, '')
		.split('&')
		.filter((p) => p)
		.reduce((accumlator, current) => {
			const [key, value] = current.split('=');

			accumlator[key] = value;

			return accumlator;
		}, {});
}
