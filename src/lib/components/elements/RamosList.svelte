<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import { Data } from '$lib/data/data.svelte';
	import Add from '$lib/icons/add.svelte';
	import ChangeParalelo from '$lib/icons/change-paralelo.svelte';
	import Circles from '$lib/icons/circles.svelte';
	import Edit from '$lib/icons/edit.svelte';
	import Teachers from '$lib/icons/teachers.svelte';
	import { Calendario } from '$lib/states/calendario.svelte';
	import { SideBar } from '../main/sidebar/SideBar.svelte';
	import RamoWindow from '../main/sidebar/windows/RamoWindow.svelte';
	import Separator from '../ui/Separator.svelte';
</script>

<div class="flex h-full flex-col gap-1">
	<Separator />

	<h2 class="flex flex-row items-center justify-between text-sm">Ramos en el horario</h2>
	{#if !Calendario.ramos.length}
		<p class="opacity-50">No hay ninguno aún.</p>
	{:else}
		<!-- <div class="flex flex-row gap-2">
			<Badge class="uppercase">
				{Calendario.ramos.length}
				{Calendario.ramos.length === 1 ? 'Ramo' : 'Ramos'}
			</Badge>
			<Badge icon={Circles}>
				{Calendario.ramos
					.map(
						(r) => Data.getInfoRamoCarrera(r.sigla, Calendario.sede, Calendario.jornada)?.creditos
					)
					.reduce((prev, curr) => (prev ?? 0) + (curr ?? 0), 0) ?? 0} SCT
			</Badge>
		</div> -->
		{#each Calendario.ramos as ramo, i (i)}
			<!-- {@const ramoCarrera = (async () =>
				Data.getInfoRamoCarrera(ramo.sigla, Calendario.sede, Calendario.jornada))()} -->

			<div
				role="listitem"
				class="bg-popover hover:bg-accent hover:text-accent-foreground text-popover-foreground pointer-events-auto relative h-min w-full overflow-hidden rounded-lg border px-2 py-1 pl-5"
				onmouseenter={() => (Calendario.ramoPreview = ramo)}
				onmouseleave={() => (Calendario.ramoPreview = undefined)}
			>
				{#snippet profesoresSnippet()}
					<ul class="text-left">
						{#each ramo.profesor as profesor, i (i)}
							<li>{profesor}</li>
						{/each}
					</ul>
				{/snippet}

				<!-- {#await ramoCarrera}
					<div class="absolute left-0 h-full w-2 scale-y-150" style:background="#222"></div>
				{:then ramoCarrera}
					<div
						class="absolute left-0 h-full w-2 scale-y-150"
						style:background={{
							2: ''
						}[ramoCarrera?.creditos as any] ?? '#888'}
					>
					</div>
				{/await} -->

				<div class="max-w-1/2 truncate font-bold">{ramo.nombre}</div>

				<div class="text-foreground/50 pointer -mt-1 flex flex-row gap-4 text-xs">
					<b>{ramo.sigla}</b> PAR. {ramo.paralelo}
				</div>

				<div
					class="pointer-events-none absolute top-0 right-0 flex h-full w-full flex-row-reverse items-center gap-1 p-1 [&>*]:pointer-events-auto"
				>
					<Tooltip content="Eliminar">
						<Button
							variant="destructive"
							size="icon"
							onclick={() => Calendario.removeRamo(ramo.sigla)}
						>
							<Add class="scale-150 rotate-45" />
						</Button>
					</Tooltip>

					<Tooltip content="Editar/reemplazar">
						<Button
							variant="secondary"
							size="icon"
							onclick={() =>
								SideBar.setActiveWindow(RamoWindow, {
									edit: {
										sigla: ramo.sigla,
										paralelo: ramo.paralelo
									}
								})}
						>
							<Edit class="scale-150" />
						</Button>
					</Tooltip>

					<Tooltip wrapperClass="inline! p-2" content={profesoresSnippet}>
						<Teachers class="inline scale-150" />
					</Tooltip>
				</div>
			</div>
		{/each}
	{/if}
</div>
