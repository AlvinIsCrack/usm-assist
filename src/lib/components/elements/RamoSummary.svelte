<script lang="ts">
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import { Data } from '$lib/data/data.svelte';
	import Asterisk from '$lib/icons/asterisk.svelte';
	import Circles from '$lib/icons/circles.svelte';
	import Clip from '$lib/icons/clip.svelte';
	import Info from '$lib/icons/info.svelte';
	import Ticket from '$lib/icons/ticket.svelte';
	import { Calendario } from '$lib/states/calendario.svelte';

	let { sigla }: { sigla: string } = $props();
	const ramo = $derived(Object.values(Data.cachedRamos[sigla]).at(0));
	const [carrera, programa] = $derived.by(() => {
		if (!ramo) return [null, null];
		return [
			Data.getInfoRamoCarrera(ramo.sigla, Calendario.sede, Calendario.jornada),
			Data.getProgramaRamo(Calendario.sede, ramo.sigla)
		];
	});
</script>

{#if ramo}
	<Card class="bg-background text-foreground gap-2">
		<div class="mb-2 flex flex-row flex-wrap gap-1">
			<Tooltip content="Cantidad de alumnos máximos por paralelo">
				<Badge icon={Ticket}>{ramo.cupo} CUPOS</Badge>
			</Tooltip>
			{#if programa}
				<Tooltip content="Créditos SCT del ramo">
					<Badge icon={Circles}>{programa.creditos} SCT</Badge>
				</Tooltip>
			{/if}
		</div>

		<p class="-mb-3 w-full font-bold">{ramo.sigla}</p>
		<p class="text-sm">{ramo.nombre}</p>

		{#if programa}
			<p class="-mb-3 w-full">
				RAMO <Tooltip
					content={{
						AMBOS: 'Este ramo se dicta tanto en semestres pares como impares.',
						PAR: 'Este ramo se dicta solo en semestres pares.',
						IMPAR: 'Este ramo se dicta solo en semestres impares.',
						ELECTIVO: 'Este ramo corresponde a un electivo de la malla curricular.'
					}[programa.tipo as string]}
				>
					<span class="text-primary opacity-100">
						{programa.tipo.replace('AMBOS', 'PAR E IMPAR')}
					</span>
				</Tooltip> DEL
			</p>
		{/if}
		<p class="opacity-50">DEPTO. DE {ramo.departamento}</p>

		<!-- {#if carrera}
			<div class="flex flex-col py-2">
				{#each Object.entries(carrera.horas) as [hora, valor] (hora)}
					<p>Horas {hora}: {valor} HRS</p>
				{/each}
			</div>
		{/if} -->
		{#if programa}
			<Button
				size="sm"
				variant="secondary"
				onclick={() => {
					window.open(programa.programa, '_blank');
				}}><Clip class="inline" /> Ver programa</Button
			>
		{/if}
	</Card>
{/if}
