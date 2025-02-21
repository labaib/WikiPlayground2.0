import { randomItemQuery } from "./sparql.js"
import { sparqlQuery } from "./wiki.js";
import { opacApi } from "./opac.js"

const main = async (wikiCard, counterBtn, listGroupElement, notFoundElement) => {

    listGroupElement.innerHTML = ""

    // Ottieni elemento casuale
    let wikiQuery = await randomItemQuery();
    let wikiResponse = await sparqlQuery(wikiQuery);
    
    // Estrai l'ID dell'elemento (Qxxxx) dall'URL
    const itemId = wikiResponse.results.bindings[0].item.value.match(/Q\d+/)[0];
    
    // Estrai l'etichetta (label) dell'elemento
    const itemLabel = wikiResponse.results.bindings[0].itemLabel.value;
    window.itemLabel = itemLabel;
    
    // IFrame Elemento Wikidata
    wikiCard.innerHTML = `
        <iframe class="card-img-top" src="https://www.wikidata.org/wiki/Item:${itemId}" style="height: 100%; width: 100%; border: none;" title="Wiki Random Page"></iframe>
    `
    // Ottieni candidati da API OPAC SBN
    let candidates = await opacApi(itemLabel)

    // Se non ci sono match viene inserito il valore novalue
    if (candidates.length === 0) {
        
        counterBtn.className = "btn btn-outline-danger my-auto mx-auto shadow"
        counterBtn.innerHTML = `<h1 class="mt-2">0</h1>`

        listGroupElement.className = "list-group list-group-horizontal justify-content-center overflow-x-auto bg-transparent p-0"
        listGroupElement.appendChild(notFoundElement)

        return itemId

    } else if (candidates.length <= 4) {
        listGroupElement.className = "list-group list-group-horizontal justify-content-center overflow-x-auto bg-transparent"
    } else if (candidates.length > 4) {
        listGroupElement.className = "list-group list-group-horizontal overflow-x-auto bg-transparent"
    }

    counterBtn.className = "btn btn-outline-success my-auto mx-auto shadow"
    counterBtn.innerHTML = `
    <h1 class="mt-2">${candidates.length}</h1>
    `

    candidates.forEach(entity => {

        let opacFrameUrl = `https://opac.sbn.it/risultati-autori/-/opac-autori/detail/${entity[0].id}`
        let entityId = entity[0].id

        let entityBid = entityId.replace("ITICCU", "")

        let entityElement = document.createElement("li")
        entityElement.className = "list-group-item border-0 mx-1 my-2 bg-transparent"
        entityElement.innerHTML = `
        <div class="card text-center shadow" style="overflow: hidden; width: fit-content; height: 100%">
            <div class="card-img-top p-0">
                <iframe src="${opacFrameUrl}" height="650" width="425" style="margin-top: -260px;" title="Iframe Example"></iframe>
            </div>
            <div class="card-body">
                <div class="row justify-content-center align-items-center">
                    <div class="col-3"></div>
                    <div class="col-3 d-flex mx-1">
                        <a type="button" href="${opacFrameUrl}" class="btn btn-outline-secondary border-0 justify-content-center align-items-center" style="width: 2.5em;  height: 2.5em; padding-left: 0.45em;" target="_blank">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor mx-2" class="bi bi-person" viewBox="0 0 16 16">
                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                            </svg>
                        </a>
                        <a type="button" href="https://opac.sbn.it/risultati-ricerca-avanzata?item%3A5032%3ABID=${entityBid}" class="btn btn-outline-secondary border-0 justify-content-center align-items-center" style="width: 2.5em;  height: 2.5em; padding-left: 0.45em;" target="_blank">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor mx-2" class="bi bi-book" viewBox="0 0 16 16">
                            <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783"/>
                            </svg>
                        </a>
                    </div>
                    <div class="col-3 mx-1 justify-content-end">
                        <div class="row">
                            <div class="col-6"></div>
                            <div class="col-6">
                                <h5 style="display: none;">${entity[0].label}</h5>
                                <p mb-2" style="display: none;">${entityId}</p>
                                <div class="form-check form-switch mt-2" style="margin-right: 0; padding-right: 0;">
                                <input class="form-check-input bg-danger my-auto" type="checkbox" id="flexSwitchCheckDefault" name="radio-button" style="transform: scale(1.5);">
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
        listGroupElement.appendChild(entityElement)
        }
    );

    return itemId

};

export { main }
