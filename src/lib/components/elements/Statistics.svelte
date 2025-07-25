<script lang="ts">
	import Loader from '$lib/icons/loader.svelte';
	import { Calendario } from '$lib/states/calendario.svelte';
	import { fade } from 'svelte/transition';
	import Separator from '../ui/Separator.svelte';
	import { untrack } from 'svelte';
	import { Data } from '$lib/data/data.svelte';
	import Card from '../ui/Card.svelte';
	import { BLOQUE_DURATION_MINUTES } from '$lib/constants/usm';

	type typeStatistics = Promise<string[]>;
	let statistics: typeStatistics = $state(Promise.resolve([]));

	$effect(() => {
		const _ = [Calendario.ramos];

		untrack(() => {
			async function update(): typeStatistics {
				let out: string[] = [];

				return out;
			}

			statistics = update();
		});
	});
</script>

<div class="flex min-h-1/2 w-full flex-col gap-2">
	<Separator />

	<h2 class="text-sm">Estadísticas</h2>
	<div class="flex h-full w-full flex-col gap-1">
		{#await statistics}
			<div class="flex h-full w-full items-center justify-center">
				<div in:fade class="absolute">
					<Loader class="loader-usm scale-200" />
				</div>
			</div>
		{:then statistics}
			<div class="flex w-full flex-col gap-2 text-justify text-sm">
				{#each statistics as text (text)}
					{@const out = text
						.replace(':', "<span class='mr-2'>:</span>")
						.replace(
							/\^.*?\^/,
							(match) => `<span class='font-bold opacity-50'>${match.slice(1, -1)}</span>`
						)}
					<Card class="flex w-full flex-row justify-between px-3! py-1.5!">
						<p>{@html out}</p>
					</Card>
				{/each}
			</div>
		{/await}
	</div>
</div>
