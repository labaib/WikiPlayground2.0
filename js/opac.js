// Interrogazione API OPAC SBN per etichetta
const opacApi = async (itemLabel) => {

    let url = `https://opac.sbn.it/o/opac-api/titles-search-auth?`
    url += `core=autori`
    url += `&item%3A6003%3ANome=${encodeURIComponent(itemLabel)}`
    url += `&filter_nocheck:6021:Tipo_nome=Persona:A`
    
    let opacResponse = await fetch(url, { 
        credentials: "include", 
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:95.0) Gecko/20100101 Firefox/95.0",
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Accept-Language": "it,en-US;q=0.7,en;q=0.3",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache"
        },
        referrer: `https://opac.sbn.it/risultati-autori?core=autori&item%3A6003%3ANome=${encodeURIComponent(itemLabel)}`,
		mode: "cors"
    });
    let opacJson = await opacResponse.json();
    let resultList = opacJson.data.results
    
    if (resultList.length > 0) {
        return resultList
    } else {
        return []
    }

} 

// Esportazione funzione
export { opacApi }
