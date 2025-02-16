// Wikidata API Endpoint
const apiEndpoint = "https://www.wikidata.org/w/api.php"

// Ottieni numero casuale per quesry SPARQL
const getRandomInt = async (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Ottieni Item casuale che rispetti determinati criteri
const randomItem = async () => {

    let i = await getRandomInt(1, 1000) // Numero randomico per offset (ORDER BY RAND() rallenta di molto la query)

    // Query SPARQL, fonte: https://www.wikidata.org/wiki/Property_talk:P396 --> Queries for homonyms
    let query = `
    SELECT DISTINCT ?item ?itemLabel
    WHERE
    {
        # Filtra gli item con cittadinanza italiana (Q38) o italiana (Q172579)
        VALUES ?v { wd:Q172579 wd:Q38 }
        ?item wdt:P27 ?v ;  # P27 = paese di cittadinanza
                wdt:P214 [] . # P214 = identificativo VIAF

        # Filtra per etichette in italiano
        ?item rdfs:label ?itemLabel . FILTER(LANG(?itemLabel) = "it")

        # Esclude gli item che hanno una proprietà P396
        FILTER NOT EXISTS { ?item wdt:P396 [] . }
    }
    OFFSET ${i}
    LIMIT 1    
    `;

    // Chiamata API
    let wikiUrl = 'https://query.wikidata.org/sparql?query=' + encodeURIComponent( query );
    let headers = { 'Accept': 'application/sparql-results+json' };
    let response = await fetch( wikiUrl, { headers } );
    let json = await response.json();

    return json

};

// Ottieni token per autenticazione
const getWikiToken = async () => {

    let url = `${apiEndpoint}?action=query&meta=tokens&format=json`
    let response = await fetch(url, { credentials: "include" })
    let json = await response.json()
    let token = json.query.tokens.csrftoken

    return null ? token == "+\\" : token

}

// Contenuto richiesta per aggiornamento proprietà P396
const claimBodyValue = async (opacList, currentDate) => {
    
    let claims = []
    opacList.forEach(opacEntity => {
        let claimBody = {
            "mainsnak": {
                "snaktype": "value",
                "property": "P396",
                "datatype": "external-id",
                "datavalue": {
                    "value": opacEntity.Id,
                    "type": "string"
                }
            },
            "type": "statement",
            "rank": "normal",
            "qualifiers": {
                "P1810": [ // soggetto indicato come
                    {
                        "snaktype": "value",
                        "property": "P1810",
                        "datavalue": {
                            "value": opacEntity.Label, // Etichetta SBN
                            "type": "string"
                        }
                    }
                ]
            },
            "references": [
                {
                    "snaks": {
                        "P813": [ // Data di consultazione
                            {
                                "snaktype": "value",
                                "property": "P813",
                                "datavalue": {
                                    "value": {
                                        "time": `+${currentDate}T00:00:00Z`,
                                        "timezone": 0,
                                        "before": 0,
                                        "after": 0,
                                        "precision": 11, // Precisione al giorno
                                        "calendarmodel": "http://www.wikidata.org/entity/Q1985727" // Calendario gregoriano
                                    },
                                    "type": "time"
                                }
                            }
                        ]
                    }
                }
            ]
        }

        claims.push(claimBody)

    });
    return claims
}

// Contenuto richiesta per item senza match sbn 
const claimBodyNoMatchValue = async (currentDate) => {
    let claims = []
    let claimBody = {
        "mainsnak": {
            "snaktype": "novalue", // creazione poprietà con valore 'nessun valore'
            "property": "P396"
        },
        "type": "statement",
        "rank": "normal",
        "references": [
            {
                "snaks": {
                    "P813": [ // Data di consultazione
                        {
                            "snaktype": "value",
                            "property": "P813",
                            "datavalue": {
                                "value": {
                                    "time": `+${currentDate}T00:00:00Z`,
                                    "timezone": 0,
                                    "before": 0,
                                    "after": 0,
                                    "precision": 11, // Precisione al giorno
                                    "calendarmodel": "http://www.wikidata.org/entity/Q1985727" // Calendario gregoriano
                                },
                                "type": "time"
                            }
                        }
                    ]
                }
            }
        ]
    }

    claims.push(claimBody)

    return claims
}

// Esegui modifica a elemento tramite chiamata API
const editWikiItem = async (wikiItemId, opacMatchList, token) => {
    
    // Data corrente
    let currentDate = new Date().toISOString().split('T')[0]

    let claims

    //Creazione corpo richiesta
    if (opacMatchList.length > 0) { // se c'è almeno un match valido viene inserito
        claims = await claimBodyValue(opacMatchList, currentDate)
    } else if (opacMatchList.length === 0) { // se non ci sono match viene aggiunto il valore 'novalue'
        claims = await claimBodyNoMatchValue(currentDate)
    }
    
    // Parametri URL
    const params = new URLSearchParams({
        action: "wbeditentity",
        id: wikiItemId,
        token: token,
        format: "json",
        data: JSON.stringify({"claims":claims}),
        summary: "WikiPlayground" // per successivo riconoscimento
    })

    // Header chiamata
    const option = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params,
        credentials: "include" 
    }

    // Esecuzione chiamata POST
    let response = await fetch(apiEndpoint, option)
    let rjson = await response.json()
    if (rjson.success === 1) {
        return true
    } else {
        console.log(rjson)
        return false
    }

}

// Esportazione funzioni
export { randomItem, getWikiToken, editWikiItem }
