<script lang="ts">
	import { Data } from '$lib/data/data.svelte';
	import { Calendario } from '$lib/states/calendario.svelte';
	import { fade, fly } from 'svelte/transition';

	let visible = $state(false);
	$effect(() => {
		setTimeout(() => {
			visible = true;
		}, 200);
	});
</script>

{#if visible}
	<div
		transition:fade={{ duration: 500, delay: 200 }}
		class="flex h-full w-full items-center justify-center"
	>
		<div>
			<div class="text-foreground text-justify text-4xl leading-8 font-black">
				INFORMACIÓN DE RAMOS ACTUALIZADA HACE
				<div
					class="update-date-calendario font-gothic-expanded -mt-3 w-full text-center text-9xl uppercase"
				>
					{Data.updateDate?.fromNow().replace('hace', '').deaccent()}
				</div>
			</div>
			<div class="w-full text-center text-sm italic opacity-50">
				Actualizado el {Data.updateDate?.format('dddd D [de] MMM/YYYY[, a las] HH:mm')}
			</div>
		</div>

		<div class="absolute bottom-0 left-1/2 -translate-x-1/2">
			<div in:fly={{ y: 100, delay: 500 }} class="text-center text-xs opacity-50">
				Esta página no está afiliada, asociada, autorizada, respaldada ni conectada de ninguna
				manera oficialmente con la <b>Universidad Técnica Federico Santa María</b> o cualquiera de sus
				subsidiarias o afiliadas. La página no recopila información, ni utiliza cookies de terceros.
			</div>
		</div>
	</div>
{/if}
