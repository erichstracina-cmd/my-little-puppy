# My Little Puppy – Android aplikácia

Hra (jeden súbor `www/index.html`) zabalená cez Capacitor. GitHub z nej sám zostaví podpísaný súbor `.aab` pre Google Play a `.apk` na vyskúšanie.

## Postup (raz)

1. **Účet na GitHube** (github.com) → **New repository**. Názov napr. `moj-psik`, nastav **Public** (kvôli stránke so zásadami súkromia zadarmo).
2. **Nahraj súbory**: v repozitári *Add file → Upload files* a pretiahni **obsah** priečinka (nie samotný priečinok). Dôležité je, aby sa nahral aj skrytý priečinok `.github` (ak ho prehliadač nenahrá, vytvor súbor *Add file → Create new file* s názvom `.github/workflows/android.yml` a vlož doň obsah z tohto balíka). Commit do vetvy `main`.
3. **Tajomstvá**: *Settings → Secrets and variables → Actions → New repository secret*. Vytvor 4 tajomstvá (hodnoty sú v súbore `TAJOMSTVA.txt`, ktorý nie je v repozitári):
   `KEYSTORE_BASE64`, `KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD`.
4. **Zostavenie**: záložka *Actions* → „Zostavenie Android aplikácie“ → *Run workflow*. Trvá cca 5–10 minút.
5. **Stiahnutie**: otvor dokončený beh → dole *Artifacts* → `moj-psik-aab` (na Google Play) a `moj-psik-apk` (na vyskúšanie v telefóne). Stiahne sa ZIP, vo vnútri je súbor.
6. Ak beh zlyhá (červený krížik), otvor ho, skopíruj chybový text a pošli mi ho – opravím to.

## Zásady súkromia (povinné pre Google Play)

1. V súbore `docs/privacy.html` nahraď `TVOJ_EMAIL@example.com` svojím e-mailom (ceruzka ✏️ pri súbore → Commit).
2. *Settings → Pages* → Source: *Deploy from a branch*, Branch: `main`, priečinok `/docs` → Save.
3. Adresa bude `https://TVOJ_UCET.github.io/moj-psik/privacy.html` – vlož ju do Play Console.

## Google Play Console

1. *Create app* → názov „My Little Puppy“, jazyk slovenčina, **Hra**, **Bezplatná**.
2. Texty: `store/listing_sk.md` (a `listing_en.md` ako preklad). Obrázky: `store/icon-512.png`, `store/feature-1024x500.png`, `store/screenshots/`.
3. Vyplň sekcie *App content* (hodnoty v `store/PLAY_CONSOLE_CHECKLIST.md`): zásady súkromia, reklamy: Nie, Data safety: nič nezbierame, obsahové hodnotenie, cieľová skupina.
4. *Testing → Closed testing* → vytvor vydanie, nahraj `.aab`, zapni *Play App Signing* (predvolené).
5. **Nový osobný účet vývojára** musí mať najprv **uzavreté testovanie aspoň 12 testerov, ktorí sú prihlásení 14 dní v kuse**. Až potom môžeš požiadať o produkciu.

## Aktualizácia hry

Zmenená hra = nový `www/index.html` v repozitári (Upload files, prepísať) → znova *Run workflow* → nový `.aab` do Play Console. Číslo verzie sa zvyšuje automaticky.

## Dôležité

- `appId` (`sk.mojpsik.hra`) v `capacitor.config.json` sa po prvom nahratí na Google Play **už nedá zmeniť**. Ak chceš iný, zmeň ho **pred** prvým nahratím.
- Súbor `upload.jks` a heslá nikdy nedávaj do repozitára. Odlož si zálohu. Pri strate sa dá v Google Play upload kľúč resetovať.
- Priečinok `android/` sa v repozitári nenachádza – GitHub ho vždy vytvorí nanovo.
