// lib/jwt.ts
import jwt from 'jsonwebtoken'
const JWT_SECRET = 'skjdbfhbvpskheiurghiupghpoihsdijhfhhfosihdfiuyryryr'

export function signJwt(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyJwt(token: string) {
  return jwt.verify(token, JWT_SECRET)
}
