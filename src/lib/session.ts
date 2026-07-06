import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const key = new TextEncoder().encode(process.env.SESSION_SECRET!);

interface SessionPayload {
  userId: string;
  username: string;
  [key: string]: unknown;
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function decrypt(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

function cookieOpts(maxAge: number) {
  const opts = [`session=; HttpOnly`, `Path=/`, `SameSite=Lax`, `Max-Age=${maxAge}`];
  if (process.env.NODE_ENV === "production") opts.push("Secure");
  return opts.join("; ");
}

export function setSessionCookie(response: Response, token: string) {
  const opts = [`session=${token}; HttpOnly`, `Path=/`, `SameSite=Lax`, `Max-Age=${60 * 60 * 24 * 7}`];
  if (process.env.NODE_ENV === "production") opts.push("Secure");
  response.headers.set("Set-Cookie", opts.join("; "));
}

export function clearSessionCookie(response: Response) {
  response.headers.set("Set-Cookie", cookieOpts(0));
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  return decrypt(token);
}
