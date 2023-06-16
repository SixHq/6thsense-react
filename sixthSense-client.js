import { postOrderEncrypt,postOrderDecrypt, getFileFromFirebaseStorage } from "./utils";
import _ from 'lodash';

class sixthSenseClient{
    constructor(apiKey){
        this.apiKey=apiKey;
    }
    async encryptRequest(payload){
        const output= _.cloneDeep(payload);
        const resOutput= _.cloneDeep(payload);

        fetch('https://backend.withsix.co/get-user-public-key',{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ apiKey }),
          }).then((response)=>{
            getFileFromFirebaseStorage(response.data.public_key,this.apiKey).then((textFile)=>{
                const encryptedPayload=postOrderEncrypt(textFile,null,payload,output);
                return encryptedPayload;
                
            })
          })

       
    }

    async decryptResponse(payload){
        const output= _.cloneDeep(payload);
        const resOutput= _.cloneDeep(payload);

        fetch('https://backend.withsix.co/get-user-private-key',{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ apiKey }),
          }).then((response)=>{
            getFileFromFirebaseStorage(response.data.private_key,this.apiKey).then((textFile)=>{
                const decryptedPayload=postOrderDecrypt(textFile,null,payload,output);
                return decryptedPayload;
                
            })
          })
    }


}

export default sixthSenseClient;