import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import faker from '@faker-js/faker';
import { Router } from 'react-router-dom';
import { toast } from 'react-toastify';

import { UserContext } from '~/contexts/User';
import { run } from '../../mocks/socket.io-client';
import api from '~/services/api';
import history from '~/services/history';
import factory from '../utils/factory';
import Dashboard from '~/pages/Dashboard';

describe('Dashboard page', () => {
  const apiMock = new MockAdapter(api);
  const id = faker.datatype.number();
  const token = faker.datatype.uuid();

  beforeEach(async () => {
    await act(async () => {
      localStorage.setItem('aircnc_user', JSON.stringify({ id, token }));
    });
  });

  it('should be able to list spots', async () => {
    const spots = await factory.attrsMany('Spot', 3);

    let getByTestId;

    apiMock
      .onGet('/dashboard')
      .reply(200, spots)
      .onGet('/pending')
      .reply(200, []);

    await act(async () => {
      const component = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Dashboard />
          </Router>
        </UserContext.Provider>
      );
      getByTestId = component.getByTestId;
    });

    spots.forEach(spot => {
      expect(getByTestId(`spot_${spot._id}`)).toBeInTheDocument();
    });
  });

  it('should not be able to list my spots with network error', async () => {
    const error = jest.spyOn(toast, 'error');

    apiMock
      .onGet('/dashboard')
      .reply(404)
      .onGet('/pending')
      .reply(200, []);

    await act(async () => {
      render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Dashboard />
          </Router>
        </UserContext.Provider>
      );
    });

    expect(error).toHaveBeenCalledWith(
      'Opa! Alguma coisa deu errado ao tentar carregar seus spots, tente recarregar a pagina!'
    );
  });

  it('should not be able to list pending spots with network error', async () => {
    const spots = await factory.attrsMany('Spot', 3);
    apiMock
      .onGet('/dashboard')
      .reply(200, spots)
      .onGet('/pending')
      .reply(404);

    const error = jest.spyOn(toast, 'error');

    await act(async () => {
      render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Dashboard />
          </Router>
        </UserContext.Provider>
      );
    });

    expect(error).toHaveBeenCalledWith(
      'Opa! Alguma coisa deu errado ao tentar carregar a lista de reservas pendentes, tente recarregar a pagina!'
    );
  });

  it('should be able to go to new spot page', async () => {
    const spots = await factory.attrsMany('Spot', 3);
    apiMock
      .onGet('/dashboard')
      .reply(200, spots)
      .onGet('/pending')
      .reply(200, []);

    let getByTestId;

    await act(async () => {
      const component = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Dashboard />
          </Router>
        </UserContext.Provider>
      );
      getByTestId = component.getByTestId;
    });

    fireEvent.click(getByTestId('new'));
    expect(history.location.pathname).toBe('/spot');
  });

  it('should be able to list pending spot requests', async () => {
    const requests = await factory.attrsMany('Booking', 3);

    let getByTestId;

    const spots = await factory.attrsMany('Spot', 3);
    apiMock
      .onGet('/dashboard')
      .reply(200, spots)
      .onGet('/pending')
      .reply(200, requests);

    await act(async () => {
      const component = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Dashboard />
          </Router>
        </UserContext.Provider>
      );
      getByTestId = component.getByTestId;
    });

    requests.forEach(request => {
      expect(getByTestId(`notification_${request._id}`)).toBeInTheDocument();
    });
  });

  it('should be able to receive booking request', async () => {
    const booking = await factory.attrs('Booking');

    let getByTestId;

    const spots = await factory.attrsMany('Spot', 3);
    apiMock
      .onGet('/dashboard')
      .reply(200, spots)
      .onGet('/pending')
      .reply(200, []);

    await act(async () => {
      const component = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Dashboard />
          </Router>
        </UserContext.Provider>
      );
      getByTestId = component.getByTestId;
    });

    await act(async () => {
      run(booking);
    });

    expect(getByTestId(`notification_${booking._id}`)).toBeInTheDocument();
  });

  it('should be able to approve a booking spot request', async () => {
    const [request, ...rest] = await factory.attrsMany('Booking', 3);

    let getByTestId;
    let queryByTestId;

    const spots = await factory.attrsMany('Spot', 3);
    apiMock
      .onGet('/dashboard')
      .reply(200, spots)
      .onGet('/pending')
      .reply(200, [request, ...rest])
      .onPost(`/bookings/${request._id}/approval`)
      .reply(200);

    await act(async () => {
      const component = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Dashboard />
          </Router>
        </UserContext.Provider>
      );
      getByTestId = component.getByTestId;
      queryByTestId = component.queryByTestId;
    });

    await act(async () => {
      fireEvent.click(getByTestId(`notification_approve_${request._id}`));
    });

    expect(
      queryByTestId(`[data-testid="notification_approve_${request._id}"]`)
    ).toBeNull();
  });

  it('should not be able to approve a booking spot request', async () => {
    const [request, ...rest] = await factory.attrsMany('Booking', 3);

    let getByTestId;
    let queryByTestId;

    const spots = await factory.attrsMany('Spot', 3);
    apiMock
      .onGet('/dashboard')
      .reply(200, spots)
      .onGet('/pending')
      .reply(200, [request, ...rest])
      .onPost(`/bookings/${request._id}/approval`)
      .reply(401);

    const error = jest.spyOn(toast, 'error');

    await act(async () => {
      const component = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Dashboard />
          </Router>
        </UserContext.Provider>
      );
      getByTestId = component.getByTestId;
      queryByTestId = component.queryByTestId;
    });

    await act(async () => {
      fireEvent.click(getByTestId(`notification_approve_${request._id}`));
    });

    expect(
      queryByTestId(`[data-testid="notification_approve_${request._id}"]`)
    ).toBeNull();

    expect(error).toHaveBeenCalledWith(
      'Opa! Alguma coisa deu errado ao tentar aprovar essa reserva, tente novamente!'
    );
  });

  it('should be able to reject a booking spot request', async () => {
    const [request, ...rest] = await factory.attrsMany('Booking', 3);

    let getByTestId;
    let queryByTestId;

    const spots = await factory.attrsMany('Spot', 3);
    apiMock
      .onGet('/dashboard')
      .reply(200, spots)
      .onGet('/pending')
      .reply(200, [request, ...rest])
      .onPost(`/bookings/${request._id}/rejection`)
      .reply(200);

    await act(async () => {
      const component = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Dashboard />
          </Router>
        </UserContext.Provider>
      );
      getByTestId = component.getByTestId;
      queryByTestId = component.queryByTestId;
    });

    await act(async () => {
      fireEvent.click(getByTestId(`notification_reject_${request._id}`));
    });

    expect(
      queryByTestId(`[data-testid="notification_reject_${request._id}"]`)
    ).toBeNull();
  });

  it('should not be able to reject a booking spot request with network error', async () => {
    const [request, ...rest] = await factory.attrsMany('Booking', 3);

    let getByTestId;
    let queryByTestId;

    const spots = await factory.attrsMany('Spot', 3);
    apiMock
      .onGet('/dashboard')
      .reply(200, spots)
      .onGet('/pending')
      .reply(200, [request, ...rest])
      .onPost(`/bookings/${request._id}/rejection`)
      .reply(401);

    const error = jest.spyOn(toast, 'error');

    await act(async () => {
      const component = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Dashboard />
          </Router>
        </UserContext.Provider>
      );
      getByTestId = component.getByTestId;
      queryByTestId = component.queryByTestId;
    });

    await act(async () => {
      fireEvent.click(getByTestId(`notification_reject_${request._id}`));
    });

    expect(
      queryByTestId(`[data-testid="notification_reject_${request._id}"]`)
    ).toBeNull();
    expect(error).toHaveBeenCalledWith(
      'Opa! Alguma coisa deu errado ao tentar rejeitar essa reserva, tente novamente!'
    );
  });
});
