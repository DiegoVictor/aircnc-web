import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import faker from '@faker-js/faker';
import MockAdapter from 'axios-mock-adapter';

import { toast } from 'react-toastify';
import { UserContext } from '~/contexts/User';
import api from '~/services/api';
import history from '~/services/history';
import SignIn from '~/pages/SignIn';

jest.mock('~/services/history');

describe('SignIn page', () => {
  const id = faker.datatype.number();
  const token = faker.datatype.uuid();
  const email = faker.internet.email();
  const apiMock = new MockAdapter(api);

  history.push.mockImplementation(jest.fn());

  it('should be able to login', async () => {
    const user = {};
    apiMock.onPost('sessions').reply(200, { user: { _id: id }, token });

    const { getByPlaceholderText, getByTestId } = render(
      <UserContext.Provider value={user}>
        <SignIn />
      </UserContext.Provider>
    );

    fireEvent.change(getByPlaceholderText('Seu melhor email'), {
      target: { value: email },
    });

    await act(async () => {
      fireEvent.submit(getByTestId('form'));
    });

    expect(history.push).toHaveBeenCalledWith('/dashboard');
    expect(user).toStrictEqual({ id, token });
    expect(localStorage).toHaveProperty(
      'aircnc_user',
      JSON.stringify({ id, token })
    );
  });

  it('should not be able to login', async () => {
    const user = {};
    apiMock.onPost('sessions').reply(400);

    const error = jest.spyOn(toast, 'error');

    const { getByPlaceholderText, getByTestId } = render(
      <UserContext.Provider value={user}>
        <SignIn />
      </UserContext.Provider>
    );

    fireEvent.change(getByPlaceholderText('Seu melhor email'), {
      target: { value: email },
    });

    await act(async () => {
      fireEvent.submit(getByTestId('form'));
    });

    expect(history.push).not.toHaveBeenCalled();
    expect(error).toHaveBeenLastCalledWith(
      'Opa! Alguma coisa deu errado, tente novamente!'
    );
  });
});
