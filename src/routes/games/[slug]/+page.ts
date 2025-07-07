import { store } from '$lib/store/MainStore.svelte';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';


export const load: PageLoad = ({ params }) => {
	const slug = params.slug;
const isVs= true;

	// z. B. Daten aus Liste suchen
	 const game = store.games.find(g => g.title === slug);

	if (!game) throw error(404, 'Spiel nicht gefunden');

	return {
		game
    
	};
};