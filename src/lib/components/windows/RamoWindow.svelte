<script lang="ts">
	import { ASIGNATURAS } from '$lib/data/data';
	import { Calendario } from '$lib/states/calendario.svelte';

	$effect(() => {
		console.log(Calendario.sede);
		console.log(Calendario.jornada);
		console.log(Calendario.semestre);
	});
</script>

{#each Object.entries(ASIGNATURAS[Calendario.sede]?.[Calendario.jornada]?.[Calendario.semestre] ?? []) as entrada}
	{#if entrada}
		a
	{/if}
{/each}
