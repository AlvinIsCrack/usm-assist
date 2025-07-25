<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { Data } from '$lib/data/data.svelte';
	import { Calendario } from '$lib/states/calendario.svelte';
	import { untrack } from 'svelte';
	import { SideBar } from '../SideBar.svelte';
	import Separator from '$lib/components/ui/Separator.svelte';
	import RamoSummary from '../../../elements/RamoSummary.svelte';
	import ParaleloOption from '../../../elements/ParaleloOption.svelte';
	import RamoSearch from '../../../elements/RamoSearch.svelte';

	let {
		edit
	}: {
		edit?: {
			sigla: string;
			paralelo: string;
		};
	} = $props();

	let selectedRamo = $state(edit?.sigla ?? '');
	let selectedParalelo = $state(edit?.paralelo ?? '');

	$effect(() => {
		const _ = selectedRamo;
		untrack(() => {
			selectedParalelo = '';
			Calendario.ramoPreview = undefined;
		});
	});

	$effect(() => {
		return () => {
			selectedParalelo = '';
		};
	});

	const paraleloOptions = $derived(
		Object.keys(selectedRamo ? Data.cachedRamos[selectedRamo] : []).map((paralelo) => ({
			value: paralelo
		}))
	);

	const inHorario = $derived(Calendario.hasRamo({ sigla: selectedRamo }));
</script>

<div class="flex h-full w-full flex-col gap-2 overflow-hidden overflow-y-auto">
	{#if !edit}
		<div>
			Busca y escoge el ramo
			<p class="text-xs opacity-50">
				Escribe para buscar entre los ramos disponibles. Puedes escribir la sigla o palabras del
				nombre del ramo. Si un ramo ya está en tu horario, se marcará con naranjo en la lista, y se
				reemplazará el paralelo.
			</p>
		</div>
		<RamoSearch bind:value={selectedRamo} />
	{/if}

	{#if selectedRamo}
		<RamoSummary sigla={selectedRamo} />
	{/if}

	{#if selectedRamo && paraleloOptions.length}
		<Separator />
		<div>
			Elige el paralelo
			<p class="text-xs opacity-50">
				Haz click en un paralelo para previsualizarlo en tu horario. Pulsa de nuevo para detener la
				previsualización.
			</p>
		</div>
		<div class="flex h-full w-full flex-col gap-2">
			{#each paraleloOptions as paraleloOption (paraleloOption.value)}
				{@const ramo = { ...Data.cachedRamos[selectedRamo][paraleloOption.value!] }}
				{@const selected = paraleloOption.value === selectedParalelo}

				<ParaleloOption
					disabled={Calendario.hasRamo({ sigla: ramo.sigla, paralelo: ramo.paralelo })}
					onclick={() => {
						if (selected) {
							selectedParalelo = '';
							Calendario.ramoPreview = undefined;
						} else {
							selectedParalelo = paraleloOption.value;
							Calendario.ramoPreview = ramo;
						}
					}}
					{selected}
					paralelo={ramo}
				/>
			{/each}
		</div>
	{/if}

	<Button
		class="relative bottom-0 mt-auto"
		disabled={!selectedRamo || !selectedParalelo}
		variant={inHorario ? 'destructive' : 'primary'}
		onclick={() => {
			if (!Calendario.ramoPreview) return;
			Calendario.addRamo({ ...Calendario.ramoPreview });
			SideBar.closeActiveWindow();
		}}>{inHorario ? 'Reemplazar' : 'Añadir'} ramo</Button
	>
</div>
