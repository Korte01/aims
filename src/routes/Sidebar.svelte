<script lang="ts">
	import logo from '$lib/assets/logo.png';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { onMount } from 'svelte';
	import NameDrawer from './NameDrawer.svelte';

	let isOpen = $state(false);
	let admin = $state(false);

	onMount(() => {
		admin = localStorage.getItem('admin') == 'true';
	});
</script>

{#if isOpen}
	<button
		type="button"
		aria-label="Menü schließen"
		class="fixed inset-0 z-40 bg-black/40"
		onclick={() => (isOpen = false)}
	></button>
{/if}

<aside
	class={`bg-sidebar text-sidebar-foreground fixed top-0 left-0 z-50 h-full w-64 transform shadow-lg transition-transform duration-300 md:w-80 ${
		isOpen ? 'translate-x-0' : '-translate-x-full'
	}`}
>
	<div class="p-4 pl-16 text-xl font-bold md:pt-8 md:pl-6">
		<img src={logo} alt="Logo" class="w-[70%] md:w-56" />
	</div>
	<nav class="flex h-[calc(100%-96px)] flex-col justify-between px-2 py-2 md:px-5">
		<div class="flex flex-col gap-1">
			<a
				href="/punktetabelle"
				class="hover:bg-sidebar-accent rounded px-4 py-2 font-semibold text-stone-800">🏅 Tabelle</a
			>
			<Separator />
			<a
				href="/games"
				class="hover:bg-sidebar-accent rounded px-4 py-2 font-semibold text-stone-800">🎲 Spiele</a
			>
			<Separator />
			<a
				href="/spielplan"
				class="hover:bg-sidebar-accent rounded px-4 py-2 font-semibold text-stone-800"
				>📅 Spielplan</a
			>
			<Separator />
			<a
				href="/voting"
				class="hover:bg-sidebar-accent rounded px-4 py-2 font-semibold text-stone-800">Voting</a
			>
			<Separator />
			{#if admin}
				<a
					href="/adminPanel"
					class="hover:bg-sidebar-accent rounded px-4 py-2 font-semibold text-stone-800">⚙️ Admin</a
				>
				<Separator />
				<a
					href="/voting-auswertung"
					class="hover:bg-sidebar-accent rounded px-4 py-2 font-semibold text-stone-800"
					>Voting Auswertung</a
				>
				<Separator />
			{/if}
			<NameDrawer />
		</div>
	</nav>
</aside>

<button
	type="button"
	aria-label="Menü öffnen"
	class="text-sidebar-accent-foreground fixed top-4 left-4 z-30 rounded-full bg-white p-2 shadow-md"
	onclick={() => (isOpen = !isOpen)}
>
	☰
</button>

<div
	class="bg-background px-4 py-4 pl-16 shadow-md md:flex md:justify-center md:border-0 md:bg-stone-100 md:px-8 md:pt-10 md:pb-4 md:shadow-none md:ring-0 md:outline-none"
>
	<img src={logo} alt="Logo" class="h-auto w-40 md:w-[50rem]" />
</div>
