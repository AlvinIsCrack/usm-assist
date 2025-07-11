<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { tick } from 'svelte';
	import { type TransitionConfig } from 'svelte/transition';

	let {
		children,
		content,
		placement = 'bottom',
		followCursor = false,
		transition: _transition,
		show = $bindable(false),
		class: _class,
		...props
	}: HTMLAttributes<HTMLDivElement> & {
		followCursor?: boolean;
		placement?: 'right' | 'bottom';
		transition?: (p0: HTMLElement) => TransitionConfig;
		content: string | Snippet<[]>;
		show?: boolean;
	} = $props();

	let tooltipX = $state(0);
	let tooltipY = $state(0);
	let wrapperElement: HTMLDivElement;
	let tooltipElement: HTMLDivElement;

	function transition(p0: HTMLDivElement): TransitionConfig {
		return _transition?.(p0) ?? {};
	}

	async function handleMouseEnter(event: MouseEvent) {
		show = true;
		await tick();
		updateTooltipPosition(event);
	}

	function handleMouseLeave() {
		show = false;
	}

	function handleMouseMove(event: MouseEvent) {
		if (show && followCursor) updateTooltipPosition(event);
	}

	function updateTooltipPosition(event: MouseEvent) {
		if (!tooltipElement) return;

		const offsetX = 10; // Espacio entre el elemento/cursor y el tooltip
		const tooltipWidth = tooltipElement.offsetWidth;
		const tooltipHeight = tooltipElement.offsetHeight;
		const winWidth = window.innerWidth;
		const winHeight = window.innerHeight;

		let newX: number;
		let newY: number;

		if (followCursor) {
			// --- MODO: SEGUIR CURSOR ---
			if (placement === 'bottom') {
				newX = event.clientX - tooltipWidth / 2;
				newY = event.clientY + offsetX;
			} else {
				// placement === 'right'
				newX = event.clientX + offsetX;
				newY = event.clientY - tooltipHeight / 2;
			}
		} else {
			// --- MODO: POSICIÓN ESTÁTICA ---
			if (!wrapperElement) return;
			const rect = wrapperElement.getBoundingClientRect();

			if (placement === 'bottom') {
				newX = rect.left + rect.width / 2 - tooltipWidth / 2;
				newY = rect.bottom + offsetX;
				// Si no cabe abajo, muévelo arriba
				if (newY + tooltipHeight > winHeight && rect.top - tooltipHeight > 0) {
					newY = rect.top - tooltipHeight - offsetX;
				}
			} else {
				// placement === 'right'
				newX = rect.right + offsetX;
				newY = rect.top + rect.height / 2 - tooltipHeight / 2;
				// Si no cabe a la derecha, muévelo a la izquierda
				if (newX + tooltipWidth > winWidth && rect.left - tooltipWidth > 0) {
					newX = rect.left - tooltipWidth - offsetX;
				}
			}
		}

		// --- AJUSTE FINAL EN BORDES ---
		// Asegura que nunca se salga de la pantalla
		if (newX < 0) newX = offsetX;
		if (newX + tooltipWidth > winWidth) newX = winWidth - tooltipWidth;
		if (newY < 0) newY = offsetX;
		if (newY + tooltipHeight > winHeight) newY = winHeight - tooltipHeight;

		tooltipX = newX;
		tooltipY = newY;
	}
</script>

<div
	role="tooltip"
	bind:this={wrapperElement}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	onmousemove={handleMouseMove}
	{...props}
	class="relative inline-block text-sm"
>
	{@render children?.()}

	{#if show}
		<div
			transition:transition
			bind:this={tooltipElement}
			style:position="fixed"
			style:left="{tooltipX}px"
			style:top="{tooltipY}px"
			style:z-index="9999"
			style:pointer-events="none"
			class="bg-background text-foreground rounded-sm border px-3 py-1.5 whitespace-nowrap {_class}"
			{...props}
		>
			{#if typeof content === 'string'}
				{content}
			{:else}
				{@render content()}
			{/if}
		</div>
	{/if}
</div>
