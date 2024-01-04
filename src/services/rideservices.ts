import customAxios from '../services/appservices';

export const cancelRide = (rideId: { rideId: any; }) => {
    return customAxios.post('/cancel-scheduled-ride', rideId);
}

export const getScheduledRides = (userId: any) => {
    return customAxios.get(`/get-all-scheduled-rides/${userId}`);
}

export const getRideFare = (data: { distance: string; }) => {
    return customAxios.post('/get-fare', data)
}
export const DriverInfo = (driverId: any) => {
    return customAxios.get(
        `/getDriverById/${driverId}`,
    );
}
export const getAllRides = (userId: any) => {
    return customAxios.post(`/getRideHistory/${userId}`, {
        type: 'rider',
    });
}