import React from 'react';
import PropTypes from 'prop-types';

import Logo from '~/assets/logo.svg';
import { Centralize } from './styles';

export default function Container({ children }) {
  return (
    <Centralize>
      <img src={Logo} alt="Aircnc" />
      {children}
    </Centralize>
  );
}

Container.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};
