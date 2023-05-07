import styled from 'styled-components'

export const StyledBlogsList = styled.div`

    ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .blog:nth-child(odd) {
        background-color: #EFEAE6;
    }

    .blog:hover {
        background-color: #EEAF3A;
    }

    a {
        padding-top: 10px;
        padding-left: 2px;
        display: block;
        color: ${({ theme }) => theme.colors.primaryContent || '#000'};
        text-decoration: none;
    }

    .blogTitle {
        font-weight: 700;
    }
`