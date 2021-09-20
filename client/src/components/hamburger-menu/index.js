import styled from 'styled-components'
import { motion } from 'framer-motion'
import {secondary, black, primaryDark, offwhite} from "../../colors"
import { useEffect, useContext } from 'react'
import { useAnimation } from 'framer-motion'
import { easeOutCubicBezier } from '../../utils'
import { Link } from 'react-router-dom'
import UserContext from '../../contexts/userContext'
import IsPhoneContext from '../../contexts/isPhoneContext'

const HamburgerMenuContainer = styled(motion.div)
`
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    background-color: ${secondary};
    z-index: 3;
`

const MenuItemsContainer = styled(motion.div)
`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 64px 16px 0px 16px;
`

const MenuItem = styled(motion.div)
`
    width: 100%;
    font-family: 'oswald';
    color: ${black};
    padding: 4px;
`

const menuItemVariants = {
    whileHover: {
        backgroundColor: primaryDark,
        color: offwhite,
        transition: {
            duration: 0.8,
            ease: easeOutCubicBezier
        }
    },
    whileTap: {
        scale: 0.9,
        transition: {
            duration: 0.8,
            ease: easeOutCubicBezier
        }
    }
}

const menuItemContentContainer = {
    initial: {
        y: -100,
        opacity: 0
    },
    offToOn: {
        y: 0,
        opacity: 1,
        transition: {
            ease: easeOutCubicBezier,
            duration: 1
        }
    },
    onToOff: {
        y: -100,
        opacity: 0,
        transition: {
            ease: easeOutCubicBezier,
            duration: 1
        }
    }
}


export default function HamburgerMenu({ isMenuActivated, changeIsMenuActivated }) {

    // Different user contexts (logged in state) generates different items in the menu
    const { userContextState } = useContext(UserContext)

    // For isPhone context
    const isPhone = useContext(IsPhoneContext)

    const hamburgerMenuContainerVariants = {
        initial: {
            x: (isPhone ? 200 : 300)
        },
        offToOn: {
            x: 0,
            transition: {
                ease: easeOutCubicBezier,
                duration: 1
            }
        },
        onToOff: {
            x: (isPhone ? 200 : 300),
            transition: {
                ease: easeOutCubicBezier,
                duration: 1
            }
        }
    }

    const closeMenuOnItemClickHandler = () => {
        changeIsMenuActivated(false)
    }

    // Animation to open/close menu
    const menuAnimation = useAnimation()
    useEffect(() => {
        if (isMenuActivated) {
            menuAnimation.start("offToOn")
        } else {
            menuAnimation.start("onToOff")
        }
    }, [isMenuActivated, menuAnimation])

    return (
        <HamburgerMenuContainer id="hamburger-menu-container" animate={menuAnimation}
            variants={hamburgerMenuContainerVariants} initial="initial" style={{
                width: (isPhone ? "200px" : "300px")
            }}>
            <MenuItemsContainer id="menu-items-container" animate={menuAnimation}
                variants={menuItemContentContainer} initial="initial">
                <Link to={userContextState.isLoggedIn ? "/dashboard" : "/"} style={{ textDecoration: "none" }}>
                    <MenuItem className="hamburger-menu-item" variants={menuItemVariants}
                        whileHover="whileHover" style={{ fontSize: (isPhone ? "24px" : "28px") }}
                        whileTap="whileTap" onClick={closeMenuOnItemClickHandler}>
                        {userContextState.isLoggedIn ? "Dashboard" : "Home"}
                    </MenuItem>
                </Link>
                {userContextState.isLoggedIn &&
                    <Link to="/settings" style={{ textDecoration: "none" }}>
                    <MenuItem className="hamburger-menu-item" variants={menuItemVariants}
                        whileHover="whileHover" style={{ fontSize: (isPhone ? "24px" : "28px") }}
                        whileTap="whileTap" onClick={closeMenuOnItemClickHandler}>
                        Settings
                    </MenuItem>
                </Link>
            }                
                <Link to={userContextState.isLoggedIn ? "/logout" : "/login_signup"} style={{ textDecoration: "none" }}>
                    <MenuItem className="hamburger-menu-item" variants={menuItemVariants}
                        whileHover="whileHover" style={{ fontSize: (isPhone ? "24px" : "28px") }}
                        whileTap="whileTap" onClick={closeMenuOnItemClickHandler}>
                        {userContextState.isLoggedIn ? "Logout" : "Login/Signup"}
                    </MenuItem>
                </Link>
                <Link to="/know_more" style={{ textDecoration: "none" }}>
                    <MenuItem className="hamburger-menu-item" variants={menuItemVariants}
                        whileHover="whileHover" style={{ fontSize: (isPhone ? "24px" : "28px") }}
                        whileTap="whileTap" onClick={closeMenuOnItemClickHandler}>
                        Know More
                    </MenuItem>
                </Link>
                <Link to="/donate" style={{ textDecoration: "none" }}>
                    <MenuItem className="hamburger-menu-item" variants={menuItemVariants}
                        whileHover="whileHover" style={{ fontSize: (isPhone ? "24px" : "28px") }}
                        whileTap="whileTap" onClick={closeMenuOnItemClickHandler}>
                        Donate
                    </MenuItem>
                </Link>
                <Link to="/faq" style={{ textDecoration: "none" }}>
                    <MenuItem className="hamburger-menu-item" variants={menuItemVariants}
                        whileHover="whileHover" style={{ fontSize: (isPhone ? "24px" : "28px") }}
                        whileTap="whileTap" onClick={closeMenuOnItemClickHandler}>
                        FAQ
                    </MenuItem>
                </Link>
            </MenuItemsContainer>
        </HamburgerMenuContainer>
    )
}
