<script>
	import { Runtime, Inspector } from '@observablehq/runtime';

	import { onDestroy, onMount } from 'svelte';
	import { content, selected, trigger } from '../stores.js';

	export let scene;
	export let id;
	export let cell;

	let embed;
	let runtime;
	let main;

	onMount(() => {
		trigger.subscribe((trigger) => {
			if (!trigger || trigger.scene !== scene.index) return;

			if (trigger.trigger) {
				if (!main) return;

				const expression = trigger.trigger.split('=');

				let [key, value] = expression;

				if (!key || !value) return;

				value = coerce(value);

				main.redefine(key, value);
			}
		});

		function coerce(string) {
			if (!string) return undefined;

			if (string === 'false') return false;
			if (string === 'true') return true;

			if (!Number(string).isNaN()) return Number(string);

			return string;
		}

		// https://api.observablehq.com/@kenton/test-map.js?v=3

		if (embed && id && cell) {
			const url = `https://api.observablehq.com/${id}.js?v=3`;

			// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#dynamic_import

			import(url).then((module) => {
				runtime = new Runtime();

				main = runtime.module(module.default, (name) => {
					if (name === cell) {
						return new Inspector(embed);
					}
				});

				const height = embed.offsetHeight;
				const width = embed.offsetWidth;

				main.redefine('height', height);
				main.redefine('width', width);
			});
		}
	});

	onDestroy(() => {
		if (runtime) runtime.dispose();
	});
</script>

<div bind:this={embed} class="scene__hero__observable" />
