import { postOrderEncrypt,postOrderDecrypt, getFileFromFirebaseStorage, getFileFromFirebaseStoragePub, getFileFromFirebaseStoragePri } from "./utils";
import _ from 'lodash';
import axios from "axios";

export default class sixthSenseClient{
    constructor(apiKey){
        this.apiKey=apiKey;
    }
    async encryptRequest(payload,axiosInstance){
      try{
        axiosInstance.interceptors.request.use(
          (request) => {
            // Modify the request body
        const apiKey=this.apiKey;
        const output= _.cloneDeep(request.data);
        const resOutput= _.cloneDeep(request.data);
  
        fetch('https://backend.withsix.co/encryption-service/get-user-public-key',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "apiKey":apiKey }),
          }).then((response)=>{
            response.json().then((response)=>{
              console.log(response.data)
                getFileFromFirebaseStoragePub(response.data.public_key,this.apiKey,request.data,output,request)
            })
          })
  
        
            return request;
          },
          (error) => {
            console.log('Request Interceptor - Error:', error);
            return Promise.reject(error);
          }
        );
         
      }catch(err){
        console.log('%c provided object not an axios instance ', 'color: red');
      }

      }

    async decryptResponse(payload){
        const apiKey=this.apiKey;
        const output= _.cloneDeep(payload);
        const resOutput= _.cloneDeep(payload);

        try{
          axiosInstance.interceptors.request.use(
            (res) => {
              // Modify the request body
              fetch('https://backend.withsix.co/encryption-service/get-user-private-key',{
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ apiKey }),
              }).then((response)=>{
                response.json().then((response)=>{
                    getFileFromFirebaseStoragePri(response.data.private_key,this.apiKey,res.data,output,res)
                    
                    
                })
              })
    
          
              return res;
            },
            (error) => {
              console.log('Response Interceptor - Error:', error);
              return Promise.reject(error);
            }
          );
           
        }catch(err){
          console.log('%c provided object not an axios instance ', 'color: red');
        }
    }


}

