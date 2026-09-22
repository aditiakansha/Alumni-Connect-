import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function verifyGoogleToken(idToken: string) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    throw new Error("Invalid Google token: no email in payload");
  }

  return {
    email: payload.email,
    name: payload.name ?? payload.email.split("@")[0],
    picture: payload.picture,
    emailVerified: payload.email_verified ?? false,
  };
}