import { createContext } from 'react';

import { setAuthorization } from '~/services/api';

let user = {};
if (typeof localStorage.aircnc_user !== 'undefined') {
  user = JSON.parse(localStorage.getItem('aircnc_user'));
  setAuthorization(user.token);
}

export const UserContext = createContext(user);
