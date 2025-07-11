<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { tv } from 'tailwind-variants';

	const card = tv({
		base: 'rounded-lg border p-4 text-foreground text-md',
		variants: {
			variant: {
				default: 'bg-background',
				soft: 'bg-background/50'
			}
		}
	});
	let {
		children,
		class: _class,
		variant = 'default',
		...props
	}: HTMLAttributes<HTMLDivElement> & {
		variant?: keyof typeof card.variants.variant;
	} = $props();
</script>

<div class="{card({ variant })} {_class}" {...props}>
	{@render children?.()}
</div>
