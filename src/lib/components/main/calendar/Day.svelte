<script lang="ts">
	import { Calendario, Días } from '$lib/states/calendario.svelte';
	import Cell from './Cell.svelte';

	let { day }: { day: Días } = $props();
	const dayName = $derived(Días[day]);
	const bloques = $derived(Calendario.getBloquesDía(day));
	const [begin, end] = Calendario.bloqueRange;
</script>

<div class="flex h-full w-full flex-col gap-1 px-0.5">
	<div class="flex w-full items-center justify-center p-2! text-lg font-bold uppercase select-none">
		{dayName.slice(0, 3)}
	</div>

	{#each new Array(end - begin + 1) as nBloque, i (i)}
		<Cell día={day} bloque={nBloque} />
	{/each}
</div>
