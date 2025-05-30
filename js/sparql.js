const startingQuery = async () => {
    let query = `SELECT ?item
WHERE {

    # Filtra gli item con cittadinanza italiana (Q38) o italiana (Q172579)
    VALUES ?v { wd:Q172579 wd:Q38 }
    ?item wdt:P27 ?v ;  # P27 = paese di cittadinanza
          wdt:P214 [] . # P214 = identificativo VIAF

    # Filtra per etichette in italiano
    ?item rdfs:label ?itemLabel . FILTER(LANG(?itemLabel) = "it")

}
LIMIT 20

# Alla query verranno aggiunti automaticamente in seguenti filtri:

# Esclusione degli item che hanno una proprietà P396
# FILTER NOT EXISTS { ?item wdt:P396 [] . }

# Esclusione degli item che hanno una proprietà P396 uguale a novalue
# FILTER NOT EXISTS { ?item a wdno:P396 . }
    `
    return query
}

const formatQuery = async (params, limit) => {
    let query = `SELECT DISTINCT ?item ?itemLabel ?itemDescription ?itemAltLabel ?image ?statementCount ?sitelinkCount ?lastModified
WHERE
{
    ${params}

    OPTIONAL { ?item schema:description ?itemDescription . FILTER(LANG(?itemDescription) = "it") }
    OPTIONAL { ?item skos:altLabel ?itemAltLabel . FILTER(LANG(?itemAltLabel) = "it") }
    OPTIONAL { ?item wdt:P18 ?image . } # P18 = immagine
    ?item wikibase:statements ?statementCount .
    ?item wikibase:sitelinks ?sitelinkCount .
    ?item schema:dateModified ?lastModified .
    FILTER NOT EXISTS { ?item wdt:P396 [] . }
    FILTER NOT EXISTS { ?item a wdno:P396 . }
}
LIMIT ${limit}   
    `;
    return query
}

const allItemQuery = async () => {
    let query = `
    SELECT (COUNT(DISTINCT ?item) AS ?itemCount)
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

    # Esclude gli item che hanno una proprietà P396 uguale a novalue
    FILTER NOT EXISTS { ?item a wdno:P396 . }
    }
    `;
    return query
}

const allEditsQuery = async () => {
    let query = `
    SELECT (COUNT(DISTINCT ?items) AS ?itemCount)
    WHERE {
        ?items p:P396 ?st .
        ?st ps:P396 ?vid ; pq:P1810 ?ind ; prov:wasDerivedFrom ?ref .
        ?ref pr:P813 ?c . FILTER(?c > "2025-02-14"^^xsd:dateTime)
        BIND(SUBSTR(STR(?items), 32) as ?titles)
        BIND(CONCAT(SUBSTR(STR(?c), 0, 11), "T00:00:00Z") as ?rvend)
        BIND(CONCAT(SUBSTR(STR(?c), 0, 11), "T23:59:59Z") as ?rvstart)
        SERVICE wikibase:mwapi
        {
            bd:serviceParam wikibase:endpoint "www.wikidata.org" .
            bd:serviceParam wikibase:api "Generator" .
            bd:serviceParam mwapi:generator "allpages" .
            bd:serviceParam mwapi:gapfrom ?titles .
            bd:serviceParam mwapi:gapto ?titles .
            bd:serviceParam mwapi:prop "revisions" .
            bd:serviceParam mwapi:rvprop "user|timestamp|comment" .
            bd:serviceParam mwapi:rvstart ?rvstart .
            bd:serviceParam mwapi:rvend ?rvend .
            ?item wikibase:apiOutputItem mwapi:title .
            ?user wikibase:apiOutput "revisions/rev/@user" .
            ?timestamp wikibase:apiOutput "revisions/rev/@timestamp" .
            ?edit_comment wikibase:apiOutput "revisions/rev/@comment" .
            bd:serviceParam wikibase:limit 500 .
        }
    FILTER CONTAINS(STR(?edit_comment), "WikiPlayground")
    }
    `;
    return query
}

const allNoMatchQuery = async () => {
    let query = `
    SELECT (COUNT(DISTINCT ?item) AS ?itemCount)
    WHERE
    {
        ?item a wdno:P396 .
        ?item wdt:P31 wd:Q5
    }
    `;
    return query
}

export { startingQuery, formatQuery, allItemQuery, allEditsQuery, allNoMatchQuery}