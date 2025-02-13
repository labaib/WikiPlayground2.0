import { main } from "./js/main.js";
import { getWikiToken, editWikiItem } from "./js/wiki.js";

const delay = ms => new Promise(res => setTimeout(res, ms));

document.addEventListener("DOMContentLoaded", async () => {

    const wikiCard = document.getElementById('iframe_wiki_card');

    const nextBtn = document.getElementById('next_btn');
    const editBtn = document.getElementById('edit_btn');
    const counterBtn = document.getElementById('count_btn');

    const listGroupElement = document.getElementById('opac_list');

    const statusModal = document.getElementById('statusModal');
    const modalBody = document.getElementById('status-body');
    const modal = new bootstrap.Modal(statusModal);

    let itemId

    editBtn.setAttribute("disabled", "disabled");

    let token = await getWikiToken()

    if (!token) {
        alert(`Eseguire il login in Wikidata`)
        return false
    }

    itemId = await main(wikiCard, counterBtn, listGroupElement, token)

    // Next item button listener
    nextBtn.addEventListener('click', function(event) {

        event.preventDefault();
        counterBtn.className = "btn btn-outline-secondary mx-auto shadow"
        counterBtn.innerHTML = `
        <h1 class="mt-2">-</h1>
        `
        main(wikiCard, counterBtn, listGroupElement, token)

    });

    editBtn.addEventListener('click', async (event) => {
        event.preventDefault();

        modal.show()

        const radios = document.querySelectorAll('input[name="radio-button"]');
        
        let opacList = []

        radios.forEach(radio => {

            if (radio.value == "selected") {

                const cardInfo = radio.parentNode.parentNode

                let extId = cardInfo.querySelector('p').textContent.replace("ITICCU", "")
                let extLabel = cardInfo.querySelector('h5').textContent.replace(" , ", ", ")

                let opacObj = {
                    Id: extId,
                    Label: extLabel
                }
                opacList.push(opacObj)
            }
        });

        let apiResponse = await editWikiItem(itemId, opacList, token);

        modalBody.innerHTML = `
        <p class="mt-2">${apiResponse}</p>
        `

        await delay(2000)
        window.open(`https://www.wikidata.org/wiki/Item:${itemId}`, "_blank");
        location.reload()

        return true

    })


    document.addEventListener('click', ({ target }) => { // handler fires on root container click
        if (target.getAttribute('name') === 'radio-button') { // check if user clicks right element
            if (target.className == "form-check-input bg-danger my-auto") {
                target.className = "form-check-input bg-success my-auto"
                editBtn.removeAttribute("disabled");
                target.value = "selected"
            } else if (target.className == "form-check-input bg-success my-auto") {
                target.className = "form-check-input bg-danger my-auto"
                target.value = "on"
            }
        }
    });


});



