<script lang="ts">
	import type { Component } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { tv } from 'tailwind-variants';

	const badge = tv({
		base: 'rounded-4xl ring ring-background/50 h-min w-fit py-0.5 px-3 text-xs font-bold border border-input',
		variants: {
			variant: {
				default: 'bg-accent text-accent-foreground',
				danger: 'bg-destructive text-destructive-foreground',
				primary: 'bg-primary text-white shadow-sm/50 ring-transparent'
			}
		}
	});
	let {
		variant = 'default',
		children,
		icon: Icon,
		class: _class,
		...props
	}: {
		variant?: keyof typeof badge.variants.variant;
		icon?: Component;
	} & HTMLAttributes<HTMLSpanElement> = $props();
</script>

<span class="{badge({ variant })} {_class}" {...props}>
	{#if Icon}
		<Icon class="mr-1 inline scale-140" />
	{/if}
	{@render children?.()}
</span>
