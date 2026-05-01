# Clinic AI India - Full Context Brief for Stitch

## Goal
This document provides the full product and technical context needed for Stitch to generate backend-aligned screens for Clinic AI India.

---

## Product Overview
Clinic AI India is a healthcare workflow platform for clinics/providers with:

- Authentication and role-based access (`provider`, `clinic`, `admin`, `patient`)
- Onboarding/setup wizard (clinic setup, optional ABDM, optional WhatsApp, welcome tour)
- Patient registration and visit lifecycle management
- Intake, vitals capture, pre-visit summaries
- AI transcription, dialogue structuring, clinical note generation, post-visit summary
- WhatsApp messaging and webhook processing
- Admin and billing/subscription surfaces (partly mocked)

---

## Architecture and Stack

### Frontend
- Framework: Next.js 14 App Router, React 18, TypeScript
- UI: Tailwind
- State/Form/API: Zustand, React Hook Form, Axios
- i18n: `next-intl`
- Key paths:
  - `clinic_ai_frontend/app`
  - `clinic_ai_frontend/lib/api/client.ts`
  - `clinic_ai_frontend/middleware.ts`

### Backend
- Framework: FastAPI
- Database: MongoDB
- AI/Integration: OpenAI + Azure Speech
- Messaging: Meta WhatsApp Cloud API
- Key paths:
  - `clinic_ai_backend/src/app.py`
  - `clinic_ai_backend/src/api/routers`
  - `clinic_ai_backend/src/core/config.py`
  - `clinic_ai_backend/src/adapters/external/whatsapp/meta_whatsapp_client.py`

---

## Backend Capability Map (Current State)

### Active mounted API groups
From backend app mounting:
- `/api/auth/*`
- `/api/patients/*`
- `/api/visits/*`
- `/api/vitals/*`
- `/api/workflow/*`
- `/api/notes/*` (clinical note + post-visit summary + transcription flow)
- `/api/patient-chat/*`
- `/api/contextai/*`
- `/api/templates/*`
- WhatsApp webhook routes

Reference:
- `clinic_ai_backend/src/app.py`

### Present but incomplete or not clearly active
- `clinic_ai_backend/src/api/routers/followthrough.py` exists but not clearly mounted
- `audio.py`, `doctor.py`, `intake.py`, `prescriptions.py` appear scaffolded/TODO
- Some domain/adapters folders have placeholder implementations

---

## Core Domain and Data Model (Operational/Observed)
Primary entities inferred from active routers and DB usage:

- `users` (role, verification, tenant fields)
- `patients`
- `visits` (status-driven lifecycle)
- `intake_sessions`
- `vitals_forms`
- `patient_vitals`
- `pre_visit_summaries`
- `audio_files`
- `transcription_jobs`
- `transcription_results`
- `clinical_notes`
- `templates` and template usage events
- follow-up/reminder records

### Key relationships (inferred)
- One patient -> many visits
- One visit -> intake session(s), transcription jobs/files, notes, summaries
- Templates -> reusable note/document structures + usage tracking

---

## Auth, Session, Roles

- JWT-style auth with access/refresh behavior
- Frontend middleware uses role/session checks for route protection
- Client redirects to `session-expired` on unauthorized states

Reference paths:
- `clinic_ai_backend/src/api/routers/auth.py`
- `clinic_ai_frontend/middleware.ts`
- `clinic_ai_frontend/lib/api/client.ts`

---

## Onboarding and Setup Flow

Current journey (frontend):
1. Signup
2. Account verification (OTP UI)
3. Clinic setup
4. Optional ABDM setup
5. Optional WhatsApp setup
6. Welcome tour
7. Enter dashboard

Notes:
- Parts of onboarding persistence appear local-storage based
- Backend onboarding endpoint coverage is partial (important for Stitch assumptions)

Reference paths:
- `clinic_ai_frontend/components/auth/SignupForm.tsx`
- `clinic_ai_frontend/app/[locale]/account-verification/page.tsx`
- `clinic_ai_frontend/app/[locale]/clinic-setup/page.tsx`
- `clinic_ai_frontend/app/[locale]/abdm-setup/page.tsx`
- `clinic_ai_frontend/app/[locale]/whatsapp-setup/page.tsx`
- `clinic_ai_frontend/app/[locale]/welcome-tour/page.tsx`

---

## Functional Flow Map

### 1) Patient + Visit
- Register patient
- Create/schedule visit
- Track visit status (queue -> in progress -> completed, plus no-show/cancel flows)

Refs:
- `clinic_ai_backend/src/api/routers/patients.py`
- `clinic_ai_backend/src/api/routers/visits.py`

### 2) Intake + Vitals + Pre-visit
- Intake sessions
- Vitals form generation/submission
- Pre-visit summary and appointment context

Refs:
- `clinic_ai_backend/src/api/routers/vitals.py`
- `clinic_ai_backend/src/api/routers/workflow.py`
- `clinic_ai_backend/src/api/routers/contextai.py`

### 3) Consultation + Notes
- Upload/process transcription
- Fetch dialogue/transcript
- Generate structured clinical note
- Generate post-visit summary

Refs:
- `clinic_ai_backend/src/api/routers/transcription.py`
- `clinic_ai_backend/src/api/routers/notes.py`

### 4) Messaging + Follow-up
- WhatsApp webhook handling
- Outbound messaging/templates
- Follow-up reminders pipeline (partially staged)

Refs:
- `clinic_ai_backend/src/api/routers/whatsapp.py`
- `clinic_ai_backend/src/adapters/external/whatsapp/meta_whatsapp_client.py`

---

## Frontend Route Inventory for Screen Generation

### Auth and session
- `/login`
- `/signup`
- `/forgot-password`
- `/forgot-password/otp-verification`
- `/reset-password`
- `/account-verification`
- `/session-expired`

### Onboarding
- `/onboarding`
- `/clinic-setup`
- `/abdm-setup`
- `/whatsapp-setup`
- `/welcome-tour`

### Provider
- `/provider/dashboard`
- `/provider/visits`
- `/provider/visits/[id]`
- `/provider/visits/new`
- `/provider/patients`
- `/provider/registered-patients`
- `/provider/manage-appointments`
- `/provider/calendar`
- `/provider/templates`
- `/provider/follow-through`
- `/provider/settings`
- provider admin/subscription routes

### Clinic
- `/clinic/dashboard`
- `/clinic/visits`
- `/clinic/visits/[id]`
- `/clinic/visits/new`
- `/clinic/patients`
- `/clinic/registered-patients`
- `/clinic/manage-appointments`
- `/clinic/calendar`
- `/clinic/templates`
- `/clinic/settings`
- `/clinic/careprep`

### Patient
- `/patient/dashboard`
- `/patient/appointment-prep`
- `/patient/previsit/*`

### Admin
- `/admin`
- `/admin/users`
- `/admin/roles`
- `/admin/organizations`
- `/admin/analytics`
- `/admin/audit`
- `/admin/billing`
- `/admin/settings`
- `/admin/support-access`

Primary route source:
- `clinic_ai_frontend/app`

---

## i18n Requirements

- Supported locales: `en`, `hi`, `fr`
- Default locale: `en`
- Locale-aware routing is enabled via middleware

Refs:
- `clinic_ai_frontend/i18n/request.ts`
- `clinic_ai_frontend/messages/en.json`
- `clinic_ai_frontend/messages/hi.json`
- `clinic_ai_frontend/messages/fr.json`

---

## Stitch Screen Inventory (Build in this order)

### Journey 1: Authentication and Session
Screens:
- Login
- Signup
- Forgot password
- OTP verification
- Reset password
- Session expired

States required:
- Loading, success, validation error, credential error, expired token, retry

### Journey 2: Onboarding Wizard
Screens:
- Account verification
- Clinic setup
- Optional ABDM setup
- Optional WhatsApp setup
- Welcome tour
- Onboarding completion

States required:
- Required-field validation, OTP resend timer, optional skip branches, draft save, completion

### Journey 3: Patient and Visit Management
Screens:
- Register/search patient
- Create/schedule visit
- Visit list
- Visit detail
- Queue operations

States required:
- Empty list, existing-patient match, status transition conflict, stale record, success confirmation

### Journey 4: Clinical Workflow
Screens:
- Intake status
- Vitals capture
- Pre-visit summary
- Consultation workspace
- Transcription processing
- Dialogue review
- Clinical note editor/view
- Post-visit summary

States required:
- Processing/polling, partial data, generation failure, retry, note unavailable

### Journey 5: Messaging and Follow-up
Screens:
- WhatsApp setup status
- Template/message send
- Webhook event/log status
- Follow-up reminders dashboard

States required:
- Missing phone/consent, delivery fail, webhook verification fail, retry/scheduled

### Journey 6: Admin and Commercial
Screens:
- Admin dashboard
- User/role management
- Organization settings
- Analytics
- Billing/subscription
- Support access

States required:
- Role denied, tenant missing, endpoint unavailable, mocked-data fallback

---

## Known Gaps and Assumptions (Critical for Stitch)

1. Frontend API client references some endpoints that are not clearly mounted in current backend.
2. Several backend modules are scaffolded/TODO and not ready for full production flows.
3. Onboarding appears partially frontend-local persistence rather than fully backend-persisted.
4. ABDM/FHIR and billing may be staged/partial and should be treated as progressive integration screens.
5. Some admin/billing UI appears demo/mock backed.

---

## Stitch Output Requirements
Ask Stitch to generate screens with:

- Backend-first contracts (request/response placeholders per endpoint group)
- Standard state handling on every screen: `loading`, `empty`, `error`, `success`, `unauthorized`
- Role-based visibility variants (`provider`, `clinic`, `admin`, `patient`)
- Localization-ready text keys (`en`, `hi`, `fr`)
- Reusable components for forms, status banners, timeline, queue tables, transcription progress, note preview

---

## Optional Next Step
Create a second document: `STITCH_API_SCREEN_MATRIX.md` that maps each screen to:
- exact endpoint(s),
- request payload contract,
- response shape,
- required UI states,
- validation and error rules.

