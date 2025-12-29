import passport from '@/config/passport.config';
import { env } from '@/env';

export const getGoogleAuthUrl = (encodedState: string): string => {
  const strategy = (passport as any)._strategies['google'] as any;

  if (!strategy) {
    throw new Error('Google strategy not configured');
  }

  const params = new URLSearchParams({
    client_id: strategy._oauth2._clientId,
    redirect_uri: `${env.BACKEND_URL}${strategy._callbackURL}`,
    response_type: 'code',
    scope: 'profile email',
    state: encodedState,
    access_type: 'offline',
    prompt: 'consent',
  });

  return `${strategy._oauth2._authorizeUrl}?${params.toString()}`;
};

export const getFacebookAuthUrl = (encodedState: string): string => {
  const strategy = (passport as any)._strategies['facebook'] as any;

  if (!strategy) {
    throw new Error('Facebook strategy not configured');
  }

  const params = new URLSearchParams({
    client_id: strategy._oauth2._clientId,
    redirect_uri: `${env.BACKEND_URL}${strategy._callbackURL}`,
    response_type: 'code',
    scope: 'email',
    state: encodedState,
  });

  return `${strategy._oauth2._authorizeUrl}?${params.toString()}`;
};
