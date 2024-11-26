import { v4 as uuidv4 } from 'uuid';

export function generateActivationLinkUrl(apiUrl: string): {
    url: string,
    activationLink: string,
} {
    const activationLink = uuidv4();
    return {
        url: `${apiUrl}/api/user/activate/${activationLink}`,
        activationLink,
    };
}