import { useContext } from 'react';
import { AuthContext } from '../contexts/JWTContext';

// ----------------------------------------------------------------------

const useAuth = () => useContext(AuthContext);

export default useAuth;
