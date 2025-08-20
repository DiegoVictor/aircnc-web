import React from 'react';
import { render, act, fireEvent, waitFor } from '@testing-library/react';
import faker from '@faker-js/faker';
import MockAdapter from 'axios-mock-adapter';
import { Router } from 'react-router-dom';
import { toast } from 'react-toastify';

import { UserContext } from '~/contexts/User';
import api from '~/services/api';
import history from '~/services/history';
import factory from '../utils/factory';
import Details from '~/pages/Details';

jest.mock('~/services/history');

const spotId = faker.datatype.number();
const mockedUseParams = () => {
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

describe('Details page', () => {
  const apiMock = new MockAdapter(api);
  const id = faker.datatype.number();
  const token = faker.datatype.uuid();

  history.push.mockImplementation(jest.fn());

  beforeEach(async () => {
    await act(async () => {
      localStorage.setItem('aircnc_user', JSON.stringify({ id, token }));
    });
  });

  it('should be able to see spot details', async () => {
    const spot = await factory.attrs('Spot', { _id: spotId });

    apiMock.onGet(`/spots/${spot._id}`).reply(200, {
      ...spot,
      bookings: [],
    });

    const { getByTestId, getByText } = render(
      <UserContext.Provider value={{ id, token }}>
        <Router history={history}>
          <Details />
        </Router>
      </UserContext.Provider>
    );

    await waitFor(() => getByText(spot.company));

    expect(getByTestId('edit')).toBeInTheDocument();
    expect(getByText(spot.company)).toBeInTheDocument();

    expect(getByTestId('banner')).toHaveStyle(
      `background-image: url('${spot.thumbnail_url}')`
    );

    spot.techs.forEach((tech) => {
      expect(getByText(tech)).toBeInTheDocument();
    });

    if (spot.price > 0) {
      expect(getByText(`R$ ${spot.price}/DIA`)).toBeInTheDocument();
    } else {
      expect(getByText('GRATUITO')).toBeInTheDocument();
    }
  });

  it('should not be able to see spot details', async () => {
    const spot = await factory.attrs('Spot', { _id: spotId });

    const error = jest.spyOn(toast, 'error');

    apiMock.onGet(`/spots/${spot._id}`).reply(400);

    await act(async () => {
      render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Details />
          </Router>
        </UserContext.Provider>
      );
    });

    expect(error).toHaveBeenLastCalledWith(
      'Opa! Alguma coisa deu errado ao tentar carregar o spot, tente recarregar a pagina!'
    );
  });

  it('should be able to delete a spot', async () => {
    const spot = await factory.attrs('Spot', { _id: spotId });

    apiMock
      .onGet(`/spots/${spot._id}`)
      .reply(200, {
        ...spot,
        bookings: [],
      })
      .onDelete(`/spots/${spot._id}`)
      .reply(200);

    let getByTestId;

    await act(async () => {
      const component = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Details />
          </Router>
        </UserContext.Provider>
      );

      getByTestId = component.getByTestId;
    });

    await act(async () => {
      fireEvent.click(getByTestId('delete'));
    });

    expect(history.push).toHaveBeenCalledWith('/dashboard');
  });

  it('should not be able to delete a spot', async () => {
    const spot = await factory.attrs('Spot', { _id: spotId });
    const error = jest.spyOn(toast, 'error');

    apiMock
      .onGet(`/spots/${spot._id}`)
      .reply(200, {
        ...spot,
        bookings: [],
      })
      .onDelete(`/spots/${spot._id}`)
      .reply(401);

    let getByTestId;

    await act(async () => {
      const component = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Details />
          </Router>
        </UserContext.Provider>
      );

      getByTestId = component.getByTestId;
    });

    await act(async () => {
      fireEvent.click(getByTestId('delete'));
    });

    expect(history.push).not.toHaveBeenCalled();
    expect(error).toHaveBeenLastCalledWith(
      'Opa! Alguma coisa deu errado ao tentar remover esse spot, tente novamente!'
    );
  });

  it('should be able to reject spot booking request', async () => {
    const spot = await factory.attrs('Spot', { _id: spotId });
    const request = await factory.attrs('Booking');

    apiMock
      .onGet(`/spots/${spot._id}`)
      .reply(200, {
        ...spot,
        bookings: [request],
      })
      .onPost(`bookings/${request._id}/rejection`)
      .reply(200);

    let getByTestId;
    let queryByTestId;

    await act(async () => {
      const component = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Details />
          </Router>
        </UserContext.Provider>
      );

      getByTestId = component.getByTestId;
      queryByTestId = component.queryByTestId;
    });

    await act(async () => {
      fireEvent.click(getByTestId(`booking_reject_${request.id}`));
    });

    expect(queryByTestId(`booking_reject_${request.id}`)).toBeNull();
  });

  it('should not be able to reject spot booking request', async () => {
    const spot = await factory.attrs('Spot', { _id: spotId });
    const request = await factory.attrs('Booking');
    const error = jest.spyOn(toast, 'error');

    apiMock
      .onGet(`/spots/${spot._id}`)
      .reply(200, {
        ...spot,
        bookings: [request],
      })
      .onPost(`bookings/${request._id}/rejection`)
      .reply(401);

    let getByTestId;

    await act(async () => {
      const component = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Details />
          </Router>
        </UserContext.Provider>
      );

      getByTestId = component.getByTestId;
    });

    await act(async () => {
      fireEvent.click(getByTestId(`booking_reject_${request.id}`));
    });

    expect(error).toHaveBeenLastCalledWith(
      'Opa! Alguma coisa deu errado ao tentar rejeitar a reserva, tente novamente!'
    );
  });
});
