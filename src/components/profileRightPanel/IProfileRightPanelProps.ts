// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Map } from 'immutable';

export interface IProfileRightPanelProps {
    profile: Map<string, any>;
    isCurrentUser: boolean;
}
