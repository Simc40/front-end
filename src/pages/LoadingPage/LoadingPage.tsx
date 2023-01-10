import './LoadingPage.scss'
import Logo from '../../assets/imgs/logo.png';
import React from 'react'

export const LoadingPage = ({loading}: {loading?: boolean}) => {

    return(
        <div className="loader-container" style={{'display': (loading || loading === undefined) ? 'block' : 'none'}}>
            <div className="loader-content">
                <img src={Logo} className="loader-logo" alt=""/>
                <div id="loader" className="loader"></div>
            </div>
        </div>
    )
}

export default LoadingPage;