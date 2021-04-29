import { useHttpService } from 'data/webAPI/dependecyRegisterar';
import { Container } from 'inversify';
import { useOpenFaaS } from './data/openFaaSClient/dependecyRegisterar';

/**
 * Initialize container
 */
export const provider = new Container();

// useAws(provider)
useHttpService(provider);
// useFirestore(provider)
useOpenFaaS(provider);

// Features on the roadmap
// useAzure(provider)
// userAspNet(provider)
