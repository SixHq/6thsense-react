import { postOrderEncrypt,postOrderDecrypt } from "./utils";
import _ from 'lodash';
import axios from "axios";

export default class sixthSenseClient{
    constructor(apiKey){
        this.apiKey=apiKey;
    }
    encryptRequest(axiosInstance){
      const apiKey=this.apiKey;
      axiosInstance.interceptors.request.use(
        (request) => {
          // Modify the request body
      if(request.data!=null){
        const output= _.cloneDeep(request.data);
        request.data={"data":postOrderEncrypt(output)}
      }
      return request;
      
        },(error) => {
          console.log('Request Interceptor - Error:', error);
          return Promise.reject(error);
        }
      );

      axiosInstance.interceptors.request.use(
        (response) => {
          const apiKey=this.apiKey;
          if(response.status==420){
            return response
          }
          if(response.status&&response.data!=null){
            const output= _.cloneDeep(response.data);
            response.data={"data":postOrderDecrypt(output)}
          }
          return response;
        },
        (error) => {
          console.log('Response Interceptor - Error:', error);
          return Promise.reject(error);
        }
      );
  }

       


}

