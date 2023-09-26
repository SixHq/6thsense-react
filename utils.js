import _ from 'lodash';
import {v4 as uuid4} from 'uuid';
import aesjs from 'aes-everywhere';


function parseWords(word){
    const added_word=":::bob_::_johan::sixer";
    const index = word.indexOf(added_word);
    const add = word.slice(index);
    const real = word.replace(add,"");
  
    if(add.includes("int")){
        return parseInt(real)
    }
  
    if(add.includes("float")){
        return parseFloat(real)
    }
  
    if(add.includes("str")){
        const converted= real
        return converted.toString();
    }
  
    if(add.includes("bool")){
        return !!real
    }
    
  }

  export function postOrderEncrypt(payload){
    const newSecretKey=uuid4().substring(0,16);
    console.log(newSecretKey,"secret")
    const secretKeyPartOne= newSecretKey.substring(0,4);
    const secretKeyPartTwo= newSecretKey.substring(4,8);
    const secretKeyPartThree= newSecretKey.substring(8,12);
    const secretKeyPartFour= newSecretKey.substring(12,16);
    
    var encryptedData = aesjs.encrypt(JSON.stringify(payload),newSecretKey);
    console.log(encryptedData,"data")
    const positions=[4,8,12,16];
    const keys=[secretKeyPartOne,secretKeyPartTwo,secretKeyPartThree,secretKeyPartFour];
    let counter=0;
    encryptedData=encryptedData.slice(0, positions[0]) + keys[0] + encryptedData.slice(positions[0],positions[1]) + keys[1] +encryptedData.slice(positions[1],positions[2]) + keys[2] + encryptedData.slice(positions[2],positions[3]) + keys[3]+ encryptedData.slice(positions[3]);
    return encryptedData;
  
  }



  export function postOrderDecrypt(encryptedPayload){
    var secretKey="";
    var newEncryptedPayload=encryptedPayload;
    secretKey=newEncryptedPayload.slice(4,8)+newEncryptedPayload.slice(12,16)+newEncryptedPayload.slice(20,24)+newEncryptedPayload.slice(28,32);
    newEncryptedPayload=newEncryptedPayload.slice(0,4)+newEncryptedPayload.slice(8,12)+newEncryptedPayload.slice(16,20)+newEncryptedPayload.slice(24,28)+newEncryptedPayload.slice(32)
    
    const decryptedPayload=aesjs.decrypt(newEncryptedPayload,secretKey);
    return JSON.parse(decryptedPayload);
  }