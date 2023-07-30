import React from 'react';
import { Helmet } from 'react-helmet';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children, title, description }) => {
    return (
        <>
            <Helmet>
                <title>{title}</title>
                <meta name='description' content={description}></meta>
            </Helmet>
            <div className='flex'>
                <Sidebar/>
                <div className='flex-grow'>
                    <Header/>   
                    <main className='p-2'>{children}</main>
                </div>
            
            </div>
            
        </>
    
    );
};

export default Layout;