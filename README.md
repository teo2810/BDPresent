# BDPresent

Sfida di compleanno privata. Cento punti, oppure niente regalo.

Il gioco sta tutto in [`index.html`](index.html): si apre da solo, anche su iPhone, senza installare nulla. Va aperto via **https** (repo privato, oppure l'app pubblicata). Non è pensato per essere messo online in chiaro.

## Cosa non è nel repository

`regalo.pdf` **non c'è**. Non c'è un link, non c'è un file da scaricare a vista. Il PDF è cifrato dentro la pagina (XOR a 128 bit, la chiave è spezzata e viene usata solo se il punteggio arriva a 100). Il download si chiama `regalo.pdf` e nasce in quel momento, nel telefono di chi ha vinto.

Questo ferma chi apre il progetto e cerca il file. **Non** ferma chi sa leggere JavaScript con calma: il browser deve poter ricostruire il PDF da solo. La protezione vera è il **repository privato**. Non renderlo pubblico e non pubblicare la pagina su un hosting aperto, se il regalo deve restare un regalo.

## Sostituire il regalo

1. Tieni il PDF vero fuori da git, con il nome `regalo.pdf`.
2. Dalla cartella del progetto:

```bash
node seal.mjs ./regalo.pdf ./index.html
```

3. Il file `index.html` viene riscritto con il nuovo sigillo. Committalo. Il PDF in chiaro no.

`seal.mjs` controlla che, decifrando, si torni a un PDF (`%PDF-`).

## Punteggio

| Prova | Massimo | Regola |
|---|---|---|
| Quiz, 10 domande | 40 | −5 per ogni primo tentativo sbagliato |
| Palloncini, 20 secondi | 30 | 1 punto a scoppio, le bombe tolgono 3 secondi |
| Ponte di vetro | 15 | 8 passi, anteprima 1,5 s, un errore azzera |
| Sequenza colori | 15 | 6 lampi da 600 ms, un errore azzera |
| Griglia 4×4 | 15 | 6 simboli per 1,5 s, 2 punti ciascuno + 3 se perfetti |

Soglia: **100**. Quattro primi errori nel quiz chiudono la sfida anche con il resto perfetto.
