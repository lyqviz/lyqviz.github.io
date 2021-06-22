<script>
	import { geoAlbers, geoPath } from 'd3-geo';
	import { onMount } from 'svelte';
	import { feature } from 'topojson';

	export let settings;
	export let data;

	let color = settings.color || 'red';
	let title = settings.title || 'Placeholder title';
	let key = settings.key || null;

	let node;

	//

	let width = 960;
	let height = 600 - 60;

	let projection = geoAlbers()
		.scale(1150)
		.translate([width / 2, height / 2]);

	let path = geoPath().projection(projection);

	//

	let topoJSONFile = './client/data/geo/states-10m.json';
	let featureType = 'states';

	let features = [];

	$: locations = processLocations(data);

	function processLocations(data) {
		if (!data || !data.locations) return [];

		return data.locations
			.map((loc) => {
				let [x, y] = projection([+loc.lng, +loc.lat]);

				loc.x = x;
				loc.y = y;

				loc.r = loc.radius * 75;

				return loc;
			})
			.sort((a, b) => {
				return b.radius - a.radius;
			});
	}

	onMount(async () => {
		const response = await fetch(topoJSONFile);
		const topoJSON = await response.json();

		const topoData = feature(topoJSON, topoJSON.objects[featureType]);

		features = topoData.features;

		if (node) node.style.setProperty('--color', color);
	});

	const toId = (str) => {
		if (!str) return '';

		return str.replace(/,/g, '').replace(/ /g, '_').toLowerCase();
	};

	//

	let tooltipClass = 'tooltip';
	let tooltipData = null;
	let tooltipPos = { x: '0', y: '0' };

	let pageWidth;

	function circleOver(e, location) {
		let left = e.clientX;
		if (left > pageWidth - 350) left -= 350;

		let top = e.clientY;
		if (top < 100) top += 100;

		tooltipPos = { x: left + 'px', y: top + 'px' };

		tooltipData = location;

		tooltipClass = 'active';
	}

	function circleOut() {
		tooltipClass = '';
	}
</script>

<svelte:window bind:innerWidth={pageWidth} />

<div bind:this={node} class="map_container">
	<div class="map__title">{@html title}</div>

	{#if key}
		<div class="map__key" style="background-image:url('{key}')" />
	{/if}

	<div
		class="tooltip {tooltipClass}"
		style="left:{tooltipPos.x}; top:{tooltipPos.y}"
	>
		{#if tooltipData}
			<div class="title">{tooltipData.title}</div>
			<div class="subtitle">{tooltipData.subtitle}</div>
			<div class="rows">
				{#each tooltipData.properties as property}
					<div class="row">
						<div class="display">{property.display}</div>
						<div class="value">{property.value}</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<svg viewBox="0 0 {width} {height}">
		<g class="states">
			{#each features as state}
				<path d={path(state)} />
			{/each}
		</g>

		<g class="locations">
			{#each locations as location}
				<circle
					id={toId(location.title)}
					fill={color}
					stroke={color}
					r={location.r}
					transform="translate({location.x} {location.y})"
					on:mouseover={(e) => circleOver(e, location)}
					on:mousemove={(e) => circleOver(e, location)}
					on:mouseout={(e) => circleOut(e, location)}
				/>
			{/each}
		</g>
	</svg>
</div>

<style>
</style>
