import React from 'react';

function Footer() {
    return ( 
        <footer style={{backgroundColor:"rgb(250,250,250)"}}>
        <div className='container border-top mt-5' >
            <div className='row mt-5'>
                <div className='col'>
                    <img src='media/images/logo.svg' alt='Logo' style={{width:"50%"}}/>
                    <p> &copy; 2010 - 2025, Zerodha Broking Ltd.All rights reserved.</p>
                </div>
                <div className='col'>
                    <p>Company</p>
                    <a href='' className="text-muted" style={{textDecoration:"none"}}>About</a>
                    <br></br>
                    <a href='' className="text-muted" style={{textDecoration:"none"}}>Products</a>
                    <br></br>
                    <a href='' className="text-muted" style={{textDecoration:"none"}}> Pricing</a>
                    <br></br>
                    <a href='' className="text-muted" style={{textDecoration:"none"}}>Refreal programme</a>
                    <br></br>
                    <a href='' className="text-muted" style={{textDecoration:"none"}}>Careers</a>
                    <br></br>
                    <a href='' className="text-muted" style={{textDecoration:"none"}}>Zerodha.tech</a>
                    <br></br>
                    <a href='' className="text-muted" style={{textDecoration:"none"}}>Press and media</a>
                    <br></br>
                    <a href='' className="text-muted" style={{textDecoration:"none"}}>Zerodha cares (CSR)</a>
                    <br></br>
                </div>
                <div className='col'>
                    <p>Support</p>
                    <a href='' className="text-muted" style={{textDecoration:"none"}}>Contact</a>
                    <br/>
                    <a href='' className="text-muted" style={{textDecoration:"none"}}>Support portal</a>
                    <br/>
                    <a href='' className="text-muted" style={{textDecoration:"none"}}>Z-Connect blog</a>
                    <br/>
                    <a href='' className="text-muted" style={{textDecoration:"none"}}>List of charges</a>
                    <br/>
                    <a href='' className="text-muted" style={{textDecoration:"none"}}>Downloads & resources</a>
                    <br/>
                </div>
                <div className='col'>
                    <p>Account</p>
                    <a href='' className="text-muted" style={{textDecoration:"none"}}>Open an account</a>
                    <br/>
                    <a href='' className="text-muted" style={{textDecoration:"none"}}>Fund transfer</a>
                    <br/>
                    <a href='' className="text-muted" style={{textDecoration:"none"}}>60 day challenge</a>
                    <br/>
                </div>
            </div>
            <div className='mt-5 text-muted' style={{fontSize:"14px"}}>
                <p>Zerodha Broking Ltd.: Member of NSE, BSE​ &​ MCX – SEBI Registration no.: INZ000031633 CDSL/NSDL: Depository services through Zerodha Broking Ltd. – SEBI Registration no.: IN-DP-431-2019 Commodity Trading through Zerodha Commodities Pvt. Ltd. MCX: 46025; NSE-50001 – SEBI Registration no.: INZ000038238 Registered Address: Zerodha Broking Ltd., #153/154, 4th Cross, Dollars Colony, Opp. Clarence Public School, J.P Nagar 4th Phase, Bengaluru - 560078, Karnataka, India. For any complaints pertaining to securities broking please write to complaints@zerodha.com, for DP related to dp@zerodha.com. Please ensure you carefully read the Risk Disclosure Document as prescribed by SEBI | ICF</p>

                <p>Procedure to file a complaint on SEBI SCORES: Register on SCORES portal. Mandatory details for filing complaints on SCORES: Name, PAN, Address, Mobile Number, E-mail ID. Benefits: Effective Communication, Speedy redressal of the grievances</p>

                <p>Smart Online Dispute Resolution | Grievances Redressal Mechanism<br/>
                    
                Investments in securities market are subject to market risks; read all the related documents carefully before investing.</p>

                <p>Attention investors: 1) Stock brokers can accept securities as margins from clients only by way of pledge in the depository system w.e.f September 01, 2020. 2) Update your e-mail and phone number with your stock broker / depository participant and receive OTP directly from depository on your e-mail and/or mobile number to create pledge. 3) Check your securities / MF / bonds in the consolidated account statement issued by NSDL/CDSL every month.</p>

                <p>"Prevent unauthorised transactions in your account. Update your mobile numbers/email IDs with your stock brokers. Receive information of your transactions directly from Exchange on your mobile/email at the end of the day. Issued in the interest of investors. KYC is one time exercise while dealing in securities markets - once KYC is done through a SEBI registered intermediary (broker, DP, Mutual Fund etc.), you need not undergo the same process again when you approach another intermediary." Dear Investor, if you are subscribing to an IPO, there is no need to issue a cheque. Please write the Bank account number and sign the IPO application form to authorize your bank to make payment in case of allotment. In case of non allotment the funds will remain in your bank account. As a business we don't give stock tips, and have not authorized anyone to trade on behalf of others. If you find anyone claiming to be part of Zerodha and offering such services, please create a ticket here.</p>
            </div>

            <div className='row'>
                <div className='col-1 px-5' ><a href=''style={{textDecoration:"none",color:"gray"}}>NSE</a></div>
                <div className='col-1 px-5'><a href=''style={{textDecoration:"none",color:"gray"}}>BSE</a></div>
                <div className='col-1 px-5'><a href=''style={{textDecoration:"none",color:"gray"}}>MCX</a></div>
                <div className='col-1 px-5'><a href=''style={{textDecoration:"none",color:"gray"}}>Terms & conditions</a></div>
                <div className='col-1 px-5'><a href=''style={{textDecoration:"none",color:"gray"}}>policies & procedures</a></div>
                <div className='col-1 px-5'><a href=''style={{textDecoration:"none",color:"gray"}}>Privacy policy</a></div>
                <div className='col-1 px-5'><a href=''style={{textDecoration:"none",color:"gray"}}>Disclosure</a></div>
                <div className='col-1 px-5'><a href=''style={{textDecoration:"none",color:"gray"}}>For inestors's attention</a></div>
                <div className='col-1 px-5'><a href=''style={{textDecoration:"none",color:"gray"}}>Investor charter</a></div>
            </div>
        </div>
        </footer>
     );
}

export default Footer;
