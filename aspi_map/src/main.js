import './css/main.css';
import './css/update.css';

import { getDataFromTable } from './js/table.js';

import App from './App.svelte';

const graphics = document.querySelectorAll('.schema-custom-component');

graphics.forEach((node) => {
	const loaded = node.classList.contains('loaded-by-schema');

	if (loaded) return;

	node.classList.add('loaded-by-schema');

	const graphic = new App({
		target: node,
		props: {},
	});
});

// export default app;
