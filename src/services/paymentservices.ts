import customAxios from "./appservices";

export const cancelPaymentOrder = (data: { id: string; })=>{
    return customAxios.post('/cancelOrder', data);
}

export const createPaymentOrder = (paymentData: { amount: number; mobileNumber: any; user_id: any; rideId: any; }) =>{
    return customAxios.post('/createOrder',paymentData )
}