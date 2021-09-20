import { useContext } from 'react/cjs/react.development'
import styled from 'styled-components'
import IsPhoneContext from '../../contexts/isPhoneContext'
import { offwhite } from '../../colors'

const BackgroundCreditsContainer = styled.div`
font-family: 'raleway';
font-size: 12px;
color: ${offwhite};
position: absolute;
bottom: ${({isPhone}) => (isPhone ? "24px" : "16px")};
width: max-content;
height: max-content;
`

const Link = styled.a`
    text-decoration: none;
    color: ${offwhite};
    font-weight: bold;
`

export default function BackgroundCredits() {
    const isPhone = useContext(IsPhoneContext)

    return (
        <BackgroundCreditsContainer isPhone={isPhone}>
            Photo by <Link href="https://www.pexels.com/@toniferreiraphotos?utm_content=attributionCopyText&utm_medium=referral&utm_source=pexels" target="_blank">Toni Ferreira</Link> from <Link href="https://www.pexels.com/photo/red-sky-3576683/?utm_content=attributionCopyText&utm_medium=referral&utm_source=pexels" target="_blank">Pexels</Link>
        </BackgroundCreditsContainer>
    )
}