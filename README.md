# WikiPlayground
Gioco per la riconciliazione delle entità SBN con gli Items Wikidata

> Per poter utilizzare il gioco è necessario aver eseguito il login in Wikidata, anche da un'altra scheda del browser


### Link utili
| Link | Descrizione |
| --- | --- |
| [WikiPlayground](https://logo94.github.io/WikiPlayground/) | pagina web applicazione |
| [GitHub](https://github.com/logo94/WikiPlayground) | repository codice |
| [Q132260000](https://www.wikidata.org/wiki/Q132260000) | elemento Wikidata applicazione |
| [Property talk:P396](https://www.wikidata.org/wiki/Property_talk:P396) | pagina progetto ICCU |
| [Laboratorio Stelline 2025](https://www.wikidata.org/wiki/Wikidata:Gruppo_AIB_TBID/Stelline/2025) | pagina Wikidata del laboratorio organizzato in occasione del Convegno delle Stelline 2025 |


### Requisiti
1. [Brave browser](https://brave.com/download/): browser basato su Chromium che blocca automaticamente i messaggi per la gestione dei cookies;
2. [CORS Unblock](https://chromewebstore.google.com/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino?pli=1): estensione per browser, le richieste all'OPAC SBN effetuate dal gioco sono bloccate dai server ICCU per la violazione delle policy CORS (Cross-Origin Resource Sharing), per esegire comunque la chiamata è necessario il ricorso ad un'estensione per browser che esegua le chiamate al posto del gioco;
3. Account [Wikidata](https://www.wikidata.org/w/index.php?&title=Special:UserLogin)


### Come funziona
Il gioco esegue una query SPARQL in modo da ottenere un item casuale:

```
# SPARQL Query
SELECT DISTINCT ?item ?itemLabel
WHERE
{
    # Filtra gli item con cittadinanza italiana (Q38) o italiana (Q172579)
    VALUES ?v { wd:Q172579 wd:Q38 }
    ?item wdt:P27 ?v ;  # P27 = paese di cittadinanza
            wdt:P214 [] . # P214 = identificativo VIAF

    # Filtra per etichette in italiano
    ?item rdfs:label ?itemLabel . FILTER(LANG(?itemLabel) = "it")

    # Esclude gli item che hanno una proprietà P396
    FILTER NOT EXISTS { ?item wdt:P396 [] . }

    # Esclude gli item che hanno una proprietà P396 uguale a novalue
    FILTER NOT EXISTS { ?item a wdno:P396 . }
}
OFFSET ${i}
LIMIT 1
```


L'etichetta dell'elemento estratto viene utilizzata per la ricerca di match all'interno dell'OPAC SBN, tutti i match trovati vengono rappresentati per mezzo di un box, ogni box permette di accedere alla pagina dell'OPAC, consultare le pubblicazioni associate al match e selezionare le voci da importare in Wikidata. 

Una volta selezionati uno o più match, per mezzo del bottone azzurro viene aggiunto all'elemento di partenza un claim contenente la proprietà P396 e relativo valore. La voce viene referenziata per mezzo della proprietà P1810 che riporta la forma dell'etichetta presente nell'OPAC e la data di consultazione. 

Al termine dell'operazione di aggiornamento si aprirà in una nuova scheda del browser la pagina relativa all'Item aggiornato.

Quando una ricerca produce 0 risultati il relativo elemento viene aggiornato con il valore 'novalue' in modo da essere escluso per le future richieste

Ad ogni modifica eeguita tramite il gioco viene attribuito un edit summary dal valore "WikiPlayground"


### Guida
Il gioco è accessibile tramite una pagina web disponbile al link (https://logo94.github.io/WikiPlayground/)[https://logo94.github.io/WikiPlayground/]

La pagina web si compone dei seguenti elementi:

<div align="center">
  <img src="https://github.com/logo94/WikiPlayground/blob/main/img/wp-tutorial.png">
</div>

In cui:
1. iFrame che contiene la pagina relativa ad un Item Wikidata casuale sprovvisto di ID SBN, l'aggiornamento coinvolge l'Item rappresentato
2. Ricarica: bottone per il caricamento di un altro Item Wikidata casuale e relativi match nell'OPAC SBN
3. Inserisci: bottone per l'aggiunta automatica dell'ID SBN selezionato all'interno dell'Item Wikidata presente nel riquadro 1. Il bottone si attiva solo dopo aver spuntato almeno un candidato SBN
4. Conteggio: numero di match trovati all'interno dell'OPAC SBN
5. Risultati OPAC SBN: data l'etichetta dell'Item Wikidata, viene eseguita una ricerca per stringhe all'interno dell'OPAC e tutte le entità persona trovate vengono rappresentate per mezzo di un iFrame

Box candidato OPAC SBN:

<div align="center">
  <img src="https://github.com/logo94/WikiPlayground/blob/main/img/wp-opac-tutorial.png">
</div>


A. IFrame pagina OPAC SBN<br>
B. Link alla pagina OPAC relativa alla persona<br>
C. Link alle pubblicazioni della persona <br>
D. Switch per la selezione del match per l'import automatico di ID e Label in Wikidata<br>



### Future implementazioni
* Aggiunta dinamica della query di partenza
* Gestione dinamica del dominio (per istanze Wikibase)
* Modal statistiche d'uso WikiPlayground
