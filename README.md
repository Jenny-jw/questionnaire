## Table of Contents

- [Features](#features)
- [On the Roadmap](#on-the-roadmap)
- [Quickstart](#quickstart)

## Features

- 5 question types to add in the questionnaire
- Questionnaire designer can decide if the users are allow to be anonymous or not
- Form creators use JWT to manage forms and check responses（需要身份驗證、長期管理）。
- Form fillers use OTP to have the access to fill the form.（短期、一次性存取）。

## On the Roadmap

- Use Nodemailer to send token to admin
- Questionnaire designer can decide if the users need to login or not
- Support creator (admin) token email-based recovery

## Notes

- Send out HttpOnly Cookie when creating a form, so adminToken will be only stored in Cookie and cannot be accessed by frontend.

## Quickstart

### Start backend (MongoDB service)

```
cd ~/questionnaire/backend
npm start
```

### Start frontend Vite (React app)

```

cd ~/questionnaire/frontend
npm run dev

```
