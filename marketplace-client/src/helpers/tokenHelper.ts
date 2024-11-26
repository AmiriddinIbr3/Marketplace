import { TokensNaming } from '@/types/tokens/enumTokensNaming';
import Cookies from 'js-cookie';

const serverPortDomain = process.env.NEXT_PUBLIC_SERVER_DOMAIN;
const lifecycleOfAccessToken = parseInt(process.env.NEXT_PUBLIC_EXPIRING_ACCESS_TOKEN_MINUTES as string, 10);

export const getAccessToken = (): string | undefined => {
    return Cookies.get(TokensNaming.ACCESS_TOKEN);
}

export const saveAccessToken = (accessToken: string): void => {
    const now = new Date();
    const expires = new Date(now.getTime() + lifecycleOfAccessToken * 60 * 1000);

    Cookies.set(TokensNaming.ACCESS_TOKEN, accessToken, {
        domain: serverPortDomain,
        sameSite: 'strict',
        expires: expires
    });
}

export const removeAccessToken = (): void => {
    Cookies.remove(TokensNaming.ACCESS_TOKEN);
}