import {io} from 'socket.io-client';
import Toast from 'react-native-toast-message';

let socket;
let socketDetails = {status: 'disconnected'};

function socketConnection(token) {
  return new Promise((resolve, reject) => {
    socket = io.connect(
      `https://cg-delta-mtepodzz4a-as.a.run.app?token=${token}`,
      // `https://63be-182-48-208-72.ngrok-free.app?token=${token}`,
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
