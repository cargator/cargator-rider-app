import customAxios from "./appservices";


export const suggestedPlaces = (text: string, location:any) => {
    return customAxios.post(
        `/get-address-from-autocomplete`,
        {text, location}
      );
}

export const getAddressFromCoords = (location: { latitude: any; longitude: any; }) => {
  console.log("location11111",location)
    return customAxios.post(
        `/get-address-from-coordinates`,
        location,
      );
}
export const getCoordsFromAddress = (address: string | undefined) =>{
    return customAxios.post(
        `/get-coordinates-from-address`,
        {address},
      );
}
export const DirectionsApi = (location1: any,location2: any) =>{
    return customAxios.post(`/get-directions`, {
        location1,
        location2,
      });
}