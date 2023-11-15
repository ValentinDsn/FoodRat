import {useEffect,useState} from 'react';
import {useLocation} from "react-router-dom";

const MayRenderNavbar = ({children} : any) => {
    const location = useLocation();
    const [render,setRender] = useState(false);

    useEffect(() => {
        if(location.pathname === "/login" || location.pathname === "/register"){
            setRender(false);
        }else{
            setRender(true);
        }
    },[location])

    return (<div>{render && children}</div>)
}

export default MayRenderNavbar;