import React from 'react';
import { useNavigate, Route, Routes, NavLink } from 'react-router-dom';
import ProfileCard from "./profile-card";
import OrderCard from "./order-card";
import { webRoutes } from '../../routes/web';
import { Outlet } from "react-router-dom"
import { useOutletContext } from "react-router-dom"


const Profile = () => {

    const navigate = useNavigate();

    const navigateToProfileCard = (id: string) => {
        navigate(`${id}`);
    };

    const navigateToOrderCard = () => {
        navigate(`order`);
    };

    return (
        <div>
            <NavLink to={"123"}>
                Go to Profile Card by link
            </NavLink>
            <button onClick={() => navigateToProfileCard('123')}>Go to Profile Card</button>
            <button onClick={navigateToOrderCard}>Go to Order Card</button>
            <div className='childrent'>
                <Outlet />
            </div>
        </div>
    );
};

export default Profile;
