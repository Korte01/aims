<script lang="ts">
    	import logo from '$lib/assets/logo.png';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { onMount } from 'svelte';
	import NameDrawer from './NameDrawer.svelte';

	let isOpen = $state(false);
	let startX = 0;
	let currentX = 0;
	let threshold = 50;
let admin=$state(false)
	function onTouchStart(e: TouchEvent) {
		startX = e.touches[0].clientX;
	}

	function onTouchMove(e: TouchEvent) {
		currentX = e.touches[0].clientX;
	}

	function onTouchEnd() {
		let diff = currentX - startX;
		if (!isOpen && diff > threshold) {
			isOpen = true;
		} else if (isOpen && diff < -threshold) {
			isOpen = false;
		}
	}
	onMount(() => {
     admin = localStorage.getItem('admin')=="true";
    
  });
</script>

<!-- Sidebar Overlay (for mobile) -->
<div
	class="fixed inset-0 z-40 bg-black bg-opacity-40 transition-opacity duration-300"
	on:click={() => (isOpen = false)}
	class:hidden={!isOpen}
></div>

<!-- Sidebar Container -->
<aside
	class={`fixed top-0 left-0 z-50 h-full w-64 bg-sidebar text-sidebar-foreground shadow-lg transition-transform duration-300 transform ${
		isOpen ? 'translate-x-0' : '-translate-x-full'
	}`}
>
	<div class="p-4 pl-16 font-bold text-xl"><img src={logo} alt="Logo" class="w-[70%]   " />
	</div>
<nav class="flex flex-col h-full justify-between px-2 py-2">
	<div class="flex flex-col gap-1">
		<a href="/punktetabelle" class="px-4 py-2  font-semibold text-stone-800 rounded hover:bg-sidebar-accent">🏅 Tabelle</a>
		<Separator/>
		<a href="/games" class="px-4 py-2  font-semibold text-stone-800 rounded hover:bg-sidebar-accent">🎲 Spiele</a>
		<Separator/>
		<a href="/spielplan" class="px-4 py-2 font-semibold text-stone-800 rounded hover:bg-sidebar-accent">📅 Spielplan</a>
		<Separator/>
		{#if admin}
		<a href="/adminPanel" class="px-4 py-2  font-semibold text-stone-800 rounded hover:bg-sidebar-accent">⚙️ Admin</a>
		<Separator/>
		{/if}
		<NameDrawer/>
	</div>

	<!-- Button ganz unten -->
	
</nav>

	
</aside>

<!-- Toggle Button -->
<button
	class="fixed top-4 left-4 z-50 p-2 rounded-full text-sidebar-accent-foreground shadow-md md:hidden"
	on:click={() => (isOpen = !isOpen)}
>
	☰
</button>
<div class="p-4 pl-16 bg-white shadow-md">


<img src={logo} alt="Logo" class="w-40  h-auto" />
</div>
