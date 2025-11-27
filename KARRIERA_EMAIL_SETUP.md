# Konfigurimi i Email-it për Aplikime Punësimi

## Përshkrim
Sistemi i aplikimeve për karrierë tani dërgon email automatikisht te `b.njerezore@abissnet.al` kur një aplikant aplikon për një pozicion pune.

## Hapat për Konfigurimin e Email-it

### 1. Konfiguro SMTP në `.env`

Hap skedarin `.env` dhe plotëso kredencialet SMTP:

```env
# SMTP Configuration for sending emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 2. Për Gmail (Metoda e Rekomanduar)

Nëse përdor Gmail për të dërguar email-e:

1. **Aktivizo 2-Factor Authentication** në llogarinë tënde Google
2. **Krijo një App Password**:
   - Shko te https://myaccount.google.com/apppasswords
   - Zgjedh "Mail" dhe "Other (Custom name)"
   - Kopjo passwordin e gjeneruar (16 karaktere)
   - Vendose këtë password në `SMTP_PASS` në `.env`

3. **Konfiguro `.env`**:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx  # App Password i gjeneruar
```

### 3. Për SMTP të Tjerë (Outlook, Custom, etj.)

#### Outlook/Office 365:
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

#### Custom SMTP Server:
```env
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your-password
```

### 4. Testo Email-in

1. Rifillo serverin:
   ```bash
   npm run dev
   ```

2. Hap faqen e karrierës: http://localhost:4000/karriera.html

3. Kliko "Apliko" në një pozicion dhe plotëso formën

4. Kontrollo email-in te `b.njerezore@abissnet.al` për konfirmim

## Format i Email-it

Email-i që dërgohet përmban:

✅ **Subjekti**: `Aplikim i ri: [Pozicioni] - [Emri i Aplikantit]`

✅ **Përmbajtja**:
- Pozicioni i aplikuar
- Emri & Mbiemri
- Email i aplikantit
- Telefoni
- Mesazhi (opsional)
- Emri i skedarit CV (nëse u ngarkua)
- Lead ID në Odoo (nëse u krijua me sukses)

## Troubleshooting

### Problem: Email nuk dërgohet
**Zgjidhje**: 
- Kontrollo kredencialet SMTP në `.env`
- Sigurohu që SMTP_USER dhe SMTP_PASS janë të sakta
- Për Gmail, sigurohu që përdor App Password (jo passwordi normal)
- Shiko console logs për gabime specifike

### Problem: "Authentication failed"
**Zgjidhje**:
- Për Gmail: Krijo një App Password të ri
- Për SMTP të tjerë: Verifiko username/password
- Kontrollo që SMTP_HOST dhe SMTP_PORT janë të sakta

### Problem: Email shkon në Spam
**Zgjidhje**:
- Shto `b.njerezore@abissnet.al` në listën e kontakteve
- Konfiguro SPF/DKIM records për domenin tënd (nëse përdor custom domain)
- Përdor një email profesional për SMTP_USER (jo gmail personal)

## Integrimi me Odoo

Sistemi gjithashtu përpiqet të krijojë një **Lead** në Odoo përmes metodës `create_from_api_job`. Nëse kjo metodë nuk ekziston në instalimin tënd Odoo:

1. Email-i prapëseprapë do të dërgohet
2. Do të shfaqet një warning në console: `Odoo job lead creation warning`
3. Aplikimi do të konsiderohet i suksesshëm

Për të shtuar metodën `create_from_api_job` në Odoo, kontakto zhvilluesin Odoo ose shiko dokumentacionin e `odooClient.js`.

## Siguria

⚠️ **KUJDES**: Mos publiko kurrë skedarin `.env` në Git/GitHub!

Skedari `.env` përmban kredenciale të ndjeshme. Sigurohu që:
- `.env` është në `.gitignore`
- Përdor `.env.example` për shembuj
- Ruaj kredencialet SMTP në një vend të sigurt

## Support

Për probleme të tjera, kontakto ekipin teknik të Abissnet.
