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

export { randomItem }