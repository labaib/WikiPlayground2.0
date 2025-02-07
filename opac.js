const opacApi = async (itemLabel) => {

    let url = `https://opac.sbn.it/o/opac-api/titles-search-auth?`
    url += `core=autori`
    url += `&item%3A6003%3ANome=${encodeURIComponent(itemLabel)}`
    url += `&filter_nocheck:6021:Tipo_nome=Persona:A`
    
    
    let opacResponse = await fetch(url);
    let opacJson = await opacResponse.json();

    let resultList = opacJson.data.results
    
    return resultList

} 

const authorBookList = async (itemLabel) => {
    
    ```let url = "https://opac.sbn.it/o/opac-api/titles-search-post?struct%3A3008=ricerca.frase%3A4%3D1&fieldstruct%5B1%5D=ricerca.parole_tutte%3A4%3D6&fieldvalue%5B0%5D=romano%2C+paola+%3C1950-%3E&fieldaccess%5B1%5D=Titolo%3A4&struct%3A8019=ricerca.parole_almeno_una%3A%40or%40&struct%3A3022=ricerca.parole_tutte%3A4%3D6&fieldstruct%5B11%5D=ricerca.parole_tutte%3A4%3D6&fieldop%5B2%5D=AND%3A%40and%40&fieldstruct%5B9%5D=ricerca.parole_tutte%3A4%3D6&struct%3A3020=ricerca.parole_tutte%3A4%3D6&fieldaccess%5B3%5D=ISBN%3A7&struct%3A3087=ricerca.parole_tutte%3A4%3D6&struct%3A1001=ricerca.parole_almeno_una%3A%40or%40&fieldop%5B0%5D=AND%3A%40and%40&fieldstruct%5B3%5D=ricerca.parole_tutte%3A4%3D6&fieldaccess%5B10%5D=Numero_opera%3A3006%3Anocheck&fieldaccess%5B9%5D=ISMN%3A1092%3Anocheck&struct%3A5522=ricerca.parole_almeno_una%3A%40or%40&struct%3A3024=ricerca.parole_tutte%3A4%3D6&fieldaccess2%5B0%5D=Nome%3A1002%3Anocheck&struct%3A3091=ricerca.parole_tutte%3A4%3D6&struct%3A3050=ricerca.parole_tutte%3A4%3D6&_cacheid=1738928654796&fieldstruct%5B0%5D=ricerca.frase_esatta%3A4%3D7&fieldstruct2%5B0%5D=ricerca.parole_tutte%3A4%3D6&struct%3A3018=ricerca.parole_tutte%3A4%3D6&fieldaccess%5B2%5D=Soggetto%3A21&fieldaccess%5B0%5D=Autore%3A1003%3Anocheck&fieldop2%5B0%5D=AND%3A%40and%40&fieldstruct%5B10%5D=ricerca.frase%3A4%3D1&fieldop%5B3%5D=AND%3A%40and%40&fieldop%5B1%5D=AND%3A%40and%40&fieldstruct%5B2%5D=ricerca.parole_tutte%3A4%3D6&fieldaccess%5B11%5D=Rappresentazione%3A3089%3Anocheck&struct%3A5533=ricerca.parole_almeno_una%3A%40or%40&struct%3A3058=ricerca.parole_tutte%3A4%3D6&struct%3A7016=ricerca.parole_tutte%3A4%3D6&core=sbn&page=1"

    let opacResponse = await fetch(url, {
        method: "POST"
    });
    let opacJson = await opacResponse.json()

    console.log(opacJson)```

    return


}

export { opacApi, authorBookList }
