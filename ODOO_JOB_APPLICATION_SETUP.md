# Konfigurimi i Odoo për Aplikime Punësimi

## Hapa për Konfigurimin në Odoo

### 1. Krijo Custom Module (ose përdor ekzistuesin)

Nëse ke tashmë një modul custom për CRM (ku ke metodën `create_from_api` për support), shto këtë metodë aty.

### 2. Shto Metodën në Model `crm.lead`

Shko te moduli tënd custom dhe hap skedarin e modelit të CRM Lead (zakonisht në `models/crm_lead.py`).

Shto këtë metodë:

```python
from odoo import models, api
import logging

_logger = logging.getLogger(__name__)


class CrmLead(models.Model):
    _inherit = 'crm.lead'

    @api.model
    def create_from_api_job(self, payload):
        """
        Krijon një lead të ri nga aplikimi i punës dhe dërgon email te b.njerezore@abissnet.al
        
        Args:
            payload (dict): Të dhënat e aplikimit
                - name: Emri i lead-it (REQUIRED)
                - position_title: Pozicioni i aplikuar
                - contact_name: Emri & Mbiemri i aplikantit
                - email_from: Email i aplikantit
                - phone: Telefoni (opsional)
                - description: Mesazhi (opsional)
                - resume_name: Emri i skedarit CV (opsional)
        
        Returns:
            int: ID e lead-it të krijuar
        """
        try:
            # Krijo lead të ri
            lead_vals = {
                'name': payload.get('name', 'Aplikim i ri për punë'),
                'type': 'opportunity',
                'contact_name': payload.get('contact_name', ''),
                'email_from': payload.get('email_from', ''),
                'phone': payload.get('phone', ''),
                'description': f"""
APLIKIM PËR POZICION PUNE

Pozicioni: {payload.get('position_title', 'N/A')}
Aplikanti: {payload.get('contact_name', 'N/A')}
Email: {payload.get('email_from', 'N/A')}
Telefon: {payload.get('phone', 'N/A')}
CV: {payload.get('resume_name', 'N/A')}

Mesazhi:
{payload.get('description', 'Nuk ka mesazh.')}
                """.strip(),
                'team_id': self.env.ref('sales_team.team_sales_department').id,  # Ndrysho sipas nevojës
                'user_id': False,  # Do t'i caktohet më vonë nga HR
            }
            
            lead = self.create(lead_vals)
            _logger.info(f"Created job application lead #{lead.id} for {lead.contact_name}")
            
            # Dërgo email te b.njerezore@abissnet.al
            self._send_job_application_email(lead, payload)
            
            return lead.id
            
        except Exception as e:
            _logger.error(f"Error creating job application lead: {str(e)}")
            raise
    
    def _send_job_application_email(self, lead, payload):
        """
        Dërgon email notification te b.njerezore@abissnet.al për aplikimin e ri
        """
        try:
            # Gjet template email ose krijo një të ri
            template = self.env.ref('your_module.job_application_email_template', raise_if_not_found=False)
            
            if not template:
                # Nëse nuk ke template, dërgo email direkt
                mail_values = {
                    'subject': f"Aplikim i ri: {payload.get('position_title')} - {payload.get('full_name')}",
                    'email_from': 'erp@abissnet.al',
                    'email_to': 'b.njerezore@abissnet.al',
                    'body_html': self._get_job_email_body(lead, payload),
                }
                
                mail = self.env['mail.mail'].create(mail_values)
                mail.send()
                _logger.info(f"Job application email sent for lead #{lead.id}")
            else:
                # Përdor template
                template.send_mail(lead.id, force_send=True, email_values={
                    'email_to': 'b.njerezore@abissnet.al',
                })
                
        except Exception as e:
            _logger.error(f"Error sending job application email: {str(e)}")
            # Nuk bëjmë raise sepse lead-i u krijua me sukses
    
    def _get_job_email_body(self, lead, payload):
        """
        Gjeneron HTML body për email-in e aplikimit
        """
        return f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
            <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2 style="color: #1f2937; margin-top: 0; border-bottom: 3px solid #3b82f6; padding-bottom: 10px;">
                    🎯 Aplikim i Ri për Punë
                </h2>
                
                <div style="margin: 20px 0;">
                    <h3 style="color: #4b5563; margin-bottom: 15px;">📋 Detajet e Pozicionit</h3>
                    <p style="margin: 8px 0;"><strong>Pozicioni:</strong> {payload.get('position_title', 'N/A')}</p>
                </div>

                <div style="margin: 20px 0; background-color: #f3f4f6; padding: 15px; border-radius: 6px;">
                    <h3 style="color: #4b5563; margin-top: 0; margin-bottom: 15px;">👤 Informacioni i Aplikantit</h3>
                    <p style="margin: 8px 0;"><strong>Emri & Mbiemri:</strong> {payload.get('contact_name', 'N/A')}</p>
                    <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:{payload.get('email_from')}" style="color: #3b82f6;">{payload.get('email_from', 'N/A')}</a></p>
                    <p style="margin: 8px 0;"><strong>Telefon:</strong> {payload.get('phone', 'N/A')}</p>
                    {f'<p style="margin: 8px 0;"><strong>CV:</strong> {payload.get("resume_name")}</p>' if payload.get('resume_name') else ''}
                </div>

                {f'''
                <div style="margin: 20px 0;">
                    <h3 style="color: #4b5563; margin-bottom: 10px;">💬 Mesazhi</h3>
                    <div style="background-color: #eff6ff; padding: 15px; border-left: 4px solid #3b82f6; border-radius: 4px;">
                        <p style="margin: 0; color: #1f2937; line-height: 1.6;">{payload.get('description')}</p>
                    </div>
                </div>
                ''' if payload.get('description') else ''}

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
                    <p style="color: #6b7280; font-size: 14px; margin: 0;">
                        Ky email u krijua automatikisht nga sistemi i aplikimeve të Abissnet
                    </p>
                    <p style="color: #6b7280; font-size: 12px; margin: 5px 0;">
                        Lead ID në Odoo: <a href="https://hr.abissnet.al/web#id={lead.id}&model=crm.lead" style="color: #3b82f6;">#{lead.id}</a>
                    </p>
                </div>
            </div>
        </div>
        """
```

### 3. (Opsionale) Krijo Email Template

Nëse dëshiron të përdorësh një email template në Odoo (për më shumë kontroll):

1. Shko te **Settings → Technical → Email → Templates**
2. Krijo një template të ri me këto detaje:
   - **Name**: Job Application Notification
   - **Model**: Lead/Opportunity (crm.lead)
   - **Email From**: `erp@abissnet.al`
   - **Email To**: `b.njerezore@abissnet.al`
   - **Subject**: `Aplikim i ri: ${object.name}`
   - **Body**: Përdor HTML të mësipërm

3. Ruaje template-in dhe merr External ID (p.sh., `your_module.job_application_email_template`)

### 4. Update Serverin Odoo

Pas shtimit të metodës:

```bash
# Restart Odoo service
sudo systemctl restart odoo

# Ose nëse përdor development mode
./odoo-bin -u your_module_name -d odoo
```

### 5. Testo Integrimin

1. Shko te faqja e karrierës: http://localhost:4000/karriera.html
2. Apliko për një pozicion
3. Kontrollo:
   - Lead-i u krijua në Odoo (CRM → Leads/Opportunities)
   - Email-i u dërgua te `b.njerezore@abissnet.al`

## Shënime të Rëndësishme

### Team Assignment
Në kod kam vendosur:
```python
'team_id': self.env.ref('sales_team.team_sales_department').id,
```

Ndrysho këtë sipas strukturës tënde:
- Nëse ke një team specifik për HR, përdor atë
- Ose krijo një team të ri "HR Recruitment"

### Email Configuration
Sigurohu që Odoo ka të konfiguruar SMTP për të dërguar email-e:
1. **Settings → General Settings → Discuss**
2. Aktivizo "External Email Servers"
3. Shto server SMTP (zakonisht tashmë e ke për `erp@abissnet.al`)

### External ID për Template
Nëse krijon template manual, merr External ID:
```xml
<record id="job_application_email_template" model="mail.template">
    <field name="name">Job Application Notification</field>
    <!-- ... fields ... -->
</record>
```

Pastaj në kod:
```python
template = self.env.ref('your_module.job_application_email_template')
```

## Debugging

Nëse email nuk dërgohet, kontrollo:

1. **Odoo Logs**:
```bash
tail -f /var/log/odoo/odoo-server.log
```

2. **Email Queue** në Odoo:
   - Settings → Technical → Email → Emails
   - Shiko për email-e "Failed" ose "Exception"

3. **SMTP Configuration**:
   - Settings → Technical → Outgoing Mail Servers
   - Testo connection me "Test Connection"

## Avantazhet e Kësaj Metode

✅ **Centralizuar**: Të gjitha email-et dërgohen nga Odoo (si për support)  
✅ **Tracking**: Çdo email regjistrohet në Odoo  
✅ **Lead Management**: Lead-et për punë ruhen në CRM  
✅ **Konsistencë**: Një sistem për të gjitha email-et  
✅ **Profesionale**: Email-et dërgohen nga `erp@abissnet.al`  

Kjo është metoda e rekomanduar sepse përputhet me infrastrukturën ekzistuese të Abissnet! 🚀
