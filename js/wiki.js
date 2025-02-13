const apiEndpoint = "https://www.wikidata.org/w/api.php"

const getRandomInt = async (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomItem = async () => {

    let i = await getRandomInt(1, 1000)

    let query = `
    SELECT DISTINCT ?item ?itemLabel
    WHERE {
        # Filtra gli item con cittadinanza italiana (Q38) o italiana (Q172579)
        VALUES ?v { wd:Q172579 wd:Q38 }
        ?item wdt:P27 ?v ;  # P27 = paese di cittadinanza
                wdt:P214 [] . # P214 = identificativo VIAF

        # Filtra per etichette in italiano
        ?item rdfs:label ?itemLabel . FILTER(LANG(?itemLabel) = "it")

        # Esclude gli item che hanno una proprietà P396
        FILTER NOT EXISTS { ?item wdt:P396 [] . }

        # Esclude gli item che compaiono nella proprietà "consiste di" (P527) dell'item Q132256514 (WikiPlayground SBN NoMatch DB)
        FILTER NOT EXISTS {
            wd:Q132256514 wdt:P527 ?item .
        }

    }
    OFFSET ${i}
    LIMIT 1    
    `;

    let wikiUrl = 'https://query.wikidata.org/sparql?query=' + encodeURIComponent( query );
    let headers = { 'Accept': 'application/sparql-results+json' };

    let response = await fetch( wikiUrl, { headers } );
    let json = await response.json();

    return json

};

const getWikiToken = async () => {

    let url = `${apiEndpoint}?action=query&meta=tokens&format=json`
    let response = await fetch(url, {
        credentials: "include"
    })
    let json = await response.json()
    let token = json.query.tokens.csrftoken

    if (token == "+\\") {
        return null
    } else {
        return token
    }

}

const editWikiItem = async (wikiItemId, opacList, token) => {
    
    let claims = []

    let currentDate = new Date().toISOString().split('T')[0]
    
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
            "qualifiers": {
                "P1810": [
                    {
                        "snaktype": "value",
                        "property": "P1810",
                        "datavalue": {
                            "value": opacEntity.Label,
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
            ],
            "rank": "normal"
        }

        claims.push(claimBody)

    });

    const params = new URLSearchParams({
        action: "wbeditentity",
        id: wikiItemId,
        token: token,
        format: "json",
        data: JSON.stringify({"claims":claims}),
        summary: "WikiPlayground" 
    })

    const option = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params,
        credentials: "include" 
    }

    let response = await fetch(apiEndpoint, option)
    let rjson = await response.json()
    if (rjson.success === 1) {
        return "Item modificato con successo!"
    } else {
        return "Errore: " + JSON.stringify(rjson)
    }

}

const noMatchItem = async (wikiItemId, token) => {
    
    let claims = []

    let currentDate = new Date().toISOString().split('T')[0]
    
    let claimBody = {
        "mainsnak": {
            "snaktype": "value",
            "property": "P527",
            "datavalue": {
                "value":{
                    "entity-type": "item",
                    "id": wikiItemId
                }, 
                "type": "wikibase-entityid"
            }
        },
        "type": "statement",
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
        ],
        "rank": "normal"
    }

    claims.push(claimBody)

    const params = new URLSearchParams({
        action: "wbeditentity",
        id: "Q132256514",
        token: token,
        format: "json",
        data: JSON.stringify({"claims":claims}) 
    })

    const option = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params,
        credentials: "include" 
    }

    let response = await fetch(apiEndpoint, option)
    let rjson = await response.json()
    if (rjson.success === 1) {
        return true
    } else {
        console.log("Errore:", JSON.stringify(rjson))
        return false
    }

}



export { randomItem, getWikiToken, editWikiItem, noMatchItem }
