<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Drawer from "$lib/components/ui/drawer/index.js";
	import { loadActiveRound, setWinner } from "$lib/service/supabaseAPI.svelte";
	import { store } from "$lib/store/MainStore.svelte";
	import { onMount } from "svelte";
	import { writable } from "svelte/store";

	const selectedPlace = writable<number | null>(null);
	function selectPlace(n: number) {
		selectedPlace.set(n);
		// hier könntest du später z. B. ein API-Call machen
	}
	let open=$state(false);


	function win() {
		let matchID =(store.spielplan[store.activeRound].matches.findIndex(match => match.teamA === store.teamID || match.teamB === store.teamID));
		let match =(store.spielplan[store.activeRound].matches[matchID]);
		store.spielplan[store.activeRound].matches[matchID].winner=store.teamID;
		setWinner(store.activeRound+1,match.teamA,match.teamB,store.teamID);
		open=false;
	}
	function lose() {
		let matchID =(store.spielplan[store.activeRound].matches.findIndex(match => match.teamA === store.teamID || match.teamB === store.teamID));
		let match =(store.spielplan[store.activeRound].matches[matchID]);
		let enemyID=  match.teamA === store.teamID ? match.teamB : match.teamA;

		store.spielplan[store.activeRound].matches[matchID].winner=enemyID;
		setWinner(store.activeRound+1,match.teamA,match.teamB,enemyID);

		open=false;
	}
	onMount(async () => {
		store.activeRound=await loadActiveRound();


		// rounds=store.spielplan;
	});
</script>

<Drawer.Root bind:open>
	<Drawer.Trigger class="w-full">
		<Button class="w-full bg-primary text-white font-bold text-lg py-8 rounded-xl shadow hover:bg-primary/90 transition">
			Ergebnis eintragen
		</Button>
	</Drawer.Trigger>

	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title class="text-2xl">Runde {store.activeRound+1} Ergebnis</Drawer.Title>
			<Drawer.Description>Habt ihr das Spiel gewonnen?</Drawer.Description>
		</Drawer.Header>

		<!-- Auswahl 1–6 -->
		<div class="grid grid-cols-2 gap-4 p-4">
			
				<Button
					onclick={() => win()}
					class="py-6 w-full text-xl font-bold"
					variant="secondary"
				>
				🏆
					Gewonnen
				</Button>
				<Button
				onclick={() => lose()}
				class="py-6 text-xl font-bold"
				variant="secondary"
			>
			😔Verloren
			</Button>
		</div>
	
		<Drawer.Footer class="flex justify-end p-4">
			<Drawer.Close>
				<Button variant="outline">Abbrechen</Button>
			</Drawer.Close>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>
