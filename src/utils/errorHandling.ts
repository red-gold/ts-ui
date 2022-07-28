import { SocialError } from 'core/domain/common/socialError';

export const throwNoValue = (data: any, name: string) => {
    if (!data) {
        throw new SocialError(`null${  name}`, `${name  } is null!`);
    }
    return data;
};

export const defaultNoValue = (data: any, value: any) => {
    if (!data) {
        return value;
    }
    return data;
};
