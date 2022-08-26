import { useHttpService } from 'data/webAPI/dependecyRegisterar';
import { Container } from 'inversify';
import { useMicros } from './data/microClient/dependecyRegisterar';

/**
 * Initialize container
 */
export const provider = new Container();

// useAws(provider)
// eslint-disable-next-line react-hooks/rules-of-hooks
useHttpService(provider);
// useFirestore(provider)
// eslint-disable-next-line react-hooks/rules-of-hooks
useMicros(provider);

// Features on the roadmap
// useAzure(provider)
// userAspNet(provider)
