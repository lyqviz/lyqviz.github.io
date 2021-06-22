<script>
	import { csvParse } from 'd3-dsv';

	import { onMount } from 'svelte';
	import { getTreemap } from './getTreemap.js';

	export let settings;
	export let data;

	let treemapData;

	let width = 960;
	let height = 600;

	let node;

	let interactive = settings.interactive || false;
	let title = settings.title || 'Placeholder title';
	let view = settings.view || 'scope';

	let showBack = false;

	const callback = (update) => {
		showBack = !!update.depth;
	};

	$: treemap = getTreemap(view, treemapData, interactive, callback);

	$: {
		if (node && treemap) {
			node.innerHTML = '';
			node.append(treemap.node);
		}
	}

	const lookup = {
		activity: 'Activity',
		bu: 'Business Unit',
		scope: 'Scope',
	};

	const options = [
		{ name: 'Activity', value: 'activity' },
		{ name: 'Business Unit', value: 'bu', selected: true },
		{ name: 'Scope', value: 'scope' },
	];

	const back = () => {
		treemap.back();
	};

	onMount(async () => {
		fetch('./client/data/treedata.csv')
			.then((res) => res.text())
			.then((text) => {
				return csvParse(text);
			})
			.then((data) => {
				treemapData = data;
			});
	});
</script>

<div class="treemap_container">
	{#if interactive}
		<div class="treemap__controls">
			<button
				class="treemap__back {showBack ? 'show' : 'hide'}"
				on:click={back}
			/>

			<span class="treemap__text">Total Emissions (MT CO2) by</span>

			<div class="treemap__selection">
				<div class="treemap__label">{lookup[view]}</div>

				<select bind:value={view} class="treemap__select">
					{#each options as option}
						<option value={option.value}>{option.name}</option>
					{/each}
				</select>
			</div>
		</div>
	{:else}
		<div class="treemap__title">{@html title}</div>
	{/if}

	<div bind:this={node} class="treemap__graphic" />
</div>

<style>
</style>
