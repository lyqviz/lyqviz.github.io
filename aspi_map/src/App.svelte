<script>
	import { hydrateData, processData } from './data/processData.js';

	import Map from './components/Map.svelte';

	import { onMount } from 'svelte';

	let data = null;

	fetch('./data/graphic/data.json')
		.then((r) => r.json())
		.then((raw) => {
			const hydrated = hydrateData(raw);
			const processed = processData(hydrated);

			data = processed;

			console.log(processed);
		});

	onMount(() => {});
</script>

<div class="content">
	{#if data}
		<Map {data} />
	{/if}
</div>

<style>
	.content :global(*) {
		box-sizing: border-box;

		-webkit-font-smoothing: antialiased;
	}

	.content {
		max-width: 1200px;
		margin: auto;

		color: #000;

		font-family: acumin-pro;
	}
</style>
