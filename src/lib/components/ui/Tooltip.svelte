<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue, HTMLAttributes } from 'svelte/elements';
	import { tv } from 'tailwind-variants';
	import { BROWSER } from 'esm-env';
	import { fade } from 'svelte/transition';

	let {
		children,
		content,
		position = 'bottom',
		followCursor = false,
		disablePortal = false,
		class: _class,
		offset = 8,
		wrapperClass,
		...props
	}: {
		wrapperClass?: ClassValue;
		content?: string | Snippet;
		position?: 'top' | 'bottom' | 'left' | 'right';
		followCursor?: boolean;
		disablePortal?: boolean;
		offset?: number;
	} & HTMLAttributes<HTMLDivElement> = $props();

	// Se elimina la variante `visible` y las clases de transición de opacidad.
	// La visibilidad ahora la controla el bloque `{#if}` y la directiva `transition:`.
	const tooltip = tv({
		base: 'absolute w-max pointer-events-auto max-w-xs text-center z-[1000] rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md',
		variants: {
			position: {
				top: 'bottom-full left-1/2',
				bottom: 'top-full left-1/2',
				left: 'right-full top-1/2',
				right: 'left-full top-1/2'
			}
		}
	});

	// --- Estado y Referencias ---
	let visible = $state(false);
	let style = $state('');
	let wrapperEl: HTMLDivElement | undefined;
	let tooltipEl: HTMLDivElement | undefined;

	const boundaryPadding = 4;

	function handlePointerMove(e: PointerEvent) {
		if (!followCursor || !tooltipEl) return;
		const tooltipRect = tooltipEl.getBoundingClientRect();
		const viewportW = window.innerWidth;
		const viewportH = window.innerHeight;
		const margin = 15;
		let x = e.clientX + margin;
		let y = e.clientY + margin;
		if (x + tooltipRect.width > viewportW - boundaryPadding) {
			x = e.clientX - tooltipRect.width - margin;
		}
		if (y + tooltipRect.height > viewportH - boundaryPadding) {
			y = e.clientY - tooltipRect.height - margin;
		}
		if (x < boundaryPadding) {
			x = boundaryPadding;
		}
		if (y < boundaryPadding) {
			y = boundaryPadding;
		}
		style = `position: fixed; left: ${x}px; top: ${y}px;`;
	}

	// Efecto para portalizar el tooltip
	$effect(() => {
		if (BROWSER && tooltipEl && !disablePortal) {
			const target = document.querySelector('#tooltip-portal');
			if (target) {
				target.appendChild(tooltipEl);
				return () => {
					if (tooltipEl && target.contains(tooltipEl)) {
						target.removeChild(tooltipEl);
					}
				};
			}
		}
	});

	// Efecto para calcular la posición del tooltip y la flecha
	$effect(() => {
		if (visible && !disablePortal && !followCursor && wrapperEl && tooltipEl) {
			const triggerRect = wrapperEl.getBoundingClientRect();
			const tooltipRect = tooltipEl.getBoundingClientRect();
			const viewportW = window.innerWidth;
			const viewportH = window.innerHeight;
			let x = 0;
			let y = 0;
			switch (position) {
				case 'top':
					x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
					y = triggerRect.top - tooltipRect.height - offset;
					break;
				case 'bottom':
					x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
					y = triggerRect.bottom + offset;
					break;
				case 'left':
					x = triggerRect.left - tooltipRect.width - offset;
					y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
					break;
				case 'right':
					x = triggerRect.right + offset;
					y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
					break;
			}
			if (x < boundaryPadding) {
				x = boundaryPadding;
			}
			if (x + tooltipRect.width > viewportW - boundaryPadding) {
				x = viewportW - tooltipRect.width - boundaryPadding;
			}
			if (y < boundaryPadding) {
				if (position === 'top') {
					const flippedY = triggerRect.bottom + offset;
					if (flippedY + tooltipRect.height < viewportH - boundaryPadding) {
						y = flippedY;
					} else {
						y = boundaryPadding;
					}
				} else {
					y = boundaryPadding;
				}
			}
			if (y + tooltipRect.height > viewportH - boundaryPadding) {
				if (position === 'bottom') {
					const flippedY = triggerRect.top - tooltipRect.height - offset;
					if (flippedY > boundaryPadding) {
						y = flippedY;
					} else {
						y = viewportH - tooltipRect.height - boundaryPadding;
					}
				} else {
					y = viewportH - tooltipRect.height - boundaryPadding;
				}
			}
			style = `position: fixed; left: ${x}px; top: ${y}px;`;
		} else if (!visible) {
			style = '';
		}
	});
</script>

<div
	class="relative inline-flex cursor-help {wrapperClass}"
	onpointerenter={() => (visible = true)}
	onpointerleave={() => (visible = false)}
	onpointermove={handlePointerMove}
	bind:this={wrapperEl}
>
	{@render children?.()}

	{#if content && visible}
		<div
			class="{tooltip({
				position: disablePortal || followCursor ? undefined : position
			})} font-light {_class}"
			{style}
			bind:this={tooltipEl}
			{...props}
			transition:fade={{ duration: 100 }}
		>
			{#if typeof content === 'string'}
				{content}
			{:else}
				{@render content()}
			{/if}
		</div>
	{/if}
</div>
