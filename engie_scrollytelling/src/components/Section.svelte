<script>
	import Hero from './Hero.svelte';
	import Scene from './Scene.svelte';

	import { onMount } from 'svelte';

	import { handleIntersections } from '../intersection.js';
	import { content, selected, theme } from '../stores.js';

	import { getCurrentClass } from '../js/helpers.js';
	import { updateTheme } from '../js/theme.js';

	export let section;

	let node;

	$: classes = section.style.join(' ');
	$: currentClass = getCurrentClass(
		$selected.index,
		section.intersectionIndex
	);

	onMount(() => {
		const options = {
			threshold: 0.01,
		};

		const observer = new IntersectionObserver(handleIntersections, options);

		observer.observe(node);

		selected.subscribe((selected) => {
			if (selected.id === section.intersectionId) {
				theme.set(section.theme);
			}
		});
	});
</script>

<section
	bind:this={node}
	id="section-{section.id}"
	data-intersection-id={section.intersectionId}
	data-intersection-index={section.intersectionIndex}
	data-intersection-section={section.label}
	class="section {classes} {currentClass}"
>
	<div class="section__spacer" />

	{#if section.title}
		<div class="section__title">
			{#if section.title.section}
				<h3 class="section__title__section">{section.title.section}</h3>
			{/if}

			{#if section.title.headline}
				<h1 class="section__title__headline">
					{section.title.headline}
				</h1>
			{/if}

			{#if section.title.subheadline}
				<h2 class="section__title__subheadline">
					{section.title.subheadline}
				</h2>
			{/if}
		</div>
	{/if}

	{#if section.scenes.length}
		<div class="section__heros">
			{#each section.scenes as s, index}
				<Hero scene={s} />
			{/each}
		</div>
	{/if}

	{#each section.scenes as s, index}
		<Scene {section} scene={s} />
	{/each}
</section>
