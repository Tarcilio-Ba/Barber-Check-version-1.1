import { createGlobalStyle } from "styled-components";

import "font-awesome/css/font-awesome.css";

createGlobalStyle`
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  
}
body, html {
  background: #eee;
  display: flexbox;
  font-family: 'Roboto', sans-serif;
  text-rendering: optimizeLegibility !important;
  -webkit-font-smoothing: antialiased !important;
  height: 100%;
  width: 100%;
}
`