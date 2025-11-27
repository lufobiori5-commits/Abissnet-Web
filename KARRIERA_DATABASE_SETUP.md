# Sistema e Menaxhimit të Punëve - Karriera Abissnet

## Përmbledhje

Ky sistem përdor një databazë SQLite për të ruajtur pozicionet e punës në mënyrë të përhershme, duke zëvendësuar sistemin e vjetër që përdorte vetëm cache (localStorage).

## Karakteristikat Kryesore

### 1. **Databaza SQLite**
- Ruajtje e përhershme e pozicioneve të punës
- Nuk humbasin të dhënat kur pastrohet cache-i i browser-it
- Performancë e shpejtë dhe e besueshme

### 2. **Formatim i Përmirësuar i Tekstit**
- Përshkrimi i punës shfaqet i formatuar me paragrafë
- Mbështetje për tekste të gjata (10+ fjali)
- Konverton line breaks në `<br>` dhe paragrafë të dyfishta në `<p>` tags

### 3. **API RESTful**
- `GET /api/jobs.php` - Shfaq të gjitha punët ose një punë specifike
- `POST /api/jobs.php` - Shton punë të re
- `PUT /api/jobs.php` - Përditëson punë ekzistuese
- `DELETE /api/jobs.php?id=xxx` - Fshin punë

## Struktura e Skedarëve

```
api/
├── database.php      # Menaxhon lidhjen me SQLite
├── jobs.php          # API endpoint për CRUD operations
└── jobs.db          # Databaza SQLite (krijohet automatikisht)

public/
├── karriera.html     # Faqja publike e karrierave
├── admin.html        # Faqja e adminit për menaxhimin e punëve
└── assets/js/
    ├── karriera.js   # Script për faqen publike
    └── admin.js      # Script për faqen e adminit
```

## Si të Përdorni

### Për Administratorë

1. **Hyrja në Panelin Admin:**
   - Shkoni te `karriera.html`
   - Klikoni butonin "Admin Panel"
   - Vendosni kredencialet:
     - User: `@b1ssn3t`
     - Password: `abissnet-admin`
   - Do të ridrejtoheni automatikisht te `admin.html`

2. **Shtimi i Punës së Re:**
   - Plotësoni formularin me të dhënat e pozicionit:
     - **Titulli**: Emri i pozicionit (i detyrueshëm)
     - **Vendndodhja**: Ku do të punojë punonjësi
     - **Departamenti**: Departamenti përkatës
     - **Tipi**: Full-time, Part-time, Kontratë, ose Praktikë
     - **Data**: Data e publikimit
     - **Përshkrimi**: Detaje për pozicionin (i detyrueshëm)
   - Përdorni enter/line breaks për të formatuar përshkrimin:
     ```
     Përshkrimi i shkurtër i pozicionit.

     Përgjegjësitë kryesore:
     - Përgjegjësi 1
     - Përgjegjësi 2
     - Përgjegjësi 3

     Kualifikimet e kërkuara:
     - Kualifikim 1
     - Kualifikim 2
     ```
   - Klikoni "Publiko Punën"

3. **Fshirja e Punëve:**
   - Në listën e punëve, klikoni "Fshij" pranë pozicionit që dëshironi të fshini
   - Konfirmoni fshirjen

4. **Export të Dhënash:**
   - Klikoni "Export JSON" për të shkarkuar të gjitha punët në format JSON

### Për Përdoruesit

1. **Shikimi i Punëve:**
   - Vizitoni `karriera.html`
   - Shfaqen vetëm pozicionet e publikuara

2. **Kërkimi dhe Filtrimi:**
   - Përdorni kutinë e kërkimit për të gjetur pozicione specifike
   - Filtroni sipas departamentit ose tipit të punës

3. **Aplikimi:**
   - Klikoni "Apliko" pranë pozicionit që ju intereson
   - Plotësoni formularin e aplikimit
   - Ngarkoni CV (PDF, DOC, ose DOCX, max 5MB)
   - Dërgoni aplikimin

## Formatimi i Përshkrimeve

Sistemi i ri mbështet formatim të avancuar për përshkrimet e punëve:

### Single Line Break
```
Linja e parë
Linja e dytë
```
Shfaqet si:
```
Linja e parë<br>
Linja e dytë
```

### Paragrafë (Double Line Break)
```
Paragrafi i parë.

Paragrafi i dytë.
```
Shfaqet si:
```html
<p>Paragrafi i parë.</p>
<p>Paragrafi i dytë.</p>
```

### Shembull i Plotë
```
Network Engineer - Pozicion i Hapur

Përshkrim i shkurtër:
Ne kërkojme një Network Engineer të kualifikuar për të bashkuar ekipin tonë teknik.

Përgjegjësitë kryesore:
- Administrimi i infrastrukturës së rrjetit
- Konfigurimi i pajisjeve Mikrotik
- Monitorimi i performancës së rrjetit
- Zgjidhja e problemeve teknike

Kualifikimet e kërkuara:
- Eksperiencë minimale 2 vjet në pozicion të ngjashëm
- Njohuri të VLAN, GPON/EPON
- Certifikata Mikrotik (preferueshëm)
```

## Migrimi nga Sistemi i Vjetër

Nëse keni pozicione të ruajtura në localStorage:

1. Sistemi i ri do të lexojë automatikisht pozicionet nga localStorage në ngarkimin e parë
2. Pozicionet do të ruhen në databazë automatikisht
3. Pas verifikimit, mund të pastroni localStorage-in

## Backup dhe Restore

### Backup Manual
1. Shkoni te `admin.html`
2. Klikoni "Export JSON"
3. Ruani skedarin në një vend të sigurt

### Backup i Databazës
- Kopjoni skedarin `api/jobs.db` periodikisht
- Ruajeni në një vend të sigurt jashtë serverit

### Restore
Për të rikthyer të dhënat:
1. Zëvendësoni `api/jobs.db` me backup-in tuaj
2. Ose përdorni JSON export për të importuar të dhënat

## Troubleshooting

### Pozicionet nuk shfaqen
1. Kontrolloni që databaza `api/jobs.db` ekziston në dosjen `api/`
2. Verifikoni që serveri PHP ka të drejta shkrim në dosjen `api/`
3. Hapni console të browser-it për të parë gabimet

### Gabime në shtimin e pozicioneve
1. Verifikoni që të gjitha fushat e detyrueshme janë plotësuar
2. Kontrolloni që PHP ka extension-in SQLite të aktivizuar
3. Shikoni logs e serverit për detaje

### Formatimi nuk shfaqet siç duhet
1. Sigurohuni që përdorni line breaks (Enter) në përshkrim
2. Për paragrafë të veçantë, përdorni dy line breaks
3. Mos përdorni HTML tags manualisht - sistemi i formatuon automatikisht

## Siguria

- Ndryshoni kredencialet default në `karriera.js`:
  ```javascript
  if (user === "@b1ssn3t" && pass === "abissnet-admin")
  ```
- Për prodhim, përdorni autentifikim të fortë backend
- Mbrojeni skedarin `jobs.db` nga akesi publik përmes `.htaccess`:
  ```apache
  <Files "jobs.db">
    Order allow,deny
    Deny from all
  </Files>
  ```

## Përditësime të Ardhshme

- [ ] Edit/Update pozicionesh ekzistues nga UI
- [ ] Sistem i avancuar i role-based access control
- [ ] Statistika për aplikuesit
- [ ] Email notifications automatike
- [ ] Integrimi me Odoo për menaxhim kandidatësh

## Mbështetje

Për pyetje ose probleme, kontaktoni ekipin teknik të Abissnet.
