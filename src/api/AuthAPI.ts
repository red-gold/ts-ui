import StringAPI from 'api/StringAPI';
import { ServerRequestType } from 'constants/serverRequestType';
import { ServerRequestModel } from 'models/server';
import { ServerRequestStatusType } from 'store/actions/serverRequestStatusType';

/**
 * Create login server request
 */
const createLoginRequest = (email: string) => {
  const requestId = StringAPI.createServerRequestId(ServerRequestType.AuthLogin, email)
  return new ServerRequestModel(
      ServerRequestType.AuthLogin,
      requestId,
      '',
      ServerRequestStatusType.Sent
  )
}

/**
 * Create signup server request
 */
const createSignupRequest = (email: string) => {
  const requestId = StringAPI.createServerRequestId(ServerRequestType.AuthSignup, email)
  return new ServerRequestModel(
      ServerRequestType.AuthSignup,
      requestId,
      '',
      ServerRequestStatusType.Sent
  )
}

/**
 * Store token id
 */
const storeTokenId = (tokenId: string) => {
  localStorage.setItem('red-gold.scure.token', tokenId)
}

/**
 * Get token id
 */
const getTokenId = () => {
  localStorage.getItem('red-gold.scure.token')
}

const createCookie = (name: string,value: string,days: number) => {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toUTCString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

const readCookie = (name: string) => {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)===' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

const eraseCookie = (name: string) => {
  document.cookie = name +`=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;Domain=.${document.domain.split('.').splice(1).join('.')}`;
}

export const AuthAPI = {
  createLoginRequest,
  createSignupRequest,
  storeTokenId,
  getTokenId,
  createCookie,
  readCookie,
  eraseCookie
}
