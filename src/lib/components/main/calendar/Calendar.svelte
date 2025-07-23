<script lang="ts">
	import Badge from '$lib/components/ui/Badge.svelte';
	import {
		BLOQUE_COMIDA,
		BLOQUE_COMIDA_DURATION_MINUTES,
		BLOQUE_DURATION_MINUTES,
		BREAK_DURATION_MINUTES,
		DAY_FIRST_MINUTES
	} from '$lib/constants/usm';
	import Time from '$lib/helpers/time';
	import GroupedCell from './GroupedCell.svelte';
	import _ from 'lodash';
	import { fade } from 'svelte/transition';
	import ForkSpoon from '$lib/icons/fork-spoon.svelte';
	import { Data, Días } from '$lib/data/data.svelte';
	import { Calendario } from '$lib/states/calendario.svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';

	const [bloqueBegin, bloqueEnd] = $derived(Calendario.bloqueRange);
	const [díaBegin, díaEnd] = $derived(Calendario.range);

	const numDias = $derived(díaEnd - díaBegin + 1);
	const bloquePairs = $derived.by(() => {
		const pairs = [];
		for (let i = bloqueBegin; i <= bloqueEnd; i += 2) pairs.push(i);
		return pairs;
	});

	function bloqueToMinutes(bloque: number) {
		return (
			DAY_FIRST_MINUTES +
			BLOQUE_DURATION_MINUTES * (bloque - 1) +
			BREAK_DURATION_MINUTES * Math.floor((bloque - 1) / 2) +
			(bloque > BLOQUE_COMIDA ? BLOQUE_COMIDA_DURATION_MINUTES : 0)
		);
	}

	function bloqueToHHMM(bloque: number) {
		return Time.MinutesToHHMM(bloqueToMinutes(bloque));
	}
</script>

<div class="relative h-full w-full">
	{#if !Calendario.ramos.length && !Calendario.ramoPreview}
		<div
			transition:fade={{ duration: 200 }}
			class="absolute flex h-full w-full items-center justify-center"
		>
			<div>
				<div class="text-foreground/50 text-center text-4xl leading-8 font-black">
					INFORMACIÓN DE RAMOS ACTUALIZADA<br />
					HACE
					<Tooltip
						content="Actualizado el {Data.updateDate?.format(
							'dddd D [de] MMM/YYYY[, a las] HH:mm'
						)}"
					>
						<span class="text-foreground text-5xl uppercase underline">
							{Data.updateDate?.fromNow().replace('hace', '')}
						</span>
					</Tooltip>.
				</div>
				<ul class="my-6 ml-6 list-disc [&>li]:mt-2">
					<li>Ingresa tu sede, jornada y semestre.</li>
					<li>Da click en <b>añadir ramo</b> para buscar y añadir ramos a tu horario.</li>
					<li>
						Puedes guardar y cargar horarios de esta misma página, para guardarlas en tu computador.
					</li>
					<li>Aún no se puede exportar a PDF/imágen, srry :c.</li>
				</ul>
				Página hecha por
				<code
					class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
				>
					lukka
				</code>.

				<br />
				Si tienes reclamos, dudas o sugerencias, o si la información de los ramos está desactualizada,
				<a href="mailto:lenriquez@usm.cl">escribeme acá we</a>
				{'<3'}.
			</div>
		</div>
	{:else}
		<div
			transition:fade={{ duration: 200 }}
			class="calendar-grid absolute"
			style="--num-dias: {numDias};"
		>
			<div class="opacity-0"></div>
			<div class="opacity-0"></div>
			{#each _.range(díaBegin, díaEnd + 1) as día (día)}
				<div class="text-foreground -mb-1 flex text-sm font-bold uppercase select-none">
					{Días[día]}
				</div>
			{/each}

			{#each bloquePairs as bloquePar, i (bloquePar)}
				<div class="flex w-6 items-center justify-center text-xs font-bold select-none">
					<div class="rotate-180 text-center text-lg font-bold [writing-mode:vertical-rl]">
						<span class="whitespace-nowrap">{bloquePar} — {bloquePar + 1}</span>
					</div>
				</div>

				{#key bloquePar}
					{@const bloqueComida = bloquePar - 1 === BLOQUE_COMIDA}
					<div class="relative h-full w-4">
						{#if bloqueComida}
							<div class="absolute -top-4 -right-2 z-50 translate-x-full">
								<Badge variant="primary" class="whitespace-nowrap">
									<ForkSpoon class="mr-1 inline scale-150" />
									Post-almuerzo
								</Badge>
							</div>
						{/if}
						<div
							class="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-transparent text-xs font-bold select-none"
						>
							<div
								class="absolute top-0 left-0 h-full w-full animate-[bloque-animation_1s] rounded-sm bg-white opacity-0"
							></div>
							<div
								class="absolute top-1 z-50 flex w-full origin-top flex-col items-center justify-center"
							>
								<div class="rotate-180 items-center gap-2 text-center [writing-mode:vertical-rl]">
									<span>{bloqueToHHMM(bloquePar)}</span><br />
								</div>
							</div>
							<div class="absolute bottom-1 flex w-full origin-bottom justify-center">
								<div class="rotate-180 font-light opacity-50 [writing-mode:vertical-rl]">
									<span
										>{Time.MinutesToHHMM(
											bloqueToMinutes(bloquePar + 1) + BLOQUE_DURATION_MINUTES
										)}</span
									>
								</div>
							</div>
						</div>
					</div>
				{/key}

				{#each _.range(díaBegin, díaEnd + 1) as día (día)}
					<GroupedCell {día} bloque={bloquePar} />
				{/each}
			{/each}
		</div>
	{/if}
</div>

<style lang="postcss">
	@import 'tailwindcss';

	@keyframes -global-bloque-animation {
		0% {
			opacity: 1;
		}
	}

	.calendar-grid {
		display: grid;
		/* [!] Modificado: Se añade "auto" para la nueva columna de bloques */
		grid-template-columns: min-content auto repeat(var(--num-dias), 1fr);
		grid-template-rows: 0fr;
		grid-auto-rows: auto;
		@apply h-full w-full gap-1 overflow-visible;
	}
</style>
