# UstaadBid integrated development build

This ZIP extends the Phase 2 source with MongoDB-backed conversations/messages (HTTP polling UI, **not Socket.IO**), notifications, booking status transitions, cash confirmation, warranties, warranty claims, reviews, disputes, admin verification and audit records.

## Security first
The MongoDB password and JWT secret previously shared in chat are compromised. Rotate the MongoDB database user's password in Atlas and generate a fresh JWT secret. Never commit `.env` files. Backend `.env` intentionally contains placeholders: replace them with NEW values. Never reuse the credentials posted in chat.

## Setup
1. `cd backend && npm install` then edit `backend/.env` and `npm run dev`.
2. In a second terminal: `cd frontend && npm install && npm run dev`.
3. Browse `http://localhost:5173` or `http://localhost:5174`. Both origins are allowed in the development `.env`.
4. MongoDB Atlas must be reachable. Bid acceptance uses MongoDB transactions and requires a replica set (Atlas clusters support this).

## Important limitations (NOT production ready)
- Dependency installation and frontend production build could not be completed in this environment; test locally.
- Chat is persistent via HTTP requests, but real-time Socket.IO, unread counters, and chat rate limits remain unfinished.
- Image uploads/Cloudinary and technician verification documents are not implemented.
- Warranty creation is performed after completion rather than recording and locking detailed coverage before work; needs a formal pre-service agreement workflow.
- Claims need admin evidence review and finer-grained covered-fault verification.
- Admin bootstrap, password reset, CSRF tokens, full automated tests, secure deployment, and complete mobile UI QA are not finished.
- Some actions use browser prompt dialogs; replace with accessible forms before release.
- Admin routes exist but first admin account must be provisioned using a secure one-time administrative procedure; never self-register an admin.
- Cookie-authenticated mutations check Origin when present, but a complete CSRF defense should reject missing Origin or implement CSRF tokens in production.

## Project scope
This is an expanded development baseline, **not** a tested, complete, commercial application. Do not deploy publicly without finishing the above requirements and security review.
