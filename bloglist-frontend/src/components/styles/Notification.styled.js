import styled from 'styled-components'

export const StyledNotification = styled.div`
    background: lightgrey;
    font-size: 20px;
    border-style: solid;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
    color: ${({ type }) => (type === 'success' ? 'green' : 'red')};
`