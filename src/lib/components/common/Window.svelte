<script lang="ts">
	import { MAIN_RENDERER } from '$lib/constants/ids';
	import CancelClose from '$lib/icons/cancel-close.svelte';
	import type { Snippet } from 'svelte';
	import { tick } from 'svelte';
	import Button from './Button.svelte';
	import { scale } from 'svelte/transition';
	import { windows } from '$lib/states/windows.svelte';

	// --- PROPS ---
	let {
		children,
		paneContent,
		class: _class,
		title,
		closeOutside = false,
		show = $bindable(false)
	}: {
		children?: Snippet;
		paneContent: Snippet;
		title: string;
		class?: string;
		show?: boolean;
		closeOutside?: boolean;
	} = $props();

	// --- ESTADO ---
	const myId = crypto.randomUUID(); // Identificador único para esta instancia de ventana
	let posX = $state(0);
	let posY = $state(0);
	let isDragging = $state(false);
	let dragOffsetX = $state(0);
	let dragOffsetY = $state(0);
	let paneWidth = $state<number | null>(null);
	let justFinishedDragging = $state(false);
	let containerRectOnDrag: DOMRect | null = $state(null);

	// --- ESTADO DERIVADO PARA Z-INDEX ---
	const zIndex = $derived(8000 + windows.findIndex((w) => w.id === myId));

	// --- REFERENCIAS A ELEMENTOS ---
	let wrapperElement: HTMLDivElement;
	let paneElement: HTMLDivElement;
	let containerElement: HTMLElement;

	/**
	 * Mueve el panel a una nueva posición.
	 */
	function move(newX: number, newY: number) {
		if (!paneElement || !containerElement) return;

		const containerRect = containerRectOnDrag || containerElement.getBoundingClientRect();
		const paneWidthVal = paneElement.offsetWidth;
		const paneHeight = paneElement.offsetHeight;
		const styles = window.getComputedStyle(containerElement);
		const paddingTop = parseFloat(styles.paddingTop) || 0;
		const paddingRight = parseFloat(styles.paddingRight) || 0;
		const paddingBottom = parseFloat(styles.paddingBottom) || 0;
		const paddingLeft = parseFloat(styles.paddingLeft) || 0;

		const minX = containerRect.left + paddingLeft;
		const minY = containerRect.top + paddingTop;
		const maxX = containerRect.right - paddingRight - paneWidthVal;
		const maxY = containerRect.bottom - paddingBottom - paneHeight;

		if (newX < minX) newX = minX;
		if (newY < minY) newY = minY;
		if (newX > maxX) newX = maxX;
		if (newY > maxY) newY = maxY;

		posX = newX - containerRect.left;
		posY = newY - containerRect.top;
	}

	// --- LÓGICA DE CICLO DE VIDA DE LA VENTANA ---
	$effect(() => {
		if (show) {
			if (wrapperElement && paneElement) {
				containerElement = document.getElementById(MAIN_RENDERER)!;
				if (!containerElement) {
					console.error(
						`Error: El contenedor principal con id #${MAIN_RENDERER} no fue encontrado.`
					);
					return;
				}
				containerElement.appendChild(paneElement);

				tick().then(() => {
					if (paneWidth === null) paneWidth = paneElement.offsetWidth;

					const rect = wrapperElement.getBoundingClientRect();
					let initialX = rect.right + 10;
					let initialY = rect.top + rect.height / 2 - paneElement.offsetHeight / 2;

					move(initialX, initialY);

					const cascadeOffset = 30;
					const radius = 50;
					const radiusSq = radius * radius;
					const isPositionTaken = () =>
						windows.some((win) => {
							if (win.id === myId) return false;
							const dx = posX - win.x;
							const dy = posY - win.y;
							return dx * dx + dy * dy < radiusSq;
						});

					while (isPositionTaken()) {
						initialX += cascadeOffset;
						initialY += cascadeOffset;
						move(initialX, initialY);
					}

					windows.push({ id: myId, x: posX, y: posY });
				});
			}
		} else {
			windows.splice(0, windows.length, ...windows.filter((w) => w.id !== myId));
			paneWidth = null;
			posX = 0;
			posY = 0;
		}
	});

	// --- LÓGICA PARA CERRAR AL HACER CLIC FUERA ---
	$effect(() => {
		if (show && closeOutside) {
			const handleClickOutside = (event: MouseEvent) => {
				if (justFinishedDragging) return;
				const target = event.target as Node;
				if (
					paneElement &&
					!paneElement.contains(target) &&
					wrapperElement &&
					!wrapperElement.contains(target)
				) {
					show = false;
				}
			};
			window.addEventListener('click', handleClickOutside, true);
			return () => window.removeEventListener('click', handleClickOutside, true);
		}
	});

	// --- MANEJADORES DE RATÓN ---
	function handleWindowMouseDown(event: MouseEvent) {
		// 1. Lógica de Foco (siempre se ejecuta)
		const myIndex = windows.findIndex((w) => w.id === myId);
		if (myIndex !== -1 && myIndex < windows.length - 1) {
			const myWindowObject = windows.splice(myIndex, 1)[0];
			windows.push(myWindowObject);
		}

		// 2. Lógica de Arrastre (solo si el clic es en la cabecera)
		const target = event.target as HTMLElement;
		const dragHandle = target.closest('[data-drag-handle]');

		if (dragHandle) {
			if (event.button !== 0) return;
			// Prevenir selección de texto solo al arrastrar
			event.preventDefault();

			if (!containerElement) containerElement = document.getElementById(MAIN_RENDERER)!;
			if (!containerElement) return;

			containerRectOnDrag = containerElement.getBoundingClientRect();
			isDragging = true;
			const paneRect = paneElement.getBoundingClientRect();
			dragOffsetX = event.clientX - paneRect.left;
			dragOffsetY = event.clientY - paneRect.top;

			window.addEventListener('mousemove', handleMouseMove);
			window.addEventListener('mouseup', handleMouseUp);
		}
	}

	function handleMouseMove(event: MouseEvent) {
		if (!isDragging) return;
		const newX = event.clientX - dragOffsetX;
		const newY = event.clientY - dragOffsetY;
		move(newX, newY);
	}

	function handleMouseUp() {
		if (isDragging) {
			justFinishedDragging = true;
			setTimeout(() => {
				justFinishedDragging = false;
			}, 0);
		}
		isDragging = false;
		containerRectOnDrag = null;
		window.removeEventListener('mousemove', handleMouseMove);
		window.removeEventListener('mouseup', handleMouseUp);
	}

	function close() {
		show = false;
	}
</script>

<div bind:this={wrapperElement} class="m-0 inline-block">
	{@render children?.()}
</div>

{#if show}
	<div
		bind:this={paneElement}
		style:position="absolute"
		style:left="0"
		style:top="0"
		style:transform="translate({posX}px, {posY}px)"
		style:z-index={zIndex}
		class="will-change-transform"
	>
		<div
			onmousedown={handleWindowMouseDown}
			role="dialog"
			tabindex="0"
			transition:scale={{
				start: 0.6,
				duration: 250,
				easing: (t) => Math.sin((-5 * (t + 1.0) * Math.PI) / 2) * Math.pow(2.0, -10.0 * t) + 1.0
			}}
			style:width={paneWidth ? `${paneWidth}px` : 'auto'}
			class="bg-background text-foreground ring-border flex flex-col rounded-md shadow-lg ring-2 {_class}"
		>
			<div
				data-drag-handle="true"
				style:cursor={isDragging ? 'grabbing' : 'grab'}
				class="bg-popover relative rounded-t-[inherit] border-b p-2 select-none"
			>
				<h3 class="text-md mr-10 px-2 select-none">{title}</h3>
				<Button
					onclick={close}
					variant="icon"
					class="absolute top-0 right-0 aspect-square h-full w-auto scale-75"
					aria-label="Cerrar"
				>
					<CancelClose class="icon scale-150" />
				</Button>
			</div>
			<div class="relative p-4">
				{@render paneContent()}
			</div>
		</div>
	</div>
{/if}
