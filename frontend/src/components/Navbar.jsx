import React, { useState } from 'react'
import { navbarStyles } from '../assets/dummyStyles'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'
import { navItems } from '../assets/Dummy';
import { FiUser } from 'react-icons/fi';


function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    const [scrolled, setScrolled] = useState(false);
    const [activeTab, setActiveTab] = useState(location.pathname);
    const [isOpen, setIsOpen] = useState(false);
    const [cartBounce , setCartBounce] = useState(false);
    
    const [isLoggedIn, setIsLoggedIn] = useState(
        Boolean(localStorage.getItem('authToken'))
    );
    // Define Logout Function
    const handleLogout = ()=>{
        localStorage.removeItem('authToken')
        localStorage.removeItem('userData')
        localStorage.clear()
        window.dispatchEvent(new Event('authStateChanged'))
        navigate('/')

    }

  return (
    <nav className={`${navbarStyles.nav}
     ${scrolled ? navbarStyles.scrolledNav : navbarStyles.unscrolledNav}`}>

        <div className={navbarStyles.borderGradient}/>

        <div className = {navbarStyles.particlesContainer}>
            <div
          className={`${navbarStyles.particle} w-24 h-24 bg-emerald-500/5 -top-12 left-1/4 ${navbarStyles.floatAnimation}`}
        />
        <div
          className={`${navbarStyles.particle} w-32 h-32 bg-green-500/5 -bottom-16 left-2/3 ${navbarStyles.floatSlowAnimation}`}
        />
        <div
          className={`${navbarStyles.particle} w-16 h-16 bg-teal-500/5 -top-8 left-3/4 ${navbarStyles.floatSlowerAnimation}`}
        />
        </div>

        {/* {LOGO} */}

        <div className={navbarStyles.container}>
            <div className={navbarStyles.innerContainer}>
                <Link to='/' className={navbarStyles.logoLink}>
                <img src={logo} alt="GroceryStore Logo"
                className={`${navbarStyles.logoImage} ${scrolled ? 'h-10 w-10' : 'h-12 w-12'}`}/>
                <span className={navbarStyles.logoText}>GroceryStore</span>
                </Link>

                {/* {DESKTOP NAVIGATION} */}
                <div className={navbarStyles.desktopNav}>
                    {navItems.map(item=>(
                        <Link key={item.name} to={item.path} 
                        className={`${navbarStyles.navItem}
                            ${activeTab === item.path ?
                         navbarStyles.activeNavItem 
                         : navbarStyles.inactiveNavItem}`}>
                            <div className='flex items-center'>
                                <span className={`${navbarStyles.navIcon}
                                    ${activeTab === item.path ? 
                                    navbarStyles.activeNavIcon 
                                    : navbarStyles.inactiveNavIcon}`}>
                                        {item.icon}
                                </span>
                                <span>{item.name}</span>
                            </div>
                            <div className={`${navbarStyles.navIndicator}
                                ${activeTab == item.path ? 
                            navbarStyles.activeIndicator : navbarStyles.inactiveIndicator}
                                `}/>

    
                         </Link>
                    ))}

                </div>

                {/* {MOBILE HAMBURGER} */}
                <div className={navbarStyles.iconsContainer}>
                   {
                    isLoggedIn ? (
                        <button onClick={handleLogout}
                        className={navbarStyles.loginLink}
                        aria-label='Logout'>
                            
                            <FiUser className={navbarStyles.loginIcon} />
                            <span className='ml-1 text-white'>Logout</span>
                        </button>
                    ) : (
                        <Link to='/login' className={navbarStyles.loginLink}>
                            <FiUser className={navbarStyles.loginIcon}/>
                            <span className='ml-1 text-white'>Login</span>
                        </Link>
                    )
                   }

                   <Link to='/cart' className={navbarStyles.cartLink}>
                   <FaCart className={`${navbarStyles.cartIcon} ${cartBounce ? 
                    'animate-bounce' : ''
                   }`}/>
                   
                   </Link>
                </div>
            </div>
        </div>
        
    </nav>
  )
}

export default Navbar