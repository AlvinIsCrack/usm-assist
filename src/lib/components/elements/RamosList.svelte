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
	import Badge from '../ui/Badge.svelte';
	import Separator from '../ui/Separator.svelte';
</script>

<div class="flex h-full flex-col gap-1">
	<Separator />

	<h2 class="flex flex-row items-center justify-between text-sm">Ramos en el horario</h2>
	{#if !Calendario.ramos.length}
		<p class="opacity-50">No hay ninguno aún.</p>
	{:else}
		<div class="flex flex-row gap-2">
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
		</div>
		{#each Calendario.ramos as ramo, i (i)}
			<div
				class="bg-popover text-popover-foreground relative overflow-hidden rounded-lg border px-3 py-1.5 pl-5"
			>
				{#snippet profesoresSnippet()}
					<ul class="text-left">
						{#each ramo.profesor as profesor, i (i)}
							<li>{profesor}</li>
						{/each}
					</ul>
				{/snippet}

				<div
					class="absolute left-0 h-full w-2 scale-y-150"
					style:background={ramo.color!.hexa()}
				></div>

				<Tooltip content={ramo.nombre}>
					<div class="max-w-1/2 font-bold">{ramo.sigla}</div>
				</Tooltip>

				<div class="text-foreground/50 -mt-2 flex flex-row gap-4 text-sm">
					PAR. {ramo.paralelo}
					<Tooltip wrapperClass="inline!" content={profesoresSnippet}>
						<Teachers class="inline scale-150" />
					</Tooltip>
				</div>

				<div
					class="absolute top-0 right-0 m-2 flex origin-top-right scale-90 flex-row gap-2 will-change-transform"
				>
					<Tooltip content="Editar">
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

					<Tooltip content="Eliminar">
						<Button
							variant="destructive"
							size="icon"
							onclick={() => Calendario.removeRamo(ramo.sigla)}
						>
							<Add class="scale-150 rotate-45" />
						</Button>
					</Tooltip>
				</div>
			</div>
		{/each}
	{/if}
</div>
