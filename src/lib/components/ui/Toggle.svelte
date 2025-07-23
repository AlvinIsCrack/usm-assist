<script lang="ts">
	import { tv } from 'tailwind-variants';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	const toggle = tv({
		slots: {
			track:
				'relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-input transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
			thumb:
				'pointer-events-none block h-[20px] w-[20px] rounded-full bg-background shadow-lg ring-0 transition-transform'
		},
		variants: {
			checked: {
				true: {
					track: 'bg-primary',
					thumb: 'translate-x-5'
				},
				false: {
					thumb: 'translate-x-0'
				}
			}
		}
	});

	let {
		checked = false,
		class: _class,
		...props
	}: {
		checked?: boolean;
	} & HTMLButtonAttributes = $props();

	const { track, thumb } = toggle({ checked });
</script>

<button type="button" role="switch" aria-checked={checked} class="{track()} {_class}" {...props}>
	<span aria-hidden="true" class={thumb()} />
</button>
