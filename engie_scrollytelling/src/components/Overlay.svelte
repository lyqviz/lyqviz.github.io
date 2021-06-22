<script>
	import { onMount } from 'svelte';

	import { content } from '../stores.js';

	let visible = true;
</script>

{#if visible}
	<div class="modal">
		<p>
			The following data-driven narrative is a proof of concept. It
			references publicly available information and does <em>not</em> include
			actual Netfix data.
		</p>

		<button
			on:click={() => {
				visible = false;
			}}>Got it</button
		>
	</div>
{/if}
