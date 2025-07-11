<script module lang="ts">
	import type { Snippet } from 'svelte';
	import { fly } from 'svelte/transition';
	import Card from '../Card.svelte';

	let tooltips: { [key: string]: Snippet<[]> | string } = $state({});
	let tooltip = $derived(Object.values(tooltips).at(0));

	export function pushTooltip(key: string, data: Snippet<[]> | string) {
		tooltips[key] = data;
	}

	export function removeTooltip(key: string) {
		if (!(key in tooltips)) return;
		delete tooltips[key];
	}
</script>

{#if tooltip}
	<div
		class="fixed bottom-4 left-1/2 z-50 max-w-[33vw] -translate-x-1/2"
		transition:fly={{ y: 20, duration: 200 }}
	>
		<Card class="w-full">
			{#if typeof tooltip === 'string'}
				{tooltip}
			{:else}
				{@render tooltip()}
			{/if}
		</Card>
	</div>
{/if}
