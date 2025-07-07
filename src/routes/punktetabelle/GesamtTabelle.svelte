<script lang="ts">
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import { store } from '$lib/store/MainStore.svelte';
	import { derived } from 'svelte/store';
	import Sidebar from '../Sidebar.svelte';
	import { onMount } from 'svelte';
	import { loadGames, loadSpielplan, loadTeams } from '$lib/service/supabaseAPI.svelte';
	import { onDataChanged } from '$lib/store/eventBus';
	import { flip } from 'svelte/animate';
	import Label from '$lib/components/ui/label/label.svelte';


let teams:any=$state();
let points=[10,8,6,4,2,0];
	// let teams = [
	// 	{ name: "Ei hoch 2", points: 13 },
	// 	{ name: "Tom Max", points: 8 },
	// 	{ name: "Momo Torben", points: 31 },
	// 	{ name: "Team Mexiko", points: 15 },
	// 	{ name: "Marten Feldhans", points: 12 },
	// 	{ name: "Mädels", points: 23 }
	// ].sort((a, b) => b.points - a.points);

	function getBgClass(index: number): string {
		if (index === 0) return 'bg-yellow-300';
		if (index === 1) return 'bg-gray-300';
		if (index === 2) return 'bg-orange-300';
		return 'bg-white';
	}
    onMount(async ()=>{
        store.games = await loadGames();
        store.spielplan = await loadSpielplan();
        store.teams = await loadTeams();
    let result=[];
        let allteams=store.teams;
        let i=0;
for (const team of allteams) {
    let gesPoints=0;
    for (const game of store.games) {
        if(!game.isVs){
            let place = game.results?.findIndex(value => value === i);   
            if(place!=-1)
                 gesPoints+=points[place];
    }
    }
    for (const round of store.spielplan) {
        for (const match of round.matches) {
            if(match.winner==i) gesPoints+=8;
        }
    }
    result.push({teamId:i, teamName:team,points:gesPoints})
    i++;
}

teams=result.sort((a, b) => b.points - a.points);
        const unsubscribe = onDataChanged(async () => {
			console.log('🟢 Daten haben sich geändert!');
       
    let result=[];
        let allteams=store.teams;
        let i=0;
for (const team of allteams) {
    let gesPoints=0;
    for (const game of store.games) {
        if(!game.isVs){
            let place = game.results?.findIndex(value => value === i);   
            if(place!=-1)
                 gesPoints+=points[place];
    }
    }
    for (const round of store.spielplan) {
        for (const match of round.matches) {
            if(match.winner==i) gesPoints+=8;
        }
    }
    result.push({teamId:i, teamName:team,points:gesPoints})
    i++;
}

teams=result.sort((a, b) => b.points - a.points);
			// z. B. neu rendern, anzeigen, Notification etc.
		});

		
   
return () => {
			unsubscribe();
		};
    });
 
</script>


<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-2">
    <Label class="abolute px-2 py-1   w-fit text-sm font-medium text-white bg-primary rounded-md">Gesamtpunktestand</Label>

	{#each teams as team, i (team.teamName)}
    <div animate:flip>
        <Card class={`p-4 text-lg ${getBgClass(i)} rounded-2xl shadow-md text-stone-800 relative overflow-hidden shiny`}>
            <CardContent class="flex items-center justify-between gap-4 relative z-10">
              <div class="font-black text-xl w-[40px]">{i + 1}.</div>
              <div class="text-lg font-bold flex-1 truncate">{team.teamName}</div>
              <div class="font-semibold text-right w-[80px]">{team.points}P</div>
            </CardContent>
          
            <!-- Metallischer Overlay -->
            <div class="absolute inset-0 pointer-events-none metallic-gradient"></div>
          </Card>
    </div>
	{/each}
</div>


<style>
    :global(.metallic-gradient) {
        pointer-events: none;
    background: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.5) 0%,
      rgba(255, 255, 255, 0.3) 20%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0.3) 80%,
      rgba(255, 255, 255, 0.5) 100%
    );
    background-size: 300% 300%;
    animation: shine 10s ease-in-out infinite;
    mix-blend-mode: screen;
    border-radius: inherit; /* sorgt für abgerundete Ecken passend zur Card */
  
  }
  
  
  :global(.shiny) {
  position: relative;
  overflow: hidden;
}

:global(.shiny::before) {
  content: '';
  position: absolute;
  top: 0; bottom: 0;
  left: -50%;
  width: 50%;
  pointer-events: none;

  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255,255,255,0.15) 30%,
    rgba(255,255,255,0.5) 50%,
    rgba(255,255,255,0.15) 70%,
    transparent 100%
  );

  filter: blur(10px);
  transform: skewX(-20deg);
  animation: shine-move 10s infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes shine-move {
  0% {
    left: -50%;
  }
  100% {
    left: 150%;
  }
}
  </style>