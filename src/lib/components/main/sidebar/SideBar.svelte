<script lang="ts" module>
	import Card from '$lib/components/ui/Card.svelte';
	import SedeSelector from './elements/SedeSelector.svelte';
	import Add from '$lib/icons/add.svelte';
	import { circOut } from 'svelte/easing';
	import RamoWindow from './windows/RamoWindow.svelte';
	import { fade, fly } from 'svelte/transition';
	import Button from '$lib/components/ui/Button.svelte';
	import RamosList from './elements/RamosList.svelte';
	import { Calendario } from '$lib/states/calendario.svelte';
	import Trash from '$lib/icons/trash.svelte';
	import Save from '$lib/icons/save.svelte';
	import Load from '$lib/icons/load.svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';

	let activeWindow: any | undefined = $state(undefined);
	export const SideBar = {
		closeActiveWindow: function () {
			activeWindow = undefined;
		},

		get activeWindow() {
			return activeWindow;
		}
	};
</script>

<div class="bg-background text-foreground relative h-full w-90 p-4">
	{#if !activeWindow}
		<div
			out:fade={{ delay: 400, duration: 50 }}
			class="flex h-full w-full flex-col gap-2 {activeWindow ? 'pointer-events-none' : ''}"
		>
			<div
				class="flex h-min w-full flex-row flex-nowrap gap-1 {!Calendario.sede
					? 'pointer-events-none opacity-50 grayscale select-none'
					: ''}"
			>
				<Button size="sm" class="w-full text-nowrap" onclick={() => (activeWindow = RamoWindow)}>
					<Add /> Añadir ramo
				</Button>
				<Tooltip content="Guardar horario">
					<Button
						variant="secondary"
						size="icon"
						disabled={!Calendario.ramos.length}
						onclick={Calendario.save}
					>
						<Save />
					</Button>
				</Tooltip>
				<Tooltip content="Cargar horario">
					<Button variant="secondary" size="icon" onclick={Calendario.load}>
						<Load />
					</Button>
				</Tooltip>
				<Tooltip content="Limpiar todo">
					<Button
						size="icon"
						disabled={!Calendario.ramos.length}
						variant="destructive"
						onclick={() =>
							confirm('¿Estás seguro? Esta acción va a borrar TODOS los ramos inscritos.') &&
							Calendario.clear()}
					>
						<Trash />
					</Button>
				</Tooltip>
			</div>
			<RamosList />
			<div class="flex h-full w-full flex-col-reverse">
				<SedeSelector />
			</div>
		</div>
	{/if}
	{#if activeWindow}
		<div
			transition:fly={{ x: '-100%', opacity: 1, easing: circOut, duration: 400 }}
			class="bg-sidebar text-sidebar-foreground absolute top-0 left-0 flex h-full w-full flex-col items-end gap-2 p-4 {activeWindow
				? 'pointer-events-auto'
				: 'pointer-events-none'}"
		>
			<Button
				class="aspect-square h-min w-auto"
				variant="ghost"
				onclick={() => {
					activeWindow = undefined;
					Calendario.ramoPreview = undefined;
				}}
			>
				<Add class="scale-150 rotate-45" />
			</Button>
			{@render activeWindow?.()}
		</div>
	{/if}
</div>
