import { v4 as uuidv4 } from 'uuid';

let clientId = null;

export const getClientId = () => {
    if(clientId) {
        return clientId;
    }
    clientId = uuidv4();
    return clientId;
}