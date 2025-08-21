import React from 'react';
import { act, render, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { faker } from '@faker-js/faker';
import MockAdapter from 'axios-mock-adapter';

import { toast } from 'react-toastify';
import { UserContext } from '~/contexts/User';
import api from '~/services/api';
import history from '~/services/history';
import factory from '../utils/factory';
import Spot from '~/pages/Spot';

const spotId = faker.number.int();
let mockedUseParams = () => {
  return { id: spotId };
};
jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useParams: () => {
      return mockedUseParams();
    },
  };
});
jest.mock('~/services/history');

describe('Spot page', () => {
  const apiMock = new MockAdapter(api);
  const id = faker.number.int();
  const token = faker.string.uuid();

  history.push.mockImplementation(jest.fn());

  beforeEach(async () => {
    await act(async () => {
      localStorage.setItem('aircnc_user', JSON.stringify({ id, token }));
    });
  });

  it('should be able to edit a spot ', async () => {
    const spot = await factory.attrs('Spot', { _id: spotId });
    const { company, techs, price } = await factory.attrs('Spot');

    apiMock
      .onGet(`/spots/${spot._id}`)
      .reply(200, spot)
      .onPut(`/spots/${spot._id}`)
      .reply(200);

    let getByPlaceholderText;
    let getByTestId;

    await act(async () => {
      const component = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Spot />
          </Router>
        </UserContext.Provider>
      );

      getByPlaceholderText = component.getByPlaceholderText;
      getByTestId = component.getByTestId;
    });

    fireEvent.change(getByPlaceholderText('Sua empresa incrível'), {
      target: { value: company },
    });
    fireEvent.change(getByPlaceholderText('Quais tecnologias usam?'), {
      target: { value: techs.join(',') },
    });
    fireEvent.change(getByPlaceholderText('Valor cobrado por dia'), {
      target: { value: price },
    });

    await act(async () => {
      fireEvent.submit(getByTestId('form'));
    });

    expect(history.push).toHaveBeenCalledWith(`/spots/${spot._id}`);
  });

  it('should not be able to edit a spot that was not possible to load', async () => {
    const spot = await factory.attrs('Spot', { _id: spotId });
    const error = jest.spyOn(toast, 'error');

    apiMock
      .onGet(`/spots/${spot._id}`)
      .reply(404)
      .onPut(`/spots/${spot._id}`)
      .reply(200);

    await act(async () => {
      render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Spot />
          </Router>
        </UserContext.Provider>
      );
    });

    expect(error).toHaveBeenLastCalledWith(
      'Opa! Alguma coisa deu errado ao tentar carregar os dados do spot, tente recarregar a pagina!'
    );
  });

  it('should be able to create a new spot ', async () => {
    const { company, price, techs } = await factory.attrs('Spot');

    apiMock.onPost('spots').reply(200);
    global.URL.createObjectURL = jest.fn(() => {
      return faker.image.url();
    });

    let getByPlaceholderText;
    let getByTestId;

    mockedUseParams = () => ({ id: null });

    await act(async () => {
      const component = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Spot />
          </Router>
        </UserContext.Provider>
      );

      getByPlaceholderText = component.getByPlaceholderText;
      getByTestId = component.getByTestId;
    });

    fireEvent.change(getByPlaceholderText('Sua empresa incrível'), {
      target: { value: company },
    });
    fireEvent.change(getByPlaceholderText('Quais tecnologias usam?'), {
      target: { value: techs.join(',') },
    });
    fireEvent.change(getByPlaceholderText('Valor cobrado por dia'), {
      target: { value: price },
    });

    await act(async () => {
      fireEvent.change(getByTestId('banner'), {
        target: { files: [new Blob(['content'])] },
      });
    });

    await act(async () => {
      fireEvent.submit(getByTestId('form'));
    });

    expect(history.push).toHaveBeenCalledWith('/dashboard');
  });

  it('should not be able to create a new spot ', async () => {
    const { company, price, techs } = await factory.attrs('Spot');

    apiMock.onPost('spots').reply(400);
    global.URL.createObjectURL = jest.fn(() => {
      return faker.image.url();
    });

    let getByPlaceholderText;
    let getByTestId;

    mockedUseParams = () => ({ id: null });
    const error = jest.spyOn(toast, 'error');

    await act(async () => {
      const component = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Spot />
          </Router>
        </UserContext.Provider>
      );

      getByPlaceholderText = component.getByPlaceholderText;
      getByTestId = component.getByTestId;
    });

    fireEvent.change(getByPlaceholderText('Sua empresa incrível'), {
      target: { value: company },
    });
    fireEvent.change(getByPlaceholderText('Quais tecnologias usam?'), {
      target: { value: techs.join(',') },
    });
    fireEvent.change(getByPlaceholderText('Valor cobrado por dia'), {
      target: { value: price },
    });

    await act(async () => {
      fireEvent.change(getByTestId('banner'), {
        target: { files: [new Blob(['content'])] },
      });
    });

    await act(async () => {
      fireEvent.submit(getByTestId('form'));
    });

    expect(history.push).not.toHaveBeenCalled();
    expect(error).toHaveBeenLastCalledWith(
      'Opa! Alguma coisa deu errado ao tentar criar/atualizar o spot, tente novamente!'
    );
  });
});
