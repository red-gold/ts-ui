import { useHttpService } from 'data/webAPI/dependecyRegisterar'
import { Container } from 'inversify'
import CommonAPI from 'api/CommonAPI'
import { useOpenFaaS } from './data/openFaaSClient/dependecyRegisterar';

/**
 * Developer tools
 */
window['console']['trace'] = CommonAPI.logger

/**
 * Initialize container
 */
export const provider = new Container()

// useAws(provider)
useHttpService(provider)
// useFirestore(provider)
useOpenFaaS(provider)

// Features on the roadmap
// useAzure(provider)
// userAspNet(provider)
