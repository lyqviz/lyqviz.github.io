<script>
	import * as d3 from 'd3';

	import { importData } from '../js/import.js';

	import Observable from './Observable.svelte';

	// import custom components here

	import Custom from '../custom/Custom.svelte';
	import Map from '../custom/Map.svelte';
	import Pathways from '../custom/Pathways.svelte';
	import Treemap from '../custom/Treemap.svelte';

	import { onMount } from 'svelte';
	import { content, selected, trigger } from '../stores.js';

	const components = {
		custom: Custom,
		map: Map,
		pathways: Pathways,
		treemap: Treemap,
	};

	export let scene;
	let data;
	let embed;

	$: active = $selected.scene === scene.index;
	$: settings = scene.hero && scene.hero.settings ? scene.hero.settings : {};

	if (scene.hero && scene.hero.data && Array.isArray(scene.hero.data)) {
		importData(scene.hero.data).then((combined) => {
			data = combined;
		});
	}

	onMount(() => {
		trigger.subscribe((trigger) => {
			if (!trigger || trigger.scene !== scene.index) return;

			if (embed && embed.contentWindow) {
				embed.contentWindow.postMessage(trigger, '*');
			}
		});
	});
</script>

{#if scene.hero}
	<div class="scene__hero {active ? 'active' : 'inactive'}">
		<div class="scene__hero__graphic">
			{#if scene.hero.type === 'custom'}
				{#if components[scene.hero.name]}
					<svelte:component
						this={components[scene.hero.name]}
						{data}
						{settings}
					/>
				{/if}
			{/if}

			{#if scene.hero.type === 'iframe'}
				<iframe
					bind:this={embed}
					width="100%"
					height="100%"
					frameborder="0"
					src={scene.hero.url}
				/>
			{/if}

			{#if scene.hero.type === 'image'}
				<div
					class="scene__hero__image"
					style="background-image:url({scene.hero.url})"
				/>
			{/if}

			{#if scene.hero.type === 'observable'}
				<Observable id={scene.hero.id} cell={scene.hero.cell} {scene} />
			{/if}

			{#if scene.hero.type === 'placeholder'}
				<div
					class="scene__hero__placeholder"
					style="background-image:url({scene.hero.url})"
				/>
			{/if}
		</div>
	</div>
{/if}
