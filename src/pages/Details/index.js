import React, { useCallback, useEffect, useState } from 'react';
import { parseISO, format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import api from '~/services/api';
import history from '~/services/history';
import Back from '~/components/Back';
import Box from '~/components/Box';
import { Spot, Banner, Techs, Bookings, LinkButton } from './styles';

export default () => {
  const [spot, setSpot] = useState(null);
  const { id: spotId } = useParams();

  const reject = useCallback(
    async bookingId => {
      try {
        await api.post(`bookings/${bookingId}/rejection`);
        const bookings = spot.bookings.filter(
          booking => booking._id !== bookingId
        );
        setSpot({ ...spot, bookings });
      } catch (err) {
        toast.error(
          'Opa! Alguma coisa deu errado ao tentar rejeitar a reserva, tente novamente!'
        );
      }
    },
    [spot]
  );

  const deleteSpot = useCallback(async id => {
    try {
      await api.delete(`spots/${id}`);
      history.push('/dashboard');
    } catch (err) {
      toast.error(
        'Opa! Alguma coisa deu errado ao tentar remover esse spot, tente novamente!'
      );
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`spots/${spotId}`);

        setSpot({
          ...data,
          bookings: data.bookings.map(booking => ({
            ...booking,
            date: format(parseISO(booking.date), "dd'/'MM'/'yyyy"),
          })),
        });
      } catch (err) {
        toast.error(
          'Opa! Alguma coisa deu errado ao tentar carregar o spot, tente recarregar a pagina!'
        );
      }
    })();
  }, [spotId]);

  return (
    <>
      <Back />
      {spot && (
        <Box>
          <ul>
            <Spot>
              <div>
                <Techs>
                  {spot.techs.map(tech => (
                    <span key={tech}>{tech}</span>
                  ))}
                </Techs>
                <LinkButton to={`/spots/${spotId}/edit`} data-testid="edit">
                  Editar
                </LinkButton>
              </div>
              <Banner url={spot.thumbnail_url} data-testid="banner" />
              <strong>{spot.company}</strong>
              <span>
                {spot.price > 0 ? `R$ ${spot.price}/DIA` : 'GRATUITO'}
              </span>
            </Spot>
          </ul>
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
                      <button
                        data-testid={`booking_reject_${booking.id}`}
                        type="button"
                        onClick={() => reject(booking._id)}
                      >
                        <svg
                          style={{ width: '23px', height: '23px' }}
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="#555"
                            d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
                          />
                        </svg>
                        Cancelar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Bookings>
          ) : (
            <button
              data-testid="delete"
              type="button"
              onClick={() => deleteSpot(spotId)}
            >
              Remover Spot
            </button>
          )}
        </Box>
      )}
    </>
  );
};
