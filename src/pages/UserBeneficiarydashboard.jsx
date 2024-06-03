import React from 'react';
import UserBase from '../components/user/UserBase';
import SideBar from '../components/sidebar/Sidebar';
import "./../css/user_beneficiary_dashboard.css";

function UserBeneficiarydashboard() {
    return (
        <UserBase>
            <div className="mt-5">
                <SideBar>
                    <div >
                        <div className='h-[100%] md:flex md:flex-row sm:flex sm:flex-row mt-3 max-w-[1600px]' >
                            <div className='h-[80vh] md:w-[70%] sm:w-[70%] bg-gray-200 mb-2 rounded-md p-3'>
                                <h1>Beneficiary Dashboard Table</h1>
                            </div>
                            <div className='h-[80vh] bg-gray-200 sm:w-[30%] sm:ml-2 rounded-md p-3'>
                                <h1>User Trustee List </h1>
                            </div>
                        </div>
                    </div>
                </SideBar>
            </div>
        </UserBase>
    );
}

export default UserBeneficiarydashboard;