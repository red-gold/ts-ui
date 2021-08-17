import * as configureStoreDev from './dev.configureStore';
import * as configureStoreProd from './prod.configureStore';
import * as configureStoreTest from './test.configureStore';

export const { store, useSelector, useDispatch, runSaga, close } =
    process.env.NODE_ENV === 'production'
        ? configureStoreProd
        : process.env.NODE_ENV === 'test'
        ? configureStoreTest
        : configureStoreDev;
