<script>
	import { onMount } from 'svelte';

	import { processData } from './js/data.js';
	import { getParams, navigateTo } from './js/helpers.js';
	import { updateTheme } from './js/theme.js';

	import Debug from './components/Debug.svelte';

	import Navigation from './components/Navigation.svelte';
	import Overlay from './components/Overlay.svelte';
	import Section from './components/Section.svelte';

	import { content, selected, showBackground, theme } from './stores.js';

	// For prerendering, this must be a JS import

	import { sections } from '../public/client/content/content.js';

	let debug = false;

	content.set(processData(sections));

	onMount(() => {
		// Jump to section

		function navigate() {
			const id = window.location.hash.replace(/^#![\/]?/, '');
			const target = document.getElementById(id);

			if (!target) return;

			target.scrollIntoView({ behavior: 'smooth' });

			// navigateTo(hash);
		}

		navigate();

		window.addEventListener('hashchange', navigate);

		// Update themes

		updateTheme($theme);

		theme.subscribe(updateTheme);

		//

		const params = getParams();

		if (params.debug) debug = true;
		if (params.content) load(params.content);

		function load(id) {
			fetch(`./client/content/${id}.json`)
				.then((response) => response.json())
				.then((json) => {
					content.set(processData(json));
					theme.set(null);
				});
		}
	});
</script>

{#if debug}
	<Debug />
{/if}

<Navigation />
<Overlay />

<div class="sections {!$showBackground ? 'hideBackground' : 'showBackground'}">
	{#each $content as s, index}
		<Section section={s} />
	{/each}
</div>
