import { main } from "./js/main.js";
import { getWikiToken, editWikiItem, checkLoginStatus } from "./js/wiki.js";
import { getWikiUserInfo } from 'https://cdn.jsdelivr.net/gh/labaib/getWikiUserInfo@main/index.js';


const delay = ms => new Promise(res => setTimeout(res, ms));

document.addEventListener("DOMContentLoaded", async () => {

    const login_status = document.getElementById('login_status');

    const wikiCard = document.getElementById('iframe_wiki_card');

    const infoBtn = document.getElementById('info_btn');
    const editBtn = document.getElementById('edit_btn');
    const nextBtn = document.getElementById('next_btn');

    const noticeBtn = document.getElementById('notice_btn');
    const counterBtn = document.getElementById('count_btn');

    const notFoundCard = document.createElement("div");
    notFoundCard.className = "card text-center shadow my-auto"
    notFoundCard.style.overflow = "hidden"
    notFoundCard.style.width = "fit-content"

    const notFoundCardBody = document.createElement("div");
    notFoundCardBody.className = "card-body"
    notFoundCardBody.innerHTML = `<h3 class="m-2">Nessun match trovato</h3>`
        
    const noValueBtn = document.createElement("button");
    noValueBtn.className = "btn btn-outline-dark mt-2 mb-1"
    noValueBtn.innerHTML = "<b>+</b> novalue"

    const notFoundElement = document.createElement("li");
    notFoundElement.className = "list-group-item border-0 mx-1 bg-transparent my-auto"
    notFoundCardBody.appendChild(noValueBtn)
    notFoundCard.appendChild(notFoundCardBody)
    notFoundElement.appendChild(notFoundCard)

    const listGroupElement = document.getElementById('opac_list');

    const infoModal = new bootstrap.Modal(document.getElementById('infoModal'));
    const infoBody = document.getElementById('info-body');

    const statusModal = new bootstrap.Modal(document.getElementById('statusModal'));
    const statusBody = document.getElementById('status-body');

    editBtn.setAttribute("disabled", "disabled");

    // Bottone informazioni
    infoBtn.addEventListener('click', async(event) => { 
        event.preventDefault();
        let readmeFile = await fetch('README.md');
        let readme = await readmeFile.text()
        infoBody.innerHTML = marked.parse(readme)
        infoModal.show();
    });

    const checkLogin = await getWikiUserInfo("www.wikidata.org") // Verifica credenziali
    const token = await getWikiToken()  // Ottieni token wikidata

    if (!checkLogin?.id || !token) {
        alert(`Eseguire il login in Wikidata`)
        return false;
    }

    login_status.className = "alert alert-success text-success m-0 px-2 pt-1"
    login_status.innerText = `${checkLogin.name}`

    const itemId = await main(wikiCard, counterBtn, listGroupElement, notFoundElement)

    if (!itemId) {
        location.reload()
    }

    // Bottone prossimo Item
    nextBtn.addEventListener('click', async () => { location.reload() });

    // Apri pagina di segnalazione in una nuova scheda
    noticeBtn.addEventListener('click', async (event) => {
        event.preventDefault();

        let label = window.itemLabel.replace(' ', '+')
        
        let now = new Date();
        let year = now.getFullYear();
        let currentMonth = now.getMonth() + 1; 
        let month = currentMonth < 10 ? `0${currentMonth}` : currentMonth;

        let customUrl = "https://www.wikidata.org/w/index.php"
        customUrl += `?preloadtitle=${label}+(WikiPlayground)`
        customUrl += `&preload=Wikidata:SBN/Error%20reports/preload`
        customUrl += `&preloadparams[]=${label}`
        customUrl += `&title=Wikidata:SBN/Error%20reports/${year}/${month}`
        customUrl += `&section=new&action=edit`

        window.open(customUrl, "_blank");

        return true
    });

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

    // Bottone inserimento novalue
    noValueBtn.addEventListener('click', async (event) => {
        event.preventDefault();

        noValueBtn.setAttribute("disabled", "disabled");

        const hr1 = document.createElement('hr')
        const hr2 = document.createElement('hr')
        const hr3 = document.createElement('hr')
        notFoundCardBody.appendChild(hr1)

        const inProgressLine = document.createElement('p')
        inProgressLine.className = "my-1 mx-2"
        inProgressLine.innerHTML = "Inserimento di <i>nessun valore</i> all'interno dell'elemento..."
        notFoundCardBody.appendChild(inProgressLine)

        const esitProgressLine = document.createElement('p')

        const itemProgressLine = document.createElement('h5')
        itemProgressLine.className = "my-1"
        itemProgressLine.innerHTML = `<a class="text-decoration-none" href="https://www.wikidata.org/wiki/Item:${itemId}" target="_blank">${itemId}</a>`

        let apiResponse = await editWikiItem(itemId, [], token);

        if (apiResponse) {

            notFoundCardBody.appendChild(hr2)
            
            esitProgressLine.className = "my-1 text-success"
            esitProgressLine.innerHTML = "Proprietà P396 aggiornata correttamente a <i>nessun valore</i>"
            notFoundCardBody.appendChild(esitProgressLine)

        } else {

            notFoundCardBody.appendChild(hr2)
            esitProgressLine.className = "my-1 text-danger"
            esitProgressLine.innerHTML = "Errore: elemento non aggiornato correttamente, procedere manualmente"
            notFoundCardBody.appendChild(esitProgressLine)

        }

        notFoundCardBody.appendChild(hr3)
        notFoundCardBody.appendChild(itemProgressLine)

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



