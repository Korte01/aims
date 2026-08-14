import { loadTeams } from '$lib/service/supabaseAPI.svelte';

export const store = $state({
	games: [
		{ title: 'Flunkyball', icon: '⚽', results: [-1, -1, -1, -1, -1, -1] },
		{ title: 'RageCage', icon: '😡', visible: false, results: [-1, -1, -1, -1, -1, -1] },
		{ title: 'Klimpern', icon: '✨', visible: true, results: [-1, -1, -1, -1, -1, -1] },
		{ title: 'Schachtelwerfen', icon: '🚬', visible: false, results: [-1, -1, -1, -1, -1, -1] },
		{ title: 'Bananenspiel', icon: '🍌', visible: false, results: [-1, -1, -1, -1, -1, -1] },
		{ title: 'Liederraten', icon: '🎵', visible: false, results: [-1, -1, -1, -1, -1, -1] },
		{ title: 'Tabu', icon: '😶', visible: false, results: [-1, -1, -1, -1, -1, -1] },
		{
			title: 'Kickern',
			icon: '⚽',
			isVs: true,
			visible: true,
			discription:
				'Die Regeln beim Kickern sind bekannt, wer zu erst 10 Tore schießt hat gewonnen.\nDrehen ist verboten und wird mit einem Regelschlug bestraft und falls ein Tor fällt wird es anoliert.\n Als Trinkspiel wird vor dem Spiel ein Einsatz pro Tor vereinbart z.B 3 Schlücke pro Tor oder z.B einen Shot.'
		},
		{
			title: 'Bierpong',
			icon: '🍺',
			isVs: true,
			visible: true,
			discription:
				'Bierpong wird nach den Hausregeln gespielt.\n Bei Unklarheiten fragen Sie irgendjemand...'
		},
		{
			title: 'Shotpong',
			icon: '🥃',
			isVs: true,
			visible: true,
			discription:
				'Shotpong kann mit Wasser und Shots gespielt (so klebt aufjedenfall alles) werden.\n Es gelten normale Bierpong regeln sofern umsetzbar. '
		},
		{
			title: 'KorkenCurling',
			icon: '🥌',
			isVs: true,
			visible: true,
			discription: 'KorkenCurling wird nach den offiziellen Spielregeln gespielt.'
		},
		{
			title: 'LoopingLouie',
			icon: '🛩️',
			isVs: true,
			visible: true,
			discription:
				'Bei LoopingLouie, gewinnt das Team was zu erst 3 Runden gewonnen hat.\n Gewonnen hat das Team, dessen Spieler als Letztes noch Chips hat.\n Bei einem Treffer müssen direkt Schlücke oder Shots getrunken werden.\n  Falls ein Spieler zu doll schlägt und ein andere chip runterfällt bekommt er ein Strafschluck und der Chip wird wieder aufgestellt.'
		},
		{
			title: 'HalliGalli',
			icon: '🛎️',
			isVs: true,
			visible: true,
			discription:
				'HalliGalli gewinnt das Team dessen Spieler am Ende alle Karten hat.\n Bei jedem falschen Schlag muss ein Schluck oder Shot getrunken werden.\n Beim richtigem Schlag muss das Gegnerteam trinken.'
		}
	],
	teams: [],
	teamID: 4,
	spielplan: [
		{
			matches: [
				{ runde: 1, teamA: 0, teamB: 5 },
				{ runde: 1, teamA: 1, teamB: 4 },
				{ runde: 1, teamA: 3, teamB: 2 }
			]
		},
		{
			matches: [
				{ runde: 2, teamA: 5, teamB: 1 },
				{ runde: 2, teamA: 2, teamB: 0 },
				{ runde: 2, teamA: 4, teamB: 3 }
			]
		},
		{
			matches: [
				{ runde: 3, teamA: 2, teamB: 5 },
				{ runde: 3, teamA: 3, teamB: 1 },
				{ runde: 3, teamA: 0, teamB: 4 }
			]
		},
		{
			matches: [
				{ runde: 4, teamA: 5, teamB: 3 },
				{ runde: 4, teamA: 4, teamB: 2 },
				{ runde: 4, teamA: 1, teamB: 0 }
			]
		},
		{
			matches: [
				{ runde: 5, teamA: 4, teamB: 5 },
				{ runde: 5, teamA: 0, teamB: 3 },
				{ runde: 5, teamA: 2, teamB: 1 }
			]
		}
	],
	activeRound: 3,
	toResult: false
});
