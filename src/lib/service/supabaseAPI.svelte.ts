import { supabase } from "./supabaseClient";


export async function loadTeams() {
	const { data, error } = await supabase.from('teams').select('name, interneID');

	if (error) {
		console.error('Fehler beim Laden:', error);
		return { error: true };
	}

	console.log('Geladene Daten:', data);
    let result=[];
    const sortedData = data.sort((a, b) => a.interneID - b.interneID);
console.log(sortedData);
    for (const element of sortedData) {
        result.push(element.name);
    }

	return  result ;
}
export async function loadActiveRound() {
	const { data, error } = await supabase.from('general').select('activeRound');

	if (error) {
		console.error('Fehler beim Laden:', error);
		return { error: true };
	}

	console.log('Geladene Daten:', data);
  
    for (const element of data) {
      return element.activeRound-1;
    }
	
}

export async function loadSpielplan() {
	const { data, error } = await supabase.from('spielplan').select('runde, teamA, teamB, winner');

	if (error) {
		console.error('Fehler beim Laden:', error);
		return { error: true };
	}

	console.log('Geladene Daten Spielplan:', data);
    let result=[{matches:[]},{matches:[]},{matches:[]},{matches:[]},{matches:[]}];
    for (const element of data) {
        result[element.runde-1].matches.push({runde:element.runde,teamA:element.teamA,teamB:element.teamB,winner:element.winner});
    }
    console.log(result);

	return  result ;
}

export async function loadGames() {
	const { data, error } = await supabase.from('games').select('index, title, icon, visible, isVs,discription,1Platz,2Platz,3Platz,4Platz,5Platz,6Platz');
    const toDelete = ['1Platz', '2Platz', '3Platz', '4Platz', '5Platz', '6Platz', 'index'];

	if (error) {
		console.error('Fehler beim Laden:', error);
		return { error: true };
	}

	console.log('Geladene Daten:', data);
    for (let element of data) {
        if(!element.isVs)
       element.results=[element["1Platz"] ?? -1,element["2Platz"] ?? -1,element["3Platz"] ?? -1,element["4Platz"] ?? -1,element["5Platz"] ?? -1,element["6Platz"] ?? -1];
    }
    const sortedData = data.sort((a, b) => a.index - b.index);

     let output = sortedData.map(entry => {
        const cleaned = { ...entry };
        toDelete.forEach(key => delete cleaned[key]);
        return cleaned;
      });
    console.log(output);

	return  data ;
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
  export async function setActiveRound(newActiveRound:boolean) {
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



  export async function setVisible(game:string,newVisible: bool) {
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


  export async function setPlace(game:string,teamId:number,place:number ) {
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

export async function updateTeamname(newName:string, teamId:number) {
    const { data, error } = await supabase
  .from('teams')
  .update({ name: newName })
  .eq('id', teamId);

if (error) {
  console.error('Update Fehler:', error);
} else {
  console.log('Teamname aktualisiert:', data);
}
}