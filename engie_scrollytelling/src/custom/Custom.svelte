<script>
	import * as d3 from 'd3-selection';

	import { onMount } from 'svelte';

	import { beforeUpdate, afterUpdate } from 'svelte';

	export let data;
	let node;

	afterUpdate(() => {
		draw(node);
	});

	onMount(() => {
		draw(node);
	});

	function draw(node) {
		const graphic = d3.select(node);

		const data = new Array(99).fill().map(() => {
			return {
				x: Math.random() * 960,
				y: Math.random() * 540,
			};
		});

		graphic
			.selectAll('circle')
			.data(data)
			.join('circle')
			.attr('cx', (d) => d.x)
			.attr('cy', (d) => d.y)
			.attr('r', 3);
	}
</script>

<div class="custom__chart">
	<!-- <svg bind:this={node} width="100%" height="100%" /> -->

	{#if data}
		{#each data as d}
			<div class="">{d.data}</div>
		{/each}
	{/if}
</div>
