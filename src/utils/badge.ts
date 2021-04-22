// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Favico = require('favico.js');

export const addBadge = (amount: number) => {
    const favicon = new Favico({
        bgColor: '#5CB85C',
        animation: 'slide',
    });
    favicon.badge(amount);

    if ((window as any).badge_timeout_tab) {
        clearTimeout((window as any).badge_timeout_tab);
    }
    (window as any).badge_timeout_tab = setTimeout(() => {
        favicon.badge(0);
    }, 6000);
};
