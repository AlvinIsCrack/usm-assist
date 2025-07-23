<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Separator from '$lib/components/ui/Separator.svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import type { Ramo } from '$lib/data/data.svelte';
	import { Calendario } from '$lib/states/calendario.svelte';

	let {
		selected = false,
		paralelo,
		onclick
	}: { selected: boolean; paralelo: Ramo; onclick?: () => any } = $props();

	const [código, extra] = $derived(
		paralelo.paralelo.replace(/\(modalidad (\w+)\)/gi, ';$1').split(';')
	);
	const colision = $derived(
		Calendario.hasRamo({ sigla: paralelo.sigla }) ? false : Calendario.checkCollision(paralelo)
	);
</script>

<!-- {#snippet paraleloRender()}
	<HorarioMiniRender bloques={paralelo.horario} />
{/snippet} -->

<Tooltip position="right">
	<Button
		class="bg-background! relative block w-full overflow-hidden border {!selected
			? 'hover:bg-accent! active:bg-accent/50!'
			: 'bg-primary! hover:bg-primary/50! text-primary-foreground!'} whitespace-nowrap"
		{onclick}
		type="button"
	>
		<div class="flex h-full w-fit flex-col text-sm text-nowrap opacity-50">
			<p class="font-bold {colision ? 'text-orange-400' : ''}">
				{código}
			</p>
			{#if extra}
				<p class="text-xs uppercase italic">{extra}</p>
			{/if}
		</div>
		<Separator class="pl-1" vertical />

		<div class="flex flex-1 flex-col">
			{#each paralelo.profesor as profesor (profesor)}
				<div class="w-full truncate text-center text-sm" title={profesor}>
					{profesor}
				</div>
			{/each}
		</div>
	</Button>
</Tooltip>
