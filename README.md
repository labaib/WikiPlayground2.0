# WikiPlayground
Gioco per la riconciliazione delle entità SBN con gli Items Wikidata



### Link utili
* [WikiPlayground](https://www.wikidata.org/wiki/Q132260000): Item Wikidata del gioco
* [WikiPlayground SBN NoMatch DB](https://www.wikidata.org/wiki/Q132256514): Item wikidata utilizzato per l'archiviazione degli Item Wiki che hanno zero match in OPAC SBN
* [Laboratorio Stelline 2025](https://www.wikidata.org/wiki/Wikidata:Gruppo_AIB_TBID/Stelline/2025): pagina Wikidata del laboratorio organizzato in occasione del Convegno delle Stelline 2025



### Come funziona
Il gioco interroga Wikidata in modo da ottenere gli Item che seguono i seguenti criteri:
- sono persone
- possiedono una label o un alias in italiano
- sono cittadini italiani
- non possiedono la proprietà P396 (SBN author ID)

Dalla lista ottenuta viene estratto un risultato randomico e la relativa etichetta viene cercata all'interno dell'OPAC SBN, tutti i match trovati vengono rappresentati per mezzo di iFrame, ogni opzione permette di accedere alla pagina dell'OPAC, consultare le pubblicazioni associate al match e selezionare le voci da importare in Wikidata. Una volta selezionati uno o più match, per mezzo del bottone per l'inserimento viene aggiunto all'Item Wikidata di partenza un claim contenente la proprietà P396 e relativo valore. La voce viene referenziata per mezzo della proprietà P1810 che riporta la forma dell'etichetta presente nell'OPAC. 

Al termine dell'operazione di aggiornamento si aprirà in una nuova scheda del browser la pagina relativa all'Item aggiornato.

Quando una ricerca produce 0 risultati, l'Item viene salvato come proprità P527 dell'Item WikiPlayground SBN NoMatch DB (Q132256514) in modo da essere escluso per le future richieste

Ad ogni edit viene aggiunto un summary dal valore "WikiPlayground"



### Requisiti
1. [Brave browser](https://brave.com/download/): browser basato su Chromium che blocca automaticamente i messaggi per la gestione dei cookies;
2. [CORS Unblock](https://chromewebstore.google.com/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino?pli=1): estensione per browser, le richieste all'OPAC SBN effetuate dal gioco sono bloccate dai server ICCU per la violazione delle policy CORS (Cross-Origin Resource Sharing), per esegire comunque la chiamata è necessario il ricorso ad un'estensione per browser che esegua le chiamate al posto del gioco;
3. Account [Wikidata](https://www.wikidata.org/w/index.php?&title=Special:UserLogin)

### Guida
Il gioco è accessibile tramite una pagina web disponbile al link (https://logo94.github.io/WikiPlayground/)[https://logo94.github.io/WikiPlayground/]

> Per poter utilizzare il gioco è necessario aver eseguito il login in Wikidata, anche da un'altra scheda del browser

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
