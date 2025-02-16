import { main } from "./js/main.js";
import { getWikiToken, editWikiItem, checkLoginStatus } from "./js/wiki.js";

const delay = ms => new Promise(res => setTimeout(res, ms));

document.addEventListener("DOMContentLoaded", async () => {

    const wikiCard = document.getElementById('iframe_wiki_card');

    const infoBtn = document.getElementById('info_btn');
    const nextBtn = document.getElementById('next_btn');
    const editBtn = document.getElementById('edit_btn');
    const counterBtn = document.getElementById('count_btn');

    const listGroupElement = document.getElementById('opac_list');

    const infoModal = new bootstrap.Modal(document.getElementById('infoModal'));
    const infoBody = document.getElementById('info-body');

    const statusModal = new bootstrap.Modal(document.getElementById('statusModal'));
    const statusBody = document.getElementById('status-body');

    editBtn.setAttribute("disabled", "disabled");

    // Bottone informazioni
    infoBtn.addEventListener('click', async() => { 
        let readmeFile = await fetch('README.md');
        let readme = await readmeFile.text()
        infoBody.innerHTML = marked.parse(readme)
        infoModal.show();
    });

    const checkLogin = await checkLoginStatus() // Verifica credenziali
    const token = await getWikiToken()  // Ottieni token wikidata

    if (!checkLogin || !token) {
        alert(`Eseguire il login in Wikidata`)
        return false;
    }

    const itemId = await main(wikiCard, counterBtn, listGroupElement, token)

    if (!itemId) {
        location.reload()
    }

    // Bottone prossimo Item
    nextBtn.addEventListener('click', async() => { location.reload() });

    // Bottone modifica Item
    editBtn.addEventListener('click', async (event) => {
        event.preventDefault();

        statusModal.show();

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

        if (opacList.length === 0) {
            alert('Selezionare almeno un candidato')
            return true

        } else if (opacList.length > 0) {
            let apiResponse = await editWikiItem(itemId, opacList, token);
            if (apiResponse) {
                statusBody.innerHTML = `
                <p class="mt-3">"Item modificato con successo!"</p>
                <small><i>Reindirizzamento all'item aggiornato...</i></small>
                `
                await delay(2000)
                window.open(`https://www.wikidata.org/wiki/Item:${itemId}`, "_blank");
                statusModal.hide()

            } else {
                statusBody.innerHTML = `
                <p class="mt-3">"Errore durante la modifica"</p>
                <small class="my-2"><i>Riprovare o procedere alla modifica manuale dell'elemento</i></small><br>
                <h5 class="text-decoration-none"><a href="https://www.wikidata.org/wiki/Item:${itemId}" target="_blank">${itemId}</a></h5>
                `
            }

            return true
        }

    });

    // Gestione check-radio per la selezione di candidati SBN 
    document.addEventListener('click', ({ target }) => {
        if (target.getAttribute('name') === 'radio-button') {
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



