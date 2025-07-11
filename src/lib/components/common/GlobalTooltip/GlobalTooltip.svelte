<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { pushTooltip, removeTooltip } from './GlobalTooltipRenderer.svelte';

	let id = crypto.randomUUID();

	let {
		children,
		content,
		...props
	}: HTMLAttributes<HTMLDivElement> & { content: Snippet<[]> | string } = $props();

	async function handleMouseEnter(event: MouseEvent) {
		pushTooltip(id, content);
	}

	function handleMouseLeave() {
		removeTooltip(id);
	}
</script>

<div role="tooltip" onmouseenter={handleMouseEnter} onmouseleave={handleMouseLeave}>
	{@render children?.()}
</div>
