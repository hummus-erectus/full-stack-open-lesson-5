import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`

    * {
        box-sizing: border-box;
    }

    body {
        color: hsl(192, 100%, 9%);
        font-family: 'Poppins', sans-serif;
        margin: 0;
    }

`

export default GlobalStyles