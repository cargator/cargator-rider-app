import customAxios from '../services/appservices';

export const login = (loginData: { mobileNumber: any; type: string; }) =>{
    return customAxios.post('/login', loginData);
}

export const addProfileDetails = async (userId: any,values: any) => {
    return customAxios.post('/add-profile-details', { userId, values });
}
export const getUtils = () =>{
    return customAxios.get('/debounceTimeApi');
}
export const verifyOtp = (data: { otp: any; type: string; mobileNumber: any; }) =>{
    return customAxios.post('/verifyOtp',data);
}
export const getUserInfo =async (userId: any) => {
    return customAxios.get(`/getRiderById/${userId}`);
}

export const getcountryCodeAPI = () =>{
    return customAxios.get('/getCountryCodeMobile');
} 
