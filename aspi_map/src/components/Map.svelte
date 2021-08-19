<script>
	// import { data } from '../data/data.js';

	import Sidebar from './Sidebar.svelte';
	import Title from './Title.svelte';

	import { onMount } from 'svelte';

	import { geoMercator, geoPath } from 'd3-geo';
	import { feature } from 'topojson';

	export let data;

	let node;
	let selected = null;

	let width = 1200;
	let height = 780;

	let projection = geoMercator()
		// .rotate([-100, -25])
		.center([110, 25])
		.scale(425)
		.translate([width / 2, height / 2]);

	let path = geoPath().projection(projection);

	const countries = data.map((d) => {
		const label = projection(d.label);

		d.labelPoint = { x: label[0], y: label[1] };

		if (d.location) {
			const location = projection(d.location);

			d.locationPoint = { x: location[0], y: location[1] };
		}

		return d;
	});

	let countryNames = data.map((country) => {
		return country.display || country.name;
	});

	let features = [];

	$: selectedFeature = features.find((feature) => {
		return feature.properties.name === selected;
	});

	$: tooltip = getTooltip(selected);

	function getTooltip(selected) {
		if (!selected) return null;

		return data.find((country) => {
			return selected === country.name;
		});
	}

	onMount(async () => {
		let url =
			'https://schemadesign.github.io/aspi_interactivemap/countries-50m.json';

		let featureType = 'countries';

		features = await fetch(url)
			.then((r) => r.json())
			.then((json) => {
				return feature(json, json.objects[featureType]);
			})
			.then((data) => {
				return data.features.map((f) => {
					if (f.properties.name !== 'Taiwan') return f;

					f.geometry.coordinates = [f.geometry.coordinates[0]];

					return f;
				});
			});
	});

	const select = (name) => {
		if (!countryNames.includes(name)) return;

		selected = name;
	};

	function getClass(name, selected) {
		let classes = [];

		let d = data.find((d) => {
			return d.name === name;
		});

		if (!d) return '';

		if (name === selected) classes.push('selected');

		if (d.status === 'plan to') classes.push('country--planning');
		if (d.status === 'yes') classes.push('country--implemented');

		return classes.join(' ');
	}

	function slug(t) {
		return t.toLowerCase().replace(' ', '_');
	}
</script>

<div class="graphic__container">
	<Title bind:selected />

	<div bind:this={node} class="map_container">
		<svg
			class="map {selected ? 'selected' : ''}"
			viewBox="0 0 {width} {height}"
		>
			<defs>
				<clipPath id="crop">
					<circle cx="600" cy="390" r="360" />
				</clipPath>

				<linearGradient
					id="gradient-blue"
					gradientTransform="rotate(90)"
				>
					<stop offset="0%" stop-color="#7EC8FF" />
					<stop offset="100%" stop-color="#2D65A5" />
				</linearGradient>

				<linearGradient
					id="gradient-green"
					gradientTransform="rotate(90)"
				>
					<stop offset="0%" stop-color="#C0F060" />
					<stop offset="100%" stop-color="#60A010" />
				</linearGradient>
			</defs>

			<circle class="map__water" cx="600" cy="390" r="360" />

			<g class="map__features" clip-path="url(#crop)">
				<g class="countries">
					{#each features as country}
						<g class="country--{slug(country.properties.name)}">
							<path
								class="country {getClass(
									country.properties.name,
									selected
								)}"
								d={path(country)}
								on:click={() => {
									select(country.properties.name);
								}}
							/>
						</g>
					{/each}
				</g>

				{#each countries as c}
					{#if c.type === 'point'}
						<g class="points">
							<circle
								class={getClass(c.name, selected)}
								cx={c.locationPoint.x}
								cy={c.locationPoint.y}
								r="9"
								on:click={() => {
									select(c.name);
								}}
							/>
						</g>
					{/if}
				{/each}

				{#if selectedFeature}
					<!-- <path class="selected__country" d={path(selectedFeature)} /> -->
				{/if}

				<g class="labels">
					<!-- <rect x={c.x - 3} y={c.y - 3} height='6' width='6'/> -->
					<!-- <path class='line' d='M {c.x},{c.y} l 30,-30 l 30,0' /> -->

					{#each countries as c}
						<g
							class="label"
							on:click={() => {
								select(c.name);
							}}
						>
							<g class="label--{slug(c.name)}">
								<text y={c.labelPoint.y}>
									{#each c.nameBreaks || [c.name] as line, i}
										<tspan
											class="map__label__shadow"
											x={c.labelPoint.x}
											dy="{i * 1.0}em">{line}</tspan
										>
									{/each}
								</text>
							</g>

							<g class="label--{slug(c.name)}">
								<text y={c.labelPoint.y}>
									{#each c.nameBreaks || [c.name] as line, i}
										<tspan
											class="map__label"
											x={c.labelPoint.x}
											dy="{i * 1.0}em">{line}</tspan
										>
									{/each}
								</text>
							</g>
						</g>
					{/each}
				</g>
			</g>

			<circle class="crop__outline" cx="600" cy="390" r="360" />
		</svg>
	</div>

	<div class="chart__key">
		<div class="chart__key__item chart__key--implemented">ETS in force</div>
		<div class="chart__key__item chart__key--planning">
			ETS under development or under consideration
		</div>
	</div>

	<Sidebar bind:selected {tooltip} />
</div>

<style>
	.graphic__container {
		position: relative;

		width: 100%;
		/* height: 780px; */
		margin: auto;

		/* background: #1a1a1a; */
	}

	.map__base,
	.map__overlay {
		position: absolute;
		top: 0;
		left: 0;

		width: 100%;
		height: 100%;
	}

	.map__water {
		fill: #f9f9f9;
	}

	.crop__outline {
		stroke: #c4c4c4;
		stroke-width: 1;
		fill: none;
	}

	.line {
		stroke: #000;
		fill: none;
		stroke-width: 0.5px;
	}

	.country {
		/* transition: fill 1s; */
		fill: #ccc;
		stroke: #fff;
		stroke-width: 1px;
	}

	.country--implemented {
		fill: url(#gradient-blue);
	}

	.country--planning {
		fill: url(#gradient-green);
	}

	.selected .country--implemented:not(.selected),
	.selected .country--planning:not(.selected) {
		fill: #c6c6c6;
	}

	.selected .selected__country {
		fill: none;
	}

	.label {
		cursor: pointer;
	}

	.map__label {
		font-weight: 700;
	}

	.map__label__shadow {
		font-weight: 700;

		stroke: #fff;
		stroke-width: 3px;
		stroke-linejoin: round;
	}

	.label--china .map__label {
		fill: #fff;
	}

	.label--china .map__label__shadow {
		stroke: #000;
		stroke-width: 3px;
		stroke-linejoin: round;
	}

	.chart__key {
		font-weight: 700;

		position: absolute;
		right: 0;
		bottom: 30px;
	}

	.chart__key__item {
		line-height: 24px;

		position: relative;

		height: 24px;
	}

	.chart__key--implemented::before,
	.chart__key--planning::before {
		position: absolute;
		top: 6px;
		left: -18px;

		width: 12px;
		height: 12px;

		content: '';

		border-radius: 12px;
		background: #eee;
	}

	.chart__key--implemented::before {
		background: #3473b3;
	}

	.chart__key--planning::before {
		background: #60a010;
	}
</style>
