<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { Data } from '$lib/data/data.svelte';
	import Moon from '$lib/icons/moon.svelte';
	import Sun from '$lib/icons/sun.svelte';
	import { Calendario } from '$lib/states/calendario.svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import Lock from '$lib/icons/lock.svelte';
	import Warning from '$lib/icons/warning.svelte';
	import { fade } from 'svelte/transition';

	let { class: _class, ...props }: HTMLAttributes<HTMLDivElement> = $props();

	let lockedLocation: boolean = $derived(Calendario.lockedLocation);
	let selectedSede: string = $state(Calendario.sede);
	let selectedJornada: string = $state(Calendario.jornada);
	let selectedSemestre: string = $state(Calendario.semestre);

	// Actualiza la jornada y el semestre cuando cambia la sede
	$effect(() => {
		if (lockedLocation) return;
		if (
			selectedSede &&
			Data.jornadas[selectedSede] &&
			!Data.jornadas[selectedSede].includes(selectedJornada)
		)
			selectedJornada = Data.jornadas[selectedSede][0] || '';
	});

	// Actualiza el semestre cuando cambia la jornada
	$effect(() => {
		if (lockedLocation) return;
		if (
			selectedSede &&
			selectedJornada &&
			Data.semestres[selectedSede]?.[selectedJornada] &&
			!Data.semestres[selectedSede][selectedJornada].includes(selectedSemestre)
		)
			selectedSemestre = Data.semestres[selectedSede][selectedJornada][0] || '';
	});

	// Sincroniza los estados locales con el store Calendario
	// Este efecto se ejecuta cada vez que cualquiera de las variables de estado cambian
	$effect(() => {
		if (lockedLocation) return;
		Calendario.sede = selectedSede;
		Calendario.jornada = selectedJornada;
		Calendario.semestre = selectedSemestre;
	});

	let semestres = $derived(
		selectedSede && selectedJornada
			? Data.semestres[selectedSede][selectedJornada].filter((semestreKey: string) => {
					const semestreData = Data.ASIGNATURAS[selectedSede][selectedJornada][semestreKey];
					return semestreData && Object.keys(semestreData).length > 0;
				})
			: []
	);

	type SedeMatcher = [(sede: string) => boolean, string];

	const sedeMap: SedeMatcher[] = [
		[(sede: string) => sede.match(/casa central/gi) !== null, 'campus_casa_central.jpg'], // Mejorado para asegurar boolean
		[(sede: string) => sede.match(/concepci.n/gi) !== null, 'campus_concepcion.jpg'], // Mejorado para asegurar boolean
		[(sede: string) => sede.match(/vitacura/gi) !== null, 'campus_vitacura.jpg'], // Mejorado para asegurar boolean
		[(sede: string) => sede.match(/viña|JMC/gi) !== null, 'campus_viña_del_mar.jpg'], // Mejorado para asegurar boolean
		[(_: string) => true, 'campus_san_joaquin.jpg']
	];

	const sedeImageSrc = $derived(
		(sedeMap.find(([fn]) => fn(selectedSede)) as SedeMatcher)?.[1] || 'campus_san_joaquin.jpg'
	);
	const isVespertina = $derived(selectedJornada === 'Vespertina');
	const invalid = $derived(!Calendario.sede);
</script>

<div>
	<Card class="{_class} flex flex-col gap-2 overflow-hidden" {...props}>
		<div class="pointer-events-none relative mb-2 h-40 w-full will-change-contents">
			{#if invalid}
				<div
					class="sede-selector-warning-bg absolute top-0 left-0 h-full w-full origin-bottom scale-150 object-cover"
				></div>
				<div
					class="flex h-full w-full flex-col items-center justify-center gap-2 text-center leading-4"
				>
					<Warning class="scale-200" />
					<p class="z-10">Ingresa tu sede, jornada y semestre</p>
				</div>
			{:else}
				{#key sedeImageSrc}
					<img
						transition:fade
						class="absolute top-0 left-0 h-full w-full origin-bottom scale-150 object-cover"
						alt=""
						src={sedeImageSrc}
					/>
				{/key}
				{#key isVespertina}
					<img
						transition:fade
						class="absolute top-0 left-0 h-full w-full origin-bottom scale-150 mask-r-from-25% mask-r-to-75% object-cover"
						alt=""
						src="{isVespertina ? 'vespertino' : 'diurno'}.jpg"
					/>
				{/key}
			{/if}
		</div>
		{#if lockedLocation}
			<div class="text-xs">
				<Lock class="inline" /> No se puede cambiar la ubicación al tener ramos inscritos en el horario.
			</div>
		{:else}
			<div
				class="flex flex-col gap-2 {lockedLocation
					? 'pointer-events-none opacity-50 grayscale'
					: ''}"
			>
				<div>
					<p class="text-sm">Sede</p>
					<Select
						placeholder="Selecciona una sede..."
						class="w-full"
						items={Data.sedes.map((s) => ({
							value: s
						}))}
						bind:value={selectedSede}
					/>
				</div>
				<div class="flex w-full flex-row justify-between gap-1">
					{#if selectedSede && Data.jornadas[selectedSede]}
						<div class="h-full flex-1">
							<p class="text-sm">Jornada</p>
							<Select
								disabled={Data.jornadas[selectedSede].length <= 1}
								class="w-full text-sm"
								items={Data.jornadas[selectedSede].map((jornada) => ({
									value: jornada
								}))}
								bind:value={selectedJornada}
							/>
						</div>
					{/if}
					{#if selectedSede && selectedJornada}
						<div class="h-full w-2/5">
							<p class="text-sm">Semestre</p>
							<Select
								disabled={semestres.length === 1}
								class="w-full text-sm"
								items={semestres.map((s) => ({ value: s }))}
								bind:value={selectedSemestre}
							/>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</Card>
</div>

<style>
	:global(.sede-selector-warning-bg) {
		background-color: #a00a;
		animation: sede-selector-warning 500ms ease infinite alternate;
	}

	@keyframes -global-sede-selector-warning {
		from {
			background-color: #8008;
		}
	}
</style>
