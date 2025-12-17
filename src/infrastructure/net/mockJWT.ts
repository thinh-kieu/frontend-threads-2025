import { errors, jwtVerify, SignJWT } from 'jose';

export const JWT_SECRET = new Uint8Array([
  121, 111, 117, 114, 45, 109, 111, 99, 107, 45, 115, 101, 99, 114, 101, 116,
  45, 107, 101, 121,
]);

export const generateAccessToken = async () => {
  const token = await new SignJWT({ type: 'Bearer' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('2 minutes')
    .sign(JWT_SECRET);

  return token;
};

export const generateRefreshToken = async () => {
  return await new SignJWT({ type: 'Bearer' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('5 minutes')
    .sign(JWT_SECRET);
};

export const verifyBearerAccessToken = async (
  accessTokenWithBearer: string,
) => {
  const accessToken = accessTokenWithBearer.replace('Bearer ', '');

  try {
    const { payload, protectedHeader } = await jwtVerify(
      accessToken,
      JWT_SECRET,
      {
        // Optional: Add other validation options like issuer, audience, etc.
        // issuer: 'your-issuer',
        // audience: 'your-audience',
      },
    );

    // If verification is successful, the token is not expired (and other validations passed)
    console.debug('Token is valid and not expired.');
    console.debug('Payload:', payload);
    console.debug('Protected Header:', protectedHeader);

    return true;
  } catch (error) {
    if (error instanceof errors.JWTExpired) {
      console.debug('Token is expired.');
      return false;
    } else if (error instanceof errors.JWSSignatureVerificationFailed) {
      console.debug('Token signature verification failed.');
      return false;
    } else {
      console.error(
        'An unexpected error occurred during token verification:',
        error,
      );
      return false;
    }
  }
};
