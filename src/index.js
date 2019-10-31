import React from 'react';
import ReactDOM from 'react-dom';

import '~/ReactotronConfig';
import Default from '~/components/pages';
import Style from '~/styles';
import Routes from '~/routes';

ReactDOM.render(
  <>
    <Style />
    <Default>
      <Routes />
    </Default>
  </>,
  document.getElementById('root')
);
