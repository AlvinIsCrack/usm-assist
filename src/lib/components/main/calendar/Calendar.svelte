<script lang="ts">
	import { ASIGNATURAS } from '$lib/data/data';
	import { Calendario, Días } from '$lib/states/calendario.svelte';
	import Day from './Day.svelte';

	let visible = $state(false);

	$effect(() => {
		visible = true;
	});

	$effect(() => {
		if (!Calendario.sede) Calendario.sede = Object.keys(ASIGNATURAS)[0];
		Calendario.jornada = '';
		Calendario.semestre = '';
	});

	$effect(() => {
		if (!Calendario.jornada) Calendario.jornada = Object.keys(ASIGNATURAS[Calendario.sede])[0];
		Calendario.semestre = '';
	});

	$effect(() => {
		if (!Calendario.semestre)
			Calendario.semestre = Object.keys(ASIGNATURAS[Calendario.sede][Calendario.jornada])[0];
	});
</script>

{#if visible}
	{@const [begin, end] = Calendario.range}
	<div class="flex h-full w-full items-center justify-between p-2">
		{#each new Array(end - begin + 1) as nDía, i (i)}
			<Day day={i + begin} />
		{/each}
	</div>
{/if}
