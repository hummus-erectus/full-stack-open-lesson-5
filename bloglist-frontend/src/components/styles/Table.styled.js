import styled from 'styled-components'

export const Table = styled.div`
    tbody tr {
        cursor: pointer;
    }


    tbody tr:nth-child(odd) {
        background-color: #EFEAE6;
    }

    tbody tr:hover {
        background-color: #EEAF3A;
    }

    .username{
        font-weight: 600;
    }

    .blogsNum{
        text-align: center;
    }
`