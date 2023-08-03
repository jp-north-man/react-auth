import React from 'react';
import { Helmet } from 'react-helmet';
import { Header } from './Header';

const Layout = ({ children, title, description }) => {
    return (
        <>
            <Helmet>
                <title>{title}</title>
                <meta name='description' content={description}></meta>
            </Helmet>
               
            <Header/>   
            <main className='p-2'>{children}</main>
        </>
    
    );
};

export default Layout;