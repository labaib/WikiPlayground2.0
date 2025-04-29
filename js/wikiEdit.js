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
const editWikiItem = async (wikiItemId, opacMatchList, token, wapiFetch) => {
    
    // Data corrente
    let currentDate = new Date().toISOString().split('T')[0]

    let claims

    //Creazione corpo richiesta
    if (opacMatchList.length > 0) { // se c'è almeno un match valido viene inserito
        claims = await claimBodyValue(opacMatchList, currentDate)
    } else if (opacMatchList.length === 0) { // se non ci sono match viene aggiunto il valore 'novalue'
        claims = await claimBodyNoMatchValue(currentDate)
    }

    const params = new URLSearchParams();
    params.append("action", "wbeditentity");
    params.append("id", wikiItemId);
    params.append("token", token);
    params.append("format", "json");
    params.append("data", JSON.stringify({ claims: claims }));
    params.append("summary", "WikiPlayground");

    // Esecuzione chiamata POST
    let response = await wapiFetch(
        "https://www.wikidata.org/w/api.php", 
        'POST', 
        {},
        params.toString()
    )
    if (response.success === 1) {
        return true
    } else {
        console.log(response)
        return false
    }

}

export { editWikiItem };