import React, { useCallback, useContext } from 'react';
import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';

import { UserContext } from '~/contexts/User';
import api from '~/services/api';
import history from '~/services/history';
import Box from '~/components/Box';

const schema = Yup.object().shape({
  email: Yup.string()
    .email('Digite um email valido')
    .required('Campo obrigatório'),
});

export default () => {
  const user = useContext(UserContext);
  const handleSubmit = useCallback(
    async ({ email }) => {
      const { data } = await api.post('sessions', { email });

      const {
        user: { _id: id },
        token,
      } = data;

      localStorage.setItem('aircnc_user', JSON.stringify({ id, token }));
      user.id = id;
      user.token = token;

      history.push('/dashboard');
    },
    [user.id, user.token]
  );

  return (
      <Box>
        <p>
          Ofereça <strong>spots</strong> para programadores e encontre{' '}
          <strong>talentos</strong> para sua empresa
        </p>

      <Form schema={schema} onSubmit={handleSubmit}>
            type="email"
            placeholder="Seu melhor email"
            required
          />

          <button type="submit">Enviar</button>
        </Form>
      </Box>
    
  );
};
