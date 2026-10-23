import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../models/index.js";
import {
  issueEmailChallenge,
  verifyEmailChallenge,
  resendEmailChallenge,
} from "../services/emailOtp.js";
import { auth } from "../middleware/auth.js";
import {
  validate,
  sessionCookie,
  safeUser,
  cookieOptions,
} from "../utils/helpers.js";
const r = Router();
r.post("/auth/register", async (req, res) => {
  try {
    const d = validate(
      z.object({
        name: z.string().min(2).max(80),
        email: z.string().email(),
        password: z.string().min(12).max(128),
        role: z.enum(["customer", "technician"]),
      }),
      req,
    );
    const email = d.email.trim().toLowerCase();
    if (await User.exists({ email }))
      return res.status(409).json({ error: "Email already registered" });
    const pending = {
      name: d.name,
      email,
      passwordHash: await bcrypt.hash(d.password, 12),
      role: d.role,
    };
    const challengeToken = await issueEmailChallenge({
      email,
      purpose: "register",
      pending,
    });
    res
      .status(202)
      .json({
        requiresTwoFactor: true,
        challengeToken,
        message: "Verification code sent to your email",
      });
  } catch (e) {
    res
      .status(e.status || (e instanceof z.ZodError ? 400 : 503))
      .json({
        error:
          e instanceof z.ZodError
            ? e.issues
            : e.publicMessage || "Could not send verification email",
      });
  }
});
r.post("/auth/login", async (req, res) => {
  try {
    const d = validate(
      z.object({ email: z.string().email(), password: z.string() }),
      req,
    );
    const email = d.email.trim().toLowerCase();
    const u = await User.findOne({ email }).select("+passwordHash");
    if (
      !u ||
      u.suspended ||
      !(await bcrypt.compare(d.password, u.passwordHash))
    )
      return res.status(401).json({ error: "Invalid credentials" });
    const challengeToken = await issueEmailChallenge({
      email,
      purpose: "login",
      userId: u.id,
    });
    res.json({
      requiresTwoFactor: true,
      challengeToken,
      message: "Verification code sent to your email",
    });
  } catch (e) {
    res
      .status(e.status || (e instanceof z.ZodError ? 400 : 503))
      .json({
        error:
          e instanceof z.ZodError
            ? e.issues
            : e.publicMessage || "Could not send verification email",
      });
  }
});
r.post("/auth/2fa/verify", async (req, res) => {
  try {
    const { challengeToken, code } = validate(
      z.object({
        challengeToken: z.string().min(20),
        code: z.string().regex(/^\d{6}$/),
      }),
      req,
    );
    const result = await verifyEmailChallenge(challengeToken, code);
    let u;
    if (result.purpose === "register") {
      if (await User.exists({ email: result.email }))
        return res.status(409).json({ error: "Email already registered" });
      try {
        u = await User.create(result.pending);
      } catch (e) {
        if (e.code === 11000)
          return res.status(409).json({ error: "Email already registered" });
        throw e;
      }
    } else {
      u = await User.findById(result.userId);
      if (!u || u.suspended)
        return res.status(401).json({ error: "Account unavailable" });
    }
    sessionCookie(res, u);
    res.json({ user: safeUser(u) });
  } catch (e) {
    res
      .status(e.status || 400)
      .json({ error: e.publicMessage || "Verification failed" });
  }
});
r.post("/auth/2fa/resend", async (req, res) => {
  try {
    const { challengeToken } = validate(
      z.object({ challengeToken: z.string().min(20) }),
      req,
    );
    await resendEmailChallenge(challengeToken);
    res.json({ ok: true, message: "A new code was sent" });
  } catch (e) {
    res
      .status(e.status || 400)
      .json({ error: e.publicMessage || "Could not resend code" });
  }
});
r.post('/auth/logout',(_req,res)=>{res.clearCookie('access_token',cookieOptions);res.json({ok:true})});
r.get("/auth/me", auth, (req, res) =>
  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      verification: req.user.verification,
      avatarUrl: req.user.avatarUrl,
      portfolioImages: req.user.portfolioImages,
      twoFactorEnabled: req.user.twoFactorEnabled,
    },
  }),
);
export default r;
