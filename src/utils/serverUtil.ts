// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { ServerRequestType } from 'constants/serverRequestType';
import { ServerRequestModel } from 'models/server/serverRequestModel';
import { ServerRequestStatusType } from 'store/actions/serverRequestStatusType';

export const initServerRequest = (type: ServerRequestType, id: string) => {
    return new ServerRequestModel(type, id, '', ServerRequestStatusType.Sent);
};
