import { randomItem } from "./js/wiki.js";
import { opacApi } from "./js/opac.js"

const wikiCard = document.getElementById('iframe_wiki_card');

const nextBtn = document.getElementById('next_btn');

const listGroupElement = document.getElementById('opac_list');


const main = async () => {

    listGroupElement.innerHTML = ""

    let wikiResponse = await randomItem()

    let itemId = wikiResponse.results.bindings[0].item.value.split("/").pop()
    let itemLabel = wikiResponse.results.bindings[0].itemLabel.value

    wikiCard.innerHTML = `
        <iframe class="card-img-top" src="https://www.wikidata.org/wiki/Item:${itemId}" style="height: 100%; width: 100%;" title="Wiki Random Page"></iframe>
    `
    
    let candidates = await opacApi(itemLabel)

    candidates.forEach(entity => {

        let entityElement = document.createElement("li")
        entityElement.className = "list-group-item border-0 mx-1"
        entityElement.innerHTML = `
        <div class="card text-center" style="overflow: hidden; width: fit-content;">
            <div class="card-img-top p-0">
                <iframe src="https://opac.sbn.it/risultati-autori/-/opac-autori/detail/${entity[0].id}" height="625" width="425" style="margin-top: -260px;" title="Iframe Example"></iframe>
            </div>
            <div class="card-body">
                <h5 class="card-title" style="display: none;">${entity[0].label}</h5>
                <p class="card-text mb-2" style="display: none;">${entity[0].id}</p>
                <div class="form-check form-switch d-flex justify-content-center align-items-center">
                    <input class="form-check-input bg-danger my-auto" type="checkbox" id="flexSwitchCheckDefault" style="transform: scale(1.5);">
                </div>
            </div>
        </div>
        `
        listGroupElement.appendChild(entityElement)
        }
    );

};

main()


// Next item button listener
nextBtn.addEventListener('click', function(event) {
    event.preventDefault();
    main()
});
