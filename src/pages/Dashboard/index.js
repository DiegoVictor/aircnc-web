import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';

import { UserContext } from '~/contexts/User';
import api from '~/services/api';
import { disconnect, connect, subscribe } from '~/services/socket';
import Box from '~/components/Box';
import {
  Spots,
  Spot,
  Banner,
  Notifications,
  Notification,
  Accept,
  Cancel,
} from './styles';

export default () => {
  const [spots, setSpots] = useState([]);
  const [requests, setRequests] = useState([]);
  const { id: userId } = useContext(UserContext);

  const approve = useCallback(
    async bookingId => {
      try {
        await api.post(`bookings/${bookingId}/approval`);
        setRequests(requests.filter(request => request._id !== bookingId));
      } catch (err) {
        toast.error(
          'Opa! Alguma coisa deu errado ao tentar aprovar essa reserva, tente novamente!'
        );
      }
    },
    [requests]
  );

  const reject = useCallback(
    async bookingId => {
      try {
        await api.post(`bookings/${bookingId}/rejection`);
        setRequests(requests.filter(request => request._id !== bookingId));
      } catch (err) {
        toast.error(
          'Opa! Alguma coisa deu errado ao tentar rejeitar essa reserva, tente novamente!'
        );
      }
    },
    [requests]
  );

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/dashboard`);
        setSpots(data);
      } catch (err) {
        toast.error(
          'Opa! Alguma coisa deu errado ao tentar carregar seus spots, tente recarregar a pagina!'
        );
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('pending', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRequests(
        data.map(request => {
          return {
            ...request,
            date: format(parseISO(request.date), "dd'/'MM'/'yyyy"),
          };
        })
      );
    })();
  }, [token]);

  useEffect(() => {
    disconnect();
    connect({ user_id: userId });
    subscribe('booking_request', data => {
      setRequests([
        ...requests,
        {
          ...data,
          date: format(parseISO(data.date), "dd'/'MM'/'yyyy"),
        },
      ]);
    });
  }, [requests, userId]);

  return (
    <Box>
      {requests.length > 0 && (
        <Notifications>
          {requests.map(request => (
            <Notification
              key={request._id}
              data-testid={`notification_${request._id}`}
            >
              <p>
                <strong>{request.user.email}</strong> está solicitando uma nova
                reserva em <strong>{request.spot.company}</strong> para a
                data:&nbsp;
                <strong>{request.date}</strong>
              </p>
              <Accept
                data-testid={`notification_approve_${request._id}`}
                type="button"
                onClick={() => approve(request._id)}
              >
                ACEITAR
              </Accept>
              <Cancel
                data-testid={`notification_reject_${request._id}`}
                type="button"
                onClick={() => reject(request._id)}
              >
                REJEITAR
              </Cancel>
            </Notification>
          ))}
        </Notifications>
      )}
      {spots.length > 0 && (
        <Spots>
          {spots.map(spot => (
            <Link to={`/spots/${spot._id}`} key={spot._id}>
              <Spot key={spot._id} data-testid={`spot_${spot._id}`}>
                <Banner url={spot.thumbnail_url} />
                <strong>{spot.company}</strong>
                <span>
                  {spot.price > 0 ? `R$ ${spot.price}/DIA` : 'GRATUITO'}
                </span>
              </Spot>
            </Link>
          ))}
        </Spots>
      )}
      <Link to="/spot" data-testid="new">
        <button type="button">Novo spot</button>
      </Link>
    </Box>
  );
};
