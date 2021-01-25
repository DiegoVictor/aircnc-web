import React, { useEffect, useState, useCallback } from 'react';
import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import Camera from '~/assets/camera.svg';
import api from '~/services/api';
import Back from '~/components/Back';
import Box from '~/components/Box';
import history from '~/services/history';
import { Thumbnail } from './styles';

const schema = Yup.object().shape({
  company: Yup.string().required('Informe o nome da sua empresa'),
  techs: Yup.string().required('Informe as tecnologias vocês usam'),
  price: Yup.string(),
});

export default () => {
  const [spot, setSpot] = useState({});
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState('');
  const { id: spotId } = useParams();

  const showPreview = useCallback(event => {
    const file = event.target.files[0];
    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
  }, []);

  const handleSubmit = useCallback(
    async ({ company, techs, price }) => {
      try {
        const data = new FormData();

        if (thumbnail) {
          data.append('thumbnail', thumbnail);
        }

        data.append('company', company);
        data.append('techs', techs);

        if (price) {
          data.append('price', price);
        }

        if (spotId) {
          await api.put(`spots/${spotId}`, data);
          history.push(`/spots/${spotId}`);
        } else {
          await api.post('spots', data);
          history.push('/dashboard');
        }
      } catch (err) {
        toast.error(
          'Opa! Alguma coisa deu errado ao tentar criar/atualizar o spot, tente novamente!'
        );
      }
    },
    [spotId, thumbnail]
  );

  useEffect(() => {
    (async () => {
      try {
        if (spotId) {
          const { data } = await api.get(`spots/${spotId}`);
          setSpot(data);
          setPreview(data.thumbnail_url);
        }
      } catch (err) {
        toast.error(
          'Opa! Alguma coisa deu errado ao tentar carregar os dados do spot, tente recarregar a pagina!'
        );
      }
    })();
  }, [spotId]);

  return (
    <>
      <Back />
      <Box>
        <Form schema={schema} onSubmit={handleSubmit} initialData={spot}>
          <Thumbnail url={preview}>
            <input data-testid="banner" type="file" onChange={showPreview} />
            <img src={Camera} alt="Selecionar imagem" />
          </Thumbnail>

          <label htmlFor="company">EMPRESA *</label>
          <Input
            id="company"
            name="company"
            placeholder="Sua empresa incrível"
          />

          <label htmlFor="techs">
            TECNOLOGIAS * <span>(separadas por vírgula)</span>
          </label>
          <Input
            id="techs"
            name="techs"
            placeholder="Quais tecnologias usam?"
          />

          <label htmlFor="price">
            DIÁRIA * <span>(em branco para gratuito)</span>
          </label>
          <Input id="price" name="price" placeholder="Valor cobrado por dia" />

          <button type="submit">Enviar</button>
        </Form>
      </Box>
    </>
  );
};
