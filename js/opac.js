// Interrogazione API OPAC SBN per etichetta
const opacApi = async (itemLabel) => {

    let url = `https://opac.sbn.it/o/opac-api/titles-search-auth?`
    url += `core=autori`
    url += `&item%3A6003%3ANome=${encodeURIComponent(itemLabel)}`
    url += `&filter_nocheck:6021:Tipo_nome=Persona:A`

    chrome.runtime.sendMessage(
        {
            action: "callApi",
            url: url, // URL dell'API
            method: "GET", // Metodo HTTP
            headers: { "Content-Type": "application/json" }, // Intestazioni
            body: JSON.stringify({ key: "value" }) // Corpo della richiesta (opzionale)
        },
        (response) => {
            if (response.success) {
                let resultList = response.data.results
                
                if (resultList.length > 0) {
                    return resultList
                } else {
                    return []
                }
            } else {
                console.error("Errore:", response.error);
            }
        }
    );

} 

// Esportazione funzione
export { opacApi }
