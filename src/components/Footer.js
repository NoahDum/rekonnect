import React from 'react';
import { RiCopyrightLine } from "react-icons/ri";

const Footer = () => {
    return (
        <div className='footer'>
            <div className="footer-contain">
                <h4>Developed by : <a href="https://www.linkedin.com/in/noah-duminil-85431a220/" target='_blank' rel='noreferrer'>Noah</a> - <a href="https://www.linkedin.com/in/stanislas-nakavua-4953b822a/" target='_blank' rel='noreferrer'>Stanislas</a>  - <a href="https://www.linkedin.com/in/samuel-cloqui%C3%A9-485b8a255/" target='_blank' rel='noreferrer'>Samuel</a></h4>
                <h4>Designed by <a href="https://www.linkedin.com/in/and%C3%A9lys-pluquin/" target='_blank' rel='noreferrer'>Andélys</a></h4>
                <div className="copyright">
                    <RiCopyrightLine color='#F0F3F4' size={23}/>
                    <h4>2023 Copyright - Rekonnect</h4>
                </div>
            </div>
        </div>
    )
}

export default Footer