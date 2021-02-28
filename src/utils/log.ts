export const log = {
    info: (message?: any, ...optionalParams: any[]) => {
        // eslint-disable-next-line no-console
        console.log('[TELAR][INFO]', ...[message, ...optionalParams]);
    },
    warn: (message?: any, ...optionalParams: any[]) => {
        // eslint-disable-next-line no-console
        console.log('[TELAR][WARN]', ...[message, ...optionalParams]);
    },
    error: (message?: any, ...optionalParams: any[]) => {
        // eslint-disable-next-line no-console
        console.log('[TELAR][ERROR]', ...[message, ...optionalParams]);
    },
};
