# SOC Sentinel — Security Operations Center

**SOC Sentinel** təhlükəsizlik əməliyyat mərkəzi (SOC) üçün brauzerdə işləyən demo platformadır: xəbərdarlıqlar, risk vizuallaşdırması, fişinq yoxlaması, zəiflik bölməsi, süni intellektlə hesabat və “copilot” tipli köməkçi. Layihə **hackathon / demo** məqsədilə qurulub: real SIEM əvəzinə **mock (sınaq) məlumatları** göstərir; AI və e-poçt üçün xarici API-lər **istəyə bağlı** qoşulur.

---

## Hackatonda necə danışım? (qısa təqdimat)

Təxminən **2–3 dəqiqə** üçün skript:

1. **Problem:** Təhlükəsizlik komandaları çox alət və məlumat axını arasında itirir; icraçılar üçün xülasə, fişinq qiymətləndirməsi və sürətli qərar dəstəyi lazımdır.
2. **Həll:** **SOC Sentinel** — vahid “dashboard”: alertlər, qrafiklər, xəritə, fəaliyyət axını, fişinq analizi və **LLM** ilə avtomatik incident hesabatı.
3. **Fərqləndirici:** **Groq** ilə real vaxta yaxın AI (fişinq təhlili, hesabat, alert triage, SOC copilot); istəyə görə **EmailJS** ilə hesabatı mətn kimi poçta göndərmə; **jsPDF** ilə PDF export; demo **rol əsaslı giriş** və copilot vasitəsilə **IP bloklama** (lokal səviyyədə, brauzerdə saxlanılır).
4. **Texniki:** Müasir **React 19 + Vite 8**, **Tailwind CSS 4**, **Recharts**; backend hazırda yoxdur, gələcəkdə `VITE_API_BASE_URL` ilə Java API qoşmaq üçün yer saxlanılıb.

---

## Layihənin məqsədi

| Məqsəd | Təsvir |
|--------|--------|
| **Əməliyyat görünüşü** | SOC analitikin ehtiyac duyduğu əsas vidcetlər bir ekranda |
| **Qərar dəstəyi** | AI ilə qısa təhlil, tövsiyə siyahısı, icraçı xülasəsi |
| **Əməkdaşlıq** | Hesabatı e-poçtla paylaşmaq (EmailJS) və ya PDF yükləmək |
| **Təhlükəsizlik UX-i** | Rollar, icazələr, audit izi (mock admin panel) |

---

## İstifadə olunan texnologiyalar

| Texnologiya | Rol |
|-------------|-----|
| **React 19** | UI komponentləri, state, kontekst |
| **Vite 8** | Build və dev server (sürətli HMR) |
| **React Router 7** | Səhifə marşrutları, qorunan route-lar |
| **Tailwind CSS 4** | `@tailwindcss/vite` ilə stil |
| **Recharts 3** | Risk, şəbəkə, saatlıq alert və donut qrafikləri |
| **Groq API** | OpenAI-uyğun chat completions (`llama-3.3-70b-versatile` və ya `VITE_GROQ_MODEL`) |
| **@emailjs/browser** | Brauzerdən şablon e-poçt (hesabat mətni) |
| **jsPDF 4** | Incident hesabatını PDF kimi yükləmək |
| **ESLint 9** | Kod keyfiyyəti |

Şrift: **Inter** (Google Fonts, `index.html`).

---

## Funksionallıq (səhifələr və vidcetlər)

### Giriş və icazələr

- **`/login`** — Demo istifadəçilər `src/data/users.js` faylındadır (parol frontenddə yalnız demodur; prod üçün belə etməyin).
- **`ProtectedRoute`** — Girişsiz əsas app açılmır; bəzi səhifələr **rola görə** bağlanır (`rolePermissions`).
- **Rollar:** `admin` (tam menyu + admin panel), `analyst` (alerts, phishing, blocked, …), `viewer` (dashboard, reports, profile).

### Dashboard (`/`)

- Stat kartları (alertlər, təhlükələr, risk, bloklanmış hücumlar, cavab müddəti, uptime, endpointlər).
- **RiskChart**, **ThreatDonut**, **AlertsByHourChart**, **NetworkChart**.
- **ThreatMap**, **SystemHealth**, **AlertsTable**, **IncidentTimeline**, **ActivityFeed**, **TopAttackers**.
- **PhishingChecker** və **ReportPanel** (dashboard-da da mövcuddur).

### Alerts (`/alerts`)

- Alert cədvəli; detal modalında **Groq** ilə triage məsləhəti (`alertTriageInsight`) — açar yoxdursa mətn mock/playbook ilə.

### Blocked (`/blocked`)

- Bloklanmış IP-lərin intel səviyyəsi (mock məlumat + kontekst).

### Phishing (`/phishing`)

- **PhishingChecker** — e-poçt mətnini analiz; **Groq** ilə JSON cavab: `verdict`, `confidence`, `explanation`, `indicators`.
- **EmailQuarantine** — karantin siyahısı (mock).

### Vulnerabilities (`/vulnerabilities`)

- Zəiflik skaneri / skan nəticələri UI (demo məlumat).

### Reports (`/reports`)

- Analitika qrafikləri + **ReportPanel**: kontekstdən (mock stat + alert xülasəsi) **AI hesabatı**, typewriter effekti, **PDF export**, **EmailJS** ilə mətn göndərmə.

### Settings (`/settings`), Admin (`/admin`), Profile (`/profile`)

- Parametrlər, admin idarəetmə və istifadəçi profili (mock audit və istifadəçi siyahıları).

### Ümumi layout

- **SocShell** — sidebar, navbar, **AiChat** (SOC copilot): kontekst JSON ilə söhbət; açar varsa **Groq**; istifadəçi aydın şəkildə **IP bloklama** istədikdə model JSON `actions` qaytarır, UI **SecurityActionsContext** ilə IP-ləri `localStorage`-da saxlayır (demo perimeter).

---

## Süni intellekt (Groq) — harada işləyir?

| Funksiya | Fayl / komponent | Təsvir |
|----------|------------------|--------|
| Fişinq analizi | `groqAi.js` → `PhishingChecker` | Mətn → fişinq / təhlükəsiz, etimad faizi, izah |
| Incident hesabatı | `groqAi.js` → `ReportPanel` | Telemetry konteksti → icraçı/markdown tipli xülasə |
| Alert triage | `groqAi.js` → `AlertDetailModal` | Tək alert üçün qısa tövsiyə siyahısı |
| SOC copilot | `groqAi.js` → `AiChat` | Sual-cavab; icazə verilən IP-lər üçün `block_ip` əməliyyatı |

Açar yoxdursa: lokal/mock davranış və ya məhdud mesajlar göstərilir (`hasGroqConfigured()`).

---

## E-poçt və PDF

- **EmailJS:** `src/services/emailJsReport.js` — hesabat mətnini şablona göndərir (`to_email`, `report_text`, `message`, `from_name`, `from_email`, `subject`, `source`). Şablonda **To = `{{to_email}}`**, məzmunda **`{{report_text}}`** və ya **`{{message}}`**.
- **PDF:** `src/utils/exportIncidentReportPdf.js` — eyni hesabatdan brauzerdə PDF yükləmə.

Ətraflı `.env.example` faylında qısa şərhlərlə.

---

## Ətraf mühit dəyişənləri

Layihə kökündə `.env` yaradın (`.env.example`-ı nümunə kimi kopyalayın). **Heç vaxt real açarları repoya commit etməyin.**

| Dəyişən | Məqsəd |
|---------|--------|
| `VITE_GROQ_API_KEY` | Groq API açarı ([console.groq.com](https://console.groq.com/keys)) |
| `VITE_GROQ_MODEL` | İstəyə bağlı model adı |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS Public Key (yalnız bu; Private Key frontendə düşməməlidir) |
| `VITE_EMAILJS_SERVICE_ID` | `service_...` (Email **Services** səhifəsindən) |
| `VITE_EMAILJS_TEMPLATE_ID` | `template_...` |
| `VITE_API_BASE_URL` | Gələcək Java / backend üçün rezerv |

Dəyişəndən sonra dev serveri yenidən işə salın.

---

## Quraşdırma və skriptlər

```bash
npm install
npm run dev      # http://localhost:5173 (Vite default)
npm run build    # production build → dist/
npm run preview  # build önizləməsi
npm run lint
```

---

## Demo hesablar (yalnız hackathon)

| E-poçt | Parol | Rol |
|--------|-------|-----|
| `admin@sentinel.io` | `admin123` | Admin |
| `j.torres@sentinel.io` | `analyst123` | Analyst |
| `viewer@sentinel.io` | `viewer123` | Viewer |

Tam siyahı: `src/data/users.js`.

---

## Layihə strukturu (qısa)

```
src/
  components/     # UI vidcetləri (qrafiklər, cədvəllər, modallar, AiChat, …)
  context/        # Auth, SecurityActions (bloklanmış IP-lər)
  data/           # mockData, users
  hooks/
  layouts/        # SocShell
  pages/          # Dashboard, Alerts, Phishing, …
  services/       # groqAi.js, emailJsReport.js, api.js (backend üçün yer)
  utils/          # SOC konteksti, PDF, perimeter storage
```

---

## Məhdudiyyətlər və növbəti addımlar

- **Real SIEM / log axını yoxdur** — göstərilən rəqəmlər və hadisələr mock-dur.
- **Giriş və parollar** demo üçündür; production üçün server tərəfli auth, JWT və s. lazımdır.
- **IP bloklama** yalnız brauzerdə saxlanılır; real firewall inteqrasiyası yoxdur.
- **Groq / EmailJS** açarları `VITE_*` ilə client bundle-a düşür; prod üçün həssas çağırışlar backend proksi ilə edilməlidir.
- `VITE_API_BASE_URL` gələcəkdə real Java API-yə bağlana bilər.

---

## Lisenziya və məxfilik

Layihə şəxsi / hackathon məqsədlidir. Üçüncü tərəf API-lərinin (Groq, EmailJS) şərtlərinə və kvotalarına əməl edin.
