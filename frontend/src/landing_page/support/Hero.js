import React from 'react';

function Hero() {
    return ( 
        <section className='container-fluid' id='supportHero'>
            <div className='p-5' id='supportWrapper'>
                <h4>Support Portal</h4>
                <a href=''>Tracks Tickets</a>
            </div>
            <div className='row p-3 m-3'>
                <div className='col-6 p-5'>
                    <h1 className='fs-3'>Search for an answer or browse help topics to create a ticket</h1>
                    <input placeholder='Eg. how do I activate F&O, why is my order getting rejected'/> <br/>
                    <a href=''>Track account opening</a>
                    <a href=''>Track segment activation</a>
                    <a href=''>Intraday margins</a>
                    <a href=''>Kite user manual</a>
                </div>
                <div className='col-6 p-5'>
                    <h1 className='fs-3'>Featured</h1>
                    <ol>
                        <li><a href=''>Quarterly Settlement of Funds - July 2025</a></li>
                        <li> <a href=''>Exclusion of F&O contracts on 8 securities from August 29, 2025</a></li>
                    </ol> 
                   
                </div>
            </div>
        </section>
     );
}

export default Hero;
