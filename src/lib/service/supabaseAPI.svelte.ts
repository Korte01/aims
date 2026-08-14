import { supabase } from './supabaseClient';

export type VotingCategory = {
	id: number;
	name: string;
	first_points: number;
	sec_points: number;
	third_points: number;
};

export type VotingResult = {
	id?: number;
	teamID: number;
	votingID: number;
	first_place: number | null;
	sec_place: number | null;
	third_place: number | null;
};

const defaultVotingCategories = ['Bestes Kostuem', 'Fairplay', 'Teamgeist'];
const defaultVotingResultPoints = { first_points: 10, sec_points: 8, third_points: 6 };

type SpielplanMatch = {
	runde: number;
	teamA: number;
	teamB: number;
	winner?: number;
};

type GameRow = {
	index: number;
	title: string;
	icon: string;
	visible: boolean;
	isVs: boolean;
	discription: string;
	'1Platz': number | null;
	'2Platz': number | null;
	'3Platz': number | null;
	'4Platz': number | null;
	'5Platz': number | null;
	'6Platz': number | null;
	results?: number[];
	[key: string]: unknown;
};

export async function loadTeams() {
	const { data, error } = await supabase.from('teams').select('name, interneID');

	if (error) {
		console.error('Fehler beim Laden:', error);
		return { error: true };
	}

	console.log('Geladene Daten:', data);
	let result = [];
	const sortedData = data.sort((a, b) => a.interneID - b.interneID);
	console.log(sortedData);
	for (const element of sortedData) {
		result.push(element.name);
	}

	return result;
}
export async function loadActiveRound() {
	const { data, error } = await supabase.from('general').select('activeRound');

	if (error) {
		console.error('Fehler beim Laden:', error);
		return { error: true };
	}

	console.log('Geladene Daten:', data);

	for (const element of data) {
		return element.activeRound - 1;
	}
}

export async function loadToResult() {
	const { data, error } = await supabase.from('general').select('VotingToResult');

	if (error) {
		console.error('Fehler beim Laden:', error);
		return { error: true };
	}

	for (const element of data) {
		return Boolean(element.VotingToResult);
	}
}

export async function loadSpielplan() {
	const { data, error } = await supabase.from('spielplan').select('runde, teamA, teamB, winner');

	if (error) {
		console.error('Fehler beim Laden:', error);
		return { error: true };
	}

	console.log('Geladene Daten Spielplan:', data);
	let result: Array<{ matches: SpielplanMatch[] }> = [
		{ matches: [] },
		{ matches: [] },
		{ matches: [] },
		{ matches: [] },
		{ matches: [] }
	];
	for (const element of data) {
		result[element.runde - 1].matches.push({
			runde: element.runde,
			teamA: element.teamA,
			teamB: element.teamB,
			winner: element.winner
		});
	}
	console.log(result);

	return result;
}

export async function loadGames() {
	const { data, error } = await supabase
		.from('games')
		.select(
			'index, title, icon, visible, isVs,discription,1Platz,2Platz,3Platz,4Platz,5Platz,6Platz'
		);
	const toDelete = ['1Platz', '2Platz', '3Platz', '4Platz', '5Platz', '6Platz', 'index'];

	if (error) {
		console.error('Fehler beim Laden:', error);
		return { error: true };
	}

	console.log('Geladene Daten:', data);
	for (let element of data as GameRow[]) {
		if (!element.isVs)
			element.results = [
				element['1Platz'] ?? -1,
				element['2Platz'] ?? -1,
				element['3Platz'] ?? -1,
				element['4Platz'] ?? -1,
				element['5Platz'] ?? -1,
				element['6Platz'] ?? -1
			];
	}
	const sortedData = data.sort((a, b) => {
		// Erst nach isVisible (true vor false)
		if (a.visible !== b.visible) {
			return a.visible ? -1 : 1;
		}

		// Dann nach index (aufsteigend)
		return a.index - b.index;
	});
	let output = (sortedData as GameRow[]).map((entry) => {
		const cleaned = { ...entry };
		toDelete.forEach((key) => delete cleaned[key]);
		return cleaned;
	});
	console.log(output);

	return data;
}

export async function setWinner(runde: number, teamA: number, teamB: number, winner: number) {
	const { data, error } = await supabase
		.from('spielplan')
		.update({ winner }) // oder: { winner: winner }
		.match({ runde, teamA, teamB });

	if (error) {
		console.error('Fehler beim Setzen des Gewinners:', error);
	} else {
		console.log('Gewinner gesetzt:', data);
	}
}
export async function setActiveRound(newActiveRound: number) {
	const { data, error } = await supabase
		.from('general')
		.update({ activeRound: newActiveRound })
		.eq('id', 1);

	if (error) {
		console.error('Fehler beim Setzen des Gewinners:', error);
	} else {
		console.log('Gewinner gesetzt:', data);
	}
}

export async function setToResult(newToResult: boolean) {
	const { data, error } = await supabase
		.from('general')
		.update({ VotingToResult: newToResult })
		.eq('id', 1);

	if (error) {
		console.error('Fehler beim Setzen der Voting-Wertung:', error);
	} else {
		console.log('Voting-Wertung gesetzt:', data);
	}
}

export async function setVisible(game: string, newVisible: boolean) {
	const { data, error } = await supabase
		.from('games')
		.update({ visible: newVisible })
		.eq('title', game);

	if (error) {
		console.error('Fehler beim Setzen des Gewinners:', error);
	} else {
		console.log('Gewinner gesetzt:', data);
	}
}

export async function setPlace(game: string, teamId: number, place: number) {
	const fieldName = `${place}Platz`; // ergibt z. B. "1Platz"

	const { data, error } = await supabase
		.from('games')
		.update({ [fieldName]: teamId }) // <– dynamischer Key
		.eq('title', game);

	if (error) {
		console.error('Fehler beim Setzen des Gewinners:', error);
	} else {
		console.log('Gewinner gesetzt:', data);
	}
}

export async function updateTeamname(newName: string, teamId: number) {
	const { data, error } = await supabase.from('teams').update({ name: newName }).eq('id', teamId);

	if (error) {
		console.error('Update Fehler:', error);
	} else {
		console.log('Teamname aktualisiert:', data);
	}
}

export async function loadVotingCategories() {
	const { data, error } = await supabase
		.from('voting')
		.select('id, name, first_points, sec_points, third_points')
		.order('id', { ascending: true });

	if (error) {
		console.error('Voting-Kategorien konnten nicht geladen werden:', error);
		return { error: true };
	}

	if (data.length) return data as VotingCategory[];

	const { data: insertedData, error: insertError } = await supabase
		.from('voting')
		.insert(
			defaultVotingCategories.map((name) => ({
				name,
				...defaultVotingResultPoints
			}))
		)
		.select('id, name, first_points, sec_points, third_points')
		.order('id', { ascending: true });

	if (insertError) {
		console.error('Voting-Kategorien konnten nicht angelegt werden:', insertError);
		return { error: true };
	}

	return insertedData as VotingCategory[];
}

export async function addVotingCategory(name: string) {
	const { data, error } = await supabase
		.from('voting')
		.insert({ name, ...defaultVotingResultPoints })
		.select('id, name, first_points, sec_points, third_points')
		.single();

	if (error) {
		console.error('Voting-Kategorie konnte nicht gespeichert werden:', error);
		return { error: true };
	}

	return data as VotingCategory;
}

export async function removeVotingCategory(votingID: number) {
	const { error: resultsError } = await supabase
		.from('voting_results')
		.delete()
		.eq('votingID', votingID);

	if (resultsError) {
		console.error('Voting-Ergebnisse konnten nicht geloescht werden:', resultsError);
		return { error: true };
	}

	const { error } = await supabase.from('voting').delete().eq('id', votingID);

	if (error) {
		console.error('Voting-Kategorie konnte nicht geloescht werden:', error);
		return { error: true };
	}

	return { error: false };
}

export async function loadVotingResults(teamID?: number) {
	let query = supabase
		.from('voting_results')
		.select('id, teamID, votingID, first_place, sec_place, third_place');

	if (typeof teamID === 'number') query = query.eq('teamID', teamID);

	const { data, error } = await query;

	if (error) {
		console.error('Voting-Ergebnisse konnten nicht geladen werden:', error);
		return { error: true };
	}

	return data as VotingResult[];
}

export async function saveVotingResult(result: Omit<VotingResult, 'id'>) {
	const { error: deleteError } = await supabase
		.from('voting_results')
		.delete()
		.match({ teamID: result.teamID, votingID: result.votingID });

	if (deleteError) {
		console.error('Altes Voting-Ergebnis konnte nicht ersetzt werden:', deleteError);
		return { error: true };
	}

	const { error } = await supabase.from('voting_results').insert(result);

	if (error) {
		console.error('Voting-Ergebnis konnte nicht gespeichert werden:', error);
		return { error: true };
	}

	return { error: false };
}
