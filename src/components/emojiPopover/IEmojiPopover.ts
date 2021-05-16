// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { EmojiData } from 'emoji-mart';

export interface IEmojiProps {
    onSelect(emoji: EmojiData): void;
}
