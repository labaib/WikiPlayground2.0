// Interrogazione API OPAC SBN per etichetta
const opacApi = async (itemLabel) => {

    let url = `https://opac.sbn.it/o/opac-api/titles-search-auth?`
    url += `core=autori`
    url += `&item%3A6003%3ANome=${encodeURIComponent(itemLabel)}`
    url += `&filter_nocheck:6021:Tipo_nome=Persona:A`
    
    let opacResponse = await fetch(url);
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
