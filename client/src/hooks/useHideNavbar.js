// hooks/useHideNavbar.js
import { useLocation } from 'react-router-dom';

const useHideNavbar = () => {
    const location = useLocation();
    
    const hideNavbarPaths = [
        '/admin',      // All admin routes
        '/supplier'    // All supplier routes
    ];
    
    const shouldHideNavbar = hideNavbarPaths.some(path => 
        location.pathname.startsWith(path)
    );
    
    return shouldHideNavbar;
};

export default useHideNavbar;