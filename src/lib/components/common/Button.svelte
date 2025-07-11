<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { tv } from 'tailwind-variants';

	const button = tv({
		base: 'border rounded-sm flex justify-center items-center transition-all duration-100 hover:bg-accent-foreground/10 hover:cursor-pointer active:bg-accent-foreground/30',
		variants: {
			variant: {
				icon: 'aspect-square w-auto h-auto',
				default: ''
			}
		}
	});

	type variants = 'icon' | 'default';
	let {
		children,
		class: _class,
		variant = 'default',
		...props
	}: HTMLAttributes<HTMLButtonElement> & { variant: variants } = $props();
</script>

<button class="{button({ variant: variant })} {_class}" {...props}>
	{@render children?.()}
</button>
