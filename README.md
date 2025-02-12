# WikiPlayground
Gioco per la riconciliazione delle entità SBN con gli Items Wikidata

### Requisiti
1. [Brave browser](https://brave.com/download/): browser basato su Chromium che blocca automaticamente i messaggi per la gestione dei cookies;
2. [CORS Unblock](https://chromewebstore.google.com/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino?pli=1): estensione per browser, le richieste all'OPAC SBN effetuate dal gioco sono bloccate dai server ICCU per la violazione delle policy CORS (Cross-Origin Resource Sharing), per esegire comunque la chiamata è necessario il ricorso ad un'estensione per browser che esegua le chiamate al posto del gioco;
3. Account [Wikidata](https://www.wikidata.org/w/index.php?&title=Special:UserLogin)

### Funzionamento
Il gioco è accessibile tramite una pagina web disponbile al link (https://logo94.github.io/WikiPlayground/)[https://logo94.github.io/WikiPlayground/]



La pagina web si compone dei seguenti elementi:

<div align="center">
  <img src="https://i.imgur.com/8BgVXcY.png">
</div>

In cui:
1. iFrame che contiene la pagina relativa ad un Item Wikidata casuale sprovvisto di ID SBN, l'aggiornamento coinvolge l'Item rappresentato
2. Ricarica: bottone per il caricamento di un altro Item Wikidata casuale e relativi match nell'OPAC SBN
3. Inserisci: bottone per l'aggiunta automatica dell'ID SBN selezionato all'interno dell'Item Wikidata presente nel riquadro 1. Il bottone si attiva solo dopo aver spuntato almeno un candidato SBN
4. Conteggio: numero di match trovati all'interno dell'OPAC SBN
5. Risultati OPAC SBN: data l'etichetta dell'Item Wikidata, viene eseguita una ricerca per stringhe all'interno dell'OPAC e tutte le entità persona trovate vengono rappresentate per mezzo di un iFrame

Box candidato OPAC SBN:

<div align="center">
  <img src="https://i.imgur.com/8BgVXcY.png">
</div>


A. IFrame pagina OPAC SBN<br>
B. Link alla pagina OPAC relativa alla persona<br>
C. Link alle pubblicazioni della persona <br>
D. Switch per la selezione del match per l'import automatico di ID e Label in Wikidata<br>




