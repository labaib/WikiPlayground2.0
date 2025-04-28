const wikiRowBody = await ((entity, wiki_id, opac) => {

    const body = `
    <div class="card w-100" style="height: fit-content;">
        <div class="row h-100">
            <!-- Immagine (a destra) -->
            <div class="col-2 d-flex my-auto">
                <img src="${entity?.image?.value ? entity.image.value : 'https://commons.wikimedia.org/wiki/Special:FilePath/Wikipedian_Profile_Picture.png'}" 
                    class="img-fluid mx-auto rounded-circle" 
                    style="height: 6em; width: 6em; object-fit: cover;" 
                    alt="...">
            </div>
            <!-- Contenuto principale (a sinistra) -->
            <div class="col-8">
                <div class="card-body p-0 pt-3 px-2">
                    <div class="card-title d-flex mb-0">
                        <h5>
                            <a href="${entity.item.value}" class="text-decoration-none" target="_blank">
                                ${entity.itemLabel.value}</a> 
                        </h5>
                        &nbsp;&nbsp;<small class="mt-1">${entity?.itemAltLabel?.value ? entity.itemAltLabel.value : ""}</small>
                        
                    </div>    
                    <p class="card-text mb-1">${entity?.itemDescription?.value ? entity.itemDescription.value : " - "}</p>
                    <div class="card-footer m-0 p-0 bg-transparent border-0">
                        <p>
                            <i>${entity?.statementCount?.value ? entity.statementCount.value : "?"} statements</i> | 
                            <i>${entity?.sitelinkCount?.value ? entity.sitelinkCount.value : "?"} sitelinks</i> | 
                            <i>${entity?.lastModified?.value ? entity.lastModified.value : "?"}</i>
                        </p>
                    </div>
                
                </div>
            </div>
            <div class="col-2 my-auto text-end">
                <button class="btn btn-success detail_btn" data-bs-toggle="tooltip" title="Apri elemento">${wiki_id}</button> <span class="badge bg-light rounded text-dark mx-2" data-bs-toggle="tooltip" title="Risultati OPAC">${opac}</span>      
            </div>
        </div>
    </div>
    `

    return body

});

// OPAC list element
const createLiElement = (key, value) => {
    const element = document.createElement("li")
    element.className = "list-group-item border-0 border-bottom"
    if (key.startsWith("P")) {
        element.innerHTML = `
            <div class="row w-100">
                <div class="col-6 text-end px-4"><b><a href="https://www.wikidata.org/wiki/Property:${key}" target="_blank">${key}</a></b></div>
                <div class="col-6 text-start"><a href="https://www.wikidata.org/wiki/Property:${value}" target="_blank">${value}</a></div>
            </div>
        `
        
    } else {
        element.innerHTML = `
            <div class="row w-100">
                <div class="col-6 text-end px-4"><b>${key}</b></div>
                <div class="col-6 text-start">${value}</div>
            </div>
        `
    }
    
    return element  
}

export { wikiRowBody, createLiElement };