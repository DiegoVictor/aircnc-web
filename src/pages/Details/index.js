import React, { useCallback, useEffect, useState } from 'react';
import { parseISO, format } from 'date-fns';

import { Container, Spot, Banner, Techs, Bookings } from './styles';
import api from '~/services/api';

export default function Details({ match, history }) {
  const [spot, setSpot] = useState(null);
  const { id } = match.params;

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`spots/${id}`);

      setSpot({
        ...data,
        bookings: data.bookings.map(booking => ({
          ...booking,
          date: format(parseISO(booking.date), "dd'/'MM'/'yyyy"),
        })),
      });
    })();
  }, [id]);

  const reject = useCallback(
    booking_id => {
      (async () => {
        await api.post(`bookings/${booking_id}/rejection`);
        const bookings = spot.bookings.filter(
          booking => booking._id !== booking_id
        );
        setSpot({ ...spot, bookings });
      })();
    },
    [spot]
  );

  const deleteSpot = useCallback(
    spot_id => {
      (async () => {
        await api.delete(`spots/${spot_id}`);
        history.push('/dashboard');
      })();
    },
    [history]
  );

  return (
    <Container>
      {spot && (
        <>
          <Spot>
            <Banner url={spot.thumbnail_url} />
            <strong>{spot.company}</strong>
            <span>{spot.price > 0 ? `R$ ${spot.price}/DIA` : 'GRATUITO'}</span>

            <Techs>
              {spot.techs.map(tech => (
                <span key={tech}>{tech}</span>
              ))}
            </Techs>
          </Spot>

          {spot.bookings.length > 0 ? (
            <Bookings>
              <thead>
                <tr>
                  <th colSpan="3">Reservas aprovadas</th>
                </tr>
              </thead>
              <tbody>
                {spot.bookings.map(booking => (
                  <tr key={booking._id}>
                    <td>{booking.user.email}</td>
                    <td>{booking.date}</td>
                    <td>
                      <button type="button" onClick={() => reject(booking._id)}>
                        Rejeitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Bookings>
          ) : (
            <button type="button" onClick={() => deleteSpot(id)}>
              Remover
            </button>
          )}
        </>
      )}
    </Container>
  );
}
