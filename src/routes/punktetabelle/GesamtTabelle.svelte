<script lang="ts">
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import { store } from '$lib/store/MainStore.svelte';
	import { onMount } from 'svelte';
	import { loadGames, loadSpielplan, loadTeams } from '$lib/service/supabaseAPI.svelte';
	import { onDataChanged } from '$lib/store/eventBus';
	import { flip } from 'svelte/animate';

	let teams: { teamId: number; teamName: string; points: number }[] = $state([]);
	let points = [10, 8, 6, 4, 2, 0];

	function buildResults() {
		let result = [];
		let allteams = store.teams;
		let i = 0;

		for (const team of allteams as any[]) {
			let gesPoints = 0;

			for (const game of store.games as any[]) {
				if (!game.isVs) {
					let place = game.results?.findIndex((value: number) => value === i);
					if (typeof place === 'number' && place >= 0) gesPoints += points[place];
				}
			}

			for (const round of store.spielplan as any[]) {
				for (const match of round.matches as any[]) {
					if (match.winner == i) gesPoints += 8;
				}
			}

			result.push({ teamId: i, teamName: team, points: gesPoints });
			i++;
		}

		teams = result.sort((a, b) => b.points - a.points);
	}

	function podiumClass(index: number): string {
		if (index === 0) return 'border-yellow-300 bg-yellow-50';
		if (index === 1) return 'border-neutral-300 bg-neutral-50';
		return 'border-emerald-300 bg-emerald-50';
	}

	function mobileRankClass(index: number): string {
		if (index === 0) return 'bg-yellow-300';
		if (index === 1) return 'bg-gray-300';
		if (index === 2) return 'bg-[#1cd086]';
		return 'bg-white';
	}

	function rankLabel(index: number): string {
		if (index === 0) return '1.';
		if (index === 1) return '2.';
		if (index === 2) return '3.';
		return `${index + 1}.`;
	}

	onMount(() => {
		let unsubscribe: (() => void) | undefined;

		async function init() {
			store.games = (await loadGames()) as any;
			store.spielplan = (await loadSpielplan()) as any;
			store.teams = (await loadTeams()) as any;
			buildResults();

			unsubscribe = onDataChanged(async () => {
				buildResults();
			});
		}

		init();

		return () => {
			unsubscribe?.();
		};
	});
</script>


<div class="grid grid-cols-1  gap-4 px-2 w-full">
  <div class="max-w-[600px] md:mx-auto md:max-w-[700px] lg:max-w-[900px]">    
    <Label class=" px-2 py-1   w-fit text-sm font-medium text-white bg-primary rounded-md">Gesamtpunktestand</Label>
  </div>

	{#each teams as team, i (team.teamName)}
    <div animate:flip>
        <Card class={` p-4 text-lg max-w-[600px] md:mx-auto md:max-w-[700px] lg:max-w-[900px] ${getBgClass(i)} rounded-2xl  shadow-md text-stone-800 relative overflow-hidden shiny`}>
            <CardContent class=" min-h-[30px] lg:min-h-[50px] flex items-center justify-between gap-4 relative z-10">
              <div class="font-black text-xl w-[40px] ">{i + 1}.</div>
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