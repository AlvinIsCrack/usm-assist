<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { tv } from 'tailwind-variants';

	const button = tv({
		base: 'border border-input cursor-pointer transition-colors disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center gap-2 rounded-md',
		variants: {
			variant: {
				primary: 'bg-primary hover:bg-primary/50 text-primary-foreground',
				secondary: 'bg-secondary hover:bg-secondary/50 text-secondary-foreground',
				ghost: 'text-foreground hover:bg-input/50 border-none shadow-none',
				destructive: 'bg-destructive hover:bg-destructive/50 text-primary-foreground'
			},
			size: {
				icon: 'p-2 w-min h-auto aspect-square',
				sm: 'px-0.5 py-1 text-sm',
				default: 'px-4 py-1.5'
			}
		}
	});
	let {
		children,
		variant = 'primary',
		size = 'default',
		class: _class,
		...props
	}: HTMLButtonAttributes & {
		variant?: keyof typeof button.variants.variant;
		size?: keyof typeof button.variants.size;
	} = $props();
</script>

<button class="{button({ variant, size })} {_class}" {...props}>
	{@render children?.()}
</button>
