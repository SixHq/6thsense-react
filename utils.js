import _ from 'lodash';
import {v4 as uuid4} from 'uuid';

const aesjs = require('aes-everywhere');

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
    const secretKeyPartOne= newSecretKey.substring(0,4);
    const secretKeyPartTwo= newSecretKey.substring(4,8);
    const secretKeyPartThree= newSecretKey.substring(8,12);
    const secretKeyPartFour= newSecretKey.substring(12,16);
    var encryptedData = aesjs.encrypt(payload,newSecretKey);
    const positions=[4,8,12,16];
    const keys=[secretKeyPartOne,secretKeyPartTwo,secretKeyPartThree,secretKeyPartFour];
    let counter=0;
    for(const position of positions){
      if (position >= 0 && position <= encryptedData.length) {
        encryptedData= encryptedData.slice(0, position) + keys[counter] + encryptedData.slice(position);
      }
      counter=counter+1;
    }
    return encryptedData;
  
  }



  export function postOrderDecrypt(encryptedPayload){
    const positions=[16,12,8,4];
    var secretKey="";
    const secretKeyParts=[];
    var newEncryptedPayload=encryptedPayload;
    for(const position of positions){
      secretKeyParts.push(newEncryptedPayload.substring(position,position+4));
      newEncryptedPayload=newEncryptedPayload.slice(0,position)+newEncryptedPayload.slice(position+4,newEncryptedPayload.length)
    }
    secretKeyParts.reverse();
    for (const part of secretKeyParts){
      secretKey=secretKey+part;
    }
    const decryptedPayload=aesjs.decrypt(newEncryptedPayload,secretKey);
    return decryptedPayload;
  }


