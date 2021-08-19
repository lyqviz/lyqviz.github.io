<script>
	import { data } from '../data/data.js';

	export let selected;

	const links = data.slice().sort((a, b) => {
		return a.name > b.name;
	});
</script>

<div class="info">
	<div class="info__title">ETS Implementation in East and Southeast Asia</div>

	<div class="info__text">
		Select a country to learn more about the current ETS status within the
		region.
	</div>

	<!--  

	<div class="info__countries">
		{#each links as link}
			<div class="info__country">
				<button
					class="info__country__label"
					on:click={() => {
						selected = link.name;
					}}
				>
					{link.display || link.name}
				</button>
			</div>
		{/each}
	</div>

	-->

	<div class="info__note">Last Update Jun 25, 2021</div>
</div>

<style>
	.info {
		position: absolute;
		z-index: 9999;
		top: 30px;
		left: 0;

		max-width: 288px;
		padding: 24px;

		transition: opacity .5s;

		border: 1px solid #ececec;
		background: #f9f9f9;
		box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .15);
	}

	.info__title {
		font-size: 30px;
		font-weight: 700;
		line-height: 32px;

		margin: 0 0 12px 0;
	}

	.info__text {
		font-size: 14px;

		margin: 0 0 12px 0;

		color: rgba(0, 0, 0, .75);
	}

	.info__countries {
		margin: 0 0 12px 0;
	}

	.info__country {
		line-height: 36px;

		display: flex;
		justify-content: space-between;

		height: 36px;

		border-bottom: 1px solid rgba(0, 0, 0, .2);
	}

	.info__country__label {
		font-size: inherit;
		font-weight: 700;

		display: block;

		margin: 0;
		padding: 0;

		border: 0;
		outline: 0;
		background: transparent;
	}

	.info__country__label:active {
		color: #000;
	}

	.info__country__link {
		font-size: 12px;
		font-weight: 700;

		text-transform: uppercase;

		color: #3679b9;
	}

	.info__note {
		font-size: 12px;

		color: rgba(0, 0, 0, .75);
	}

</style>
