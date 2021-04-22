// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const notifyElementId = 'telar-audio-notification';
export const playNotify = () => {
    const audio: HTMLAudioElement = document.getElementById(notifyElementId) as HTMLAudioElement;
    if (audio) {
        audio.play();
    }
};

export const addNotifyAudio = () => {
    if (document.getElementById(notifyElementId)) {
        return;
    }
    const soundURL =
        'https://raw.githubusercontent.com/red-gold/red-gold-web/master/website/static/media/done-for-you-612.mp3';

    const audio: HTMLAudioElement = document.createElement('audio');
    audio.setAttribute('id', notifyElementId);
    audio.setAttribute('src', soundURL);
    audio.setAttribute('allow', 'autoplay');
    document.body.appendChild(audio);
};
