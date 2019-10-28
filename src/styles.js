import { createGlobalStyle } from 'styled-components';
import Background from '~/assets/background.jpg';

export default createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap');

  * {
    box-sizing: border-box;
    margin: 0px;
    padding: 0px;
    outline: 0px;
  }

  html, body, #root {
    min-height: 100%;
  }

  body {
    background-color: #000;
    background-image: url(${Background});
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    -webkit-font-smoothing: antialiased !important;
  }

  body, input, button {
    font-family: Roboto, Arial, Helvetica, sans-serif, Arial, Helvetica, sans-serif;
  }

  button {
    background-color: #f05a5b;
    border: 0px;
    border-radius: 2px;
    color: #fff;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    height: 42px;
    padding: 0px 20px;
    transition: all .25s;
    width: 100%;

    &:hover {
      background-color: #e14f50;
    }
  }
`;
