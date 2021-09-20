import styled from 'styled-components'
import { offwhite, primaryLight } from '../../colors'
import { useContext } from 'react'
import IsPhoneContext from '../../contexts/isPhoneContext'

const FooterContainer = styled.div`
    width: 100vw;
    height: ${({ isPhone }) => (isPhone ? "100px" : "120px")};
    background-color: ${primaryLight};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const CreditText = styled.div`
    color: ${offwhite};
    font-size: ${({ isPhone }) => (isPhone ? "14px" : "16px")};
    font-family: 'raleway';
    margin: ${({ isPhone }) => (isPhone ? "0px 24px" : null)};
    width: ${({isPhone}) => (isPhone ? "150px" : null)};
    text-align: center;
`

const Link = styled.a`
    font-weight: bold;
    color: ${offwhite};
`

export default function Footer({style}) {
    const isPhone = useContext(IsPhoneContext)

    return (
        <FooterContainer style={style} isPhone={isPhone} id="footer">
            <CreditText isPhone={isPhone}>
                Brown-Track is owned and run by <Link href="https://sohail-saha.in" target='_blank'>Sohail Saha</Link>.
            </CreditText>
        </FooterContainer>
    )
}