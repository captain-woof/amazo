import styled from 'styled-components'
import { motion } from 'framer-motion'
import Colors from "../../colors"
import { useEffect } from 'react'
import { useAnimation } from 'framer-motion'
import { easeOutCubicBezier } from '../../utils'
import { Link } from 'react-router-dom'

const HamburgerMenuContainer = styled(motion.div)`
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    background-color: ${Colors.greenPrimary};
    z-index: 3;
`

const MenuItemsContainer = styled(motion.div)`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 64px 16px 0px 16px;
`

const MenuItem = styled(motion.div)`
    width: 100%;
    font-family: 'oswald';
    color: ${Colors.offwhite};
    padding: 4px;
`

const menuItemVariants = {
    whileHover: {
        backgroundColor: Colors.greenDarkPrimary,
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


export default function HamburgerMenu({ isLoggedIn, isPhone, isMenuActivated, changeIsMenuActivated }) {

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
                <Link to={isLoggedIn ? "/dashboard" : "/"} style={{ textDecoration: "none" }}>
                    <MenuItem className="hamburger-menu-item" variants={menuItemVariants}
                        whileHover="whileHover" style={{ fontSize: (isPhone ? "24px" : "28px") }}
                        whileTap="whileTap" onClick={closeMenuOnItemClickHandler}>
                        {isLoggedIn ? "Dashboard" : "Home"}
                    </MenuItem>
                </Link>
                <Link to={isLoggedIn ? "/logout" : "/login_signup"} style={{ textDecoration: "none" }}>
                    <MenuItem className="hamburger-menu-item" variants={menuItemVariants}
                        whileHover="whileHover" style={{ fontSize: (isPhone ? "24px" : "28px") }}
                        whileTap="whileTap" onClick={closeMenuOnItemClickHandler}>
                        {isLoggedIn ? "Logout" : "Login/Signup"}
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