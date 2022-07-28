import { useHttpService } from 'data/webAPI/dependecyRegisterar';
import { Container } from 'inversify';
import { useOpenFaaS } from './data/openFaaSClient/dependecyRegisterar';

/**
 * Initialize container
 */
export const provider = new Container();

// useAws(provider)
// eslint-disable-next-line react-hooks/rules-of-hooks
useHttpService(provider);
// useFirestore(provider)
// eslint-disable-next-line react-hooks/rules-of-hooks
useOpenFaaS(provider);

// Features on the roadmap
// useAzure(provider)
// userAspNet(provider)
