import * as styled from 'styled-components';

export default styled.createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        outline: 0;
        box-sizing: border-box;
    }

    *::-webkit-scrollbar {
        background: rgba(0, 0, 0, 0);
        width: 6px;
    }

    *::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.2);

        :hover {
            background: rgba(0, 0, 0, 0.3);
        }
    }

    body {
        background: #f0f2f5;
        -webkit-font-smoothing: antialiased;
    }

    body,
    input,
    button {
        font: 16px 'Poppins', sans-serif;
    }

    button {
        cursor: pointer;
    }
`;
