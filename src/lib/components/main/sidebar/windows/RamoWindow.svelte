<script module>
	let selectedParalelo = $state('');
	export const RamoWindow = {
		get selectedParalelo() {
			return selectedParalelo;
		}
	};
</script>

<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { Data } from '$lib/data/data.svelte';
	import { Calendario } from '$lib/states/calendario.svelte';
	import { untrack } from 'svelte';
	import { SideBar } from '../SideBar.svelte';
	import Separator from '$lib/components/ui/Separator.svelte';
	import RamoSummary from '../elements/RamoSummary.svelte';
	import ParaleloOption from '../elements/ParaleloOption.svelte';
	import RamoSearch from '../elements/RamoSearch.svelte';

	let selectedRamoSigla = $state('');

	$effect(() => {
		const _ = selectedRamoSigla;
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
		Object.keys(selectedRamoSigla ? Data.cachedRamos[selectedRamoSigla] : []).map((paralelo) => ({
			value: paralelo
		}))
	);

	const inHorario = $derived(Calendario.hasRamo({ sigla: selectedRamoSigla }));
</script>

<div class="flex h-full w-full flex-col gap-2 overflow-hidden overflow-y-auto">
	<div>
		Busca y escoge el ramo
		<p class="text-sm opacity-50">
			Escribe para buscar entre los ramos disponibles. Si un ramo ya está en tu horario, se marcará
			con naranjo en la lista, y se reemplazará.
		</p>
	</div>
	<RamoSearch bind:value={selectedRamoSigla} />

	{#if selectedRamoSigla}
		<RamoSummary sigla={selectedRamoSigla} />
	{/if}

	{#if selectedRamoSigla && paraleloOptions.length}
		<Separator />
		<div>
			Elige el paralelo
			<p class="text-sm opacity-50">
				Haz click en un paralelo para previsualizarlo en tu horario. Pulsa de nuevo para detener la
				previsualización.
			</p>
		</div>
		<div class="flex h-full w-full flex-col gap-2">
			{#each paraleloOptions as paraleloOption (paraleloOption.value)}
				{@const ramo = { ...Data.cachedRamos[selectedRamoSigla][paraleloOption.value!] }}
				{@const selected = paraleloOption.value === selectedParalelo}

				<ParaleloOption
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
		disabled={!selectedRamoSigla || !selectedParalelo}
		variant={inHorario ? 'destructive' : 'primary'}
		onclick={() => {
			if (!Calendario.ramoPreview) return;
			Calendario.addRamo({ ...Calendario.ramoPreview });
			SideBar.closeActiveWindow();
		}}>{inHorario ? 'Reemplazar' : 'Añadir'} ramo</Button
	>
</div>
