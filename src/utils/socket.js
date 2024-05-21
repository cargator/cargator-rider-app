import {io} from 'socket.io-client';
import Toast from 'react-native-toast-message';

let socket;
let socketDetails = {status: 'disconnected'};

function socketConnection(token) {
  return new Promise((resolve, reject) => {
    socket = io.connect(
      `https://api-delta.cargator.org/?token=${token}`,
      // `http://192.168.1.57:3001?token=${token}`,
      {transports: ['websocket']},
    );

    socket.on('connect', () => {
      socketDetails.status = 'connected';
      resolve(socket);
    });

    socket.on('disconnect', () => {
      socketDetails.status = 'disconnected';
    });

    socket.on('connect_error', error => {
      //? disconneting socket if the socket is trying to reconnect after connection error
      socket.disconnect();
      reject('Error in Socket Connection');
    });
  });
}

export async function getSocketInstance(token) {
  if (socket && socket.connected) {
    return socket;
  } else {
    return await socketConnection(token);
  }
}

export async function socketDisconnect() {
  if (socket && socket.connected) {
    await socket.disconnect();
  }
}
