import React from 'react';
import { ToastContainer } from 'react-toastify';

import Routes from '~/routes';
import Theme from '~/styles/theme';
import Container from '~/components/Container';

export default () => {
  return (
    <Container>
      <Theme />
      <ToastContainer />
      <Routes />
    </Container>
  );
};
