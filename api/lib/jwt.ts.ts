import { SignJWT, jwtVerify } from 'jose';
import { env } from './env';

const secret = new TextEncoder().encode(env.appSecret);

export async function createToken(payload: {
  id: number;
  email: string;
  name: string;
  role: string;
  isExcelAuthorized: boolean;
}) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.id.toString())
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifyJWT(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return {
    id: Number(payload.sub),
    email: payload.email as string,
    name: payload.name as string,
    role: payload.role as string,
    isExcelAuthorized: payload.isExcelAuthorized as boolean,
  };
}