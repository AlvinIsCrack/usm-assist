<script lang="ts">
	import { fly } from 'svelte/transition';
	import { type ColorInstance } from 'color';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Door from '$lib/icons/door.svelte';
	import { TipoBloque, type Bloque } from '$lib/data/data.svelte';
	import { Calendario } from '$lib/states/calendario.svelte';

	let { bloqueObject }: { bloqueObject: Bloque } = $props();
	let visible = $state(false);

	const ramo = $derived(bloqueObject.ramo);
	const esCátedra = bloqueObject.tipo === TipoBloque.Cátedra;
	const color: ColorInstance = ramo.color!;
	const esOscuro = color.isDark();
	const salaVálida = !bloqueObject.sala.match(/sin(?:\s+sala)?/gi);

	$effect(() => {
		visible = true;
		return () => {
			visible = false;
		};
	});
</script>

<div class="h-full w-full {!esCátedra ? 'rounded-none p-4' : ''}">
	<div class="relative h-full w-full">
		{#if visible}
			<div
				transition:fly
				class="ring-border border-input absolute flex h-full w-full flex-col justify-between ring {esCátedra
					? 'rounded-lg'
					: 'border'} {Calendario.bloqueRangeDifference > 14 ? 'p-3' : 'p-4'} {ramo.highlighted
					? 'bloque-highlighted ring-2 ring-white'
					: ''} bloque-con-brillo z-10 overflow-hidden text-left leading-4 bg-blend-multiply shadow-md/50 inset-shadow-xs inset-shadow-white/50"
				class:text-white={esOscuro}
				class:text-gray-900={!esOscuro}
				style:background="linear-gradient(to bottom right, {color.hexa()}, {color
					.rotate(30)
					.lighten(0.3)
					.desaturate(0.25)
					.hexa()})"
			>
				<div>
					<p class="line-clamp-2 text-sm leading-4 font-medium">{ramo.nombre}</p>
					<p class="font-bold" class:opacity-60={esOscuro} class:opacity-40={!esOscuro}>
						{ramo.sigla}
					</p>
					<!-- <p class="-mt-1 origin-top-left scale-200 font-mono text-sm font-black opacity-40">
						{ramo.paralelo}
					</p> -->
				</div>

				<div class="flex w-full flex-row-reverse flex-wrap items-center justify-between gap-2">
					{#if salaVálida}
						<Badge icon={Door}>
							{bloqueObject.sala}
						</Badge>
					{/if}
					{#if !esCátedra}
						<p class="uppercase" class:opacity-60={esOscuro} class:opacity-40={!esOscuro}>
							{Object.keys(TipoBloque)[Object.values(TipoBloque).indexOf(bloqueObject.tipo)]}
						</p>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	@keyframes -global-bloque-highlight-animation {
		0%,
		100% {
			opacity: 1;
		}

		50% {
			opacity: 0.75;
		}
	}

	:global(.bloque-highlighted) {
		animation: 0.5s bloque-highlight-animation 400ms cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
</style>
