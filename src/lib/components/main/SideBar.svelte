<script lang="ts">
	// SVELTE
	import { type Component, type Snippet } from 'svelte';

	// COMPONENTS
	import Button from '../common/Button.svelte';
	import GlobalTooltip from '$lib/components/common/GlobalTooltip/GlobalTooltip.svelte';
	import Window from '../common/Window.svelte';

	// WINDOW CONTENT
	import RamoWindow from '../windows/RamoWindow.svelte';
	import ContactWindow from '../windows/ContactWindow.svelte';

	// ICONS
	import AddRamo from '$lib/icons/add.svelte';
	import ChangeHouse from '$lib/icons/change-house.svelte';
	import Contact from '$lib/icons/contact.svelte';
	import SedeJornadaWindow from '../windows/SedeJornadaWindow.svelte';

	// --- ESTADO ---
	// Definir los posibles IDs como un tipo
	type WindowKey = 'ramo' | 'jornadaSede' | 'contacto';

	// Centralizamos la visibilidad de todas las ventanas en un solo objeto.
	let windowsVisible = $state<Record<WindowKey, boolean>>({
		ramo: false,
		jornadaSede: false,
		contacto: false
	});

	// --- DATOS ---
	// Un array de objetos define cada opción de la barra lateral.
	// Esto elimina la repetición en el HTML y facilita futuras modificaciones.
	const sidebarOptions: Array<{
		id: WindowKey;
		Icon: typeof AddRamo;
		WindowContent: Component;
		windowTitle: string;
		tooltipHeader: string;
		tooltipBody: string;
	}> = [
		{
			id: 'ramo',
			Icon: AddRamo,
			WindowContent: RamoWindow,
			windowTitle: 'Buscar y Añadir Ramo',
			tooltipHeader: 'Añadir ramo',
			tooltipBody:
				'Busca una asignatura y agrégala a tu horario. El sistema visualizará los topes de hora en tiempo real y te mostrará la información clave del curso.'
		},
		{
			id: 'jornadaSede',
			Icon: ChangeHouse,
			WindowContent: SedeJornadaWindow,
			windowTitle: 'Seleccionar Sede y Jornada',
			tooltipHeader: 'Sede y Jornada',
			tooltipBody:
				'Define tu sede y el tipo de jornada (diurna o vespertina) para filtrar las asignaturas disponibles y personalizar tu búsqueda.'
		},
		{
			id: 'contacto',
			Icon: Contact,
			WindowContent: ContactWindow,
			windowTitle: 'Contacto',
			tooltipHeader: 'Contacto',
			tooltipBody:
				'¿Tienes dudas, sugerencias o encontraste un error? Contáctate con el desarrollador para recibir ayuda o enviar tus comentarios.'
		}
	];
</script>

{#snippet option(tooltipHeader: string, tooltipBody: string | Snippet<[]>, content: any)}
	{#snippet tooltip()}
		<div class="flex w-full flex-col items-start">
			{#if tooltipHeader}
				<h2 class="font-bold">{tooltipHeader}</h2>
			{/if}
			{#if typeof tooltipBody === 'string'}
				<p class="opacity-60">{tooltipBody}</p>
			{:else}
				{@render tooltipBody()}
			{/if}
		</div>
	{/snippet}

	<GlobalTooltip content={tooltip}>
		{@render content()}
	</GlobalTooltip>
{/snippet}

<div class="flex h-full w-min flex-col gap-2 border-r p-2">
	{#each sidebarOptions as optionData (optionData.id)}
		{#snippet button()}
			<Button variant="icon" onclick={() => (windowsVisible[optionData.id] = true)}>
				<svelte:component this={optionData.Icon} class="icon" />
			</Button>
		{/snippet}
		<Window bind:show={windowsVisible[optionData.id]} title={optionData.windowTitle} class="m-2">
			{@render option(optionData.tooltipHeader, optionData.tooltipBody, button)}

			{#snippet paneContent()}
				<svelte:component this={optionData.WindowContent} />
			{/snippet}
		</Window>
	{/each}
</div>
