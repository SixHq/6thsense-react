import { postOrderEncrypt,postOrderDecrypt } from "./utils";
import _ from 'lodash';
import axios from "axios";

export default class sixthSenseClient{
    constructor(apiKey){
        this.apiKey=apiKey;
    }
    async encryptRequest(axiosInstance){
      const apiKey=this.apiKey;
      try{
        axiosInstance.interceptors.request.use(
          (request) => {
            // Modify the request body
        if(request.data!=null){
          const output= _.cloneDeep(request.data);
          request.data=postOrderEncrypt(request.data);
        }
        return request;
        
          },(error) => {
            console.log('Request Interceptor - Error:', error);
            return Promise.reject(error);
          }
        );

      
    }catch(err){
      console.log('%c provided object not an axios instance ', 'color: red');
    }
  }

    async decryptResponse(axiosInstance){
        const apiKey=this.apiKey;

        try{
          axiosInstance.interceptors.request.use(
            (res) => {
              const apiKey=this.apiKey;
              if(res.data!=null){
                const output= _.cloneDeep(res.data);
                res.data=postOrderDecrypt(res.data);
              }
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

