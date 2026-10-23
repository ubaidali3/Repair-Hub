# UstaadBid Gmail OTP setup

1. In Google Account, enable 2-Step Verification and create an App Password (if available for your account). Use the 16-character App Password, NOT your Gmail account password.
2. Set `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM` in backend `.env`. Set a long random `OTP_HASH_SECRET` separate from `JWT_SECRET`. Never commit `.env`.
3. Backend: `npm install` then `npm run dev`. Frontend: `npm install` then `npm run dev`. Add `FRONTEND_URL=http://localhost:5173,http://localhost:5174` for both Vite ports.
4. Registration: enter details, receive OTP by Gmail, verify before account is created and logged in. Login: password, then email OTP, then authenticated cookie. OTP lasts 5 minutes, resend cooldown 60 seconds. Six wrong codes lock verification for 10 minutes (per email).
5. MongoDB Atlas must be reachable; SMTP access is also required. Check spam folder.
6. Old authenticator-based setup routes have been removed. Existing users can login with email OTP regardless of previous authenticator settings.

## Limitations and production hardening
- Not end-to-end tested against live MongoDB/Gmail.
- In a multi-server deployment, strengthen atomic lockout across concurrent requests, use transactional OTP consumption and registration, add IP/device throttling, cleanup/TTL retention policy, audit logging, and reliable email queues.
- Keep existing production secrets safe; rotate any credentials previously exposed.
