import { JSEncrypt } from "jsencrypt";
import _ from 'lodash';

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

export const postOrderEncrypt=async(publicKey,key,data,copyText,listKey=null)=>{
    if (Array.isArray(data)){
        const newList=[];
        data.forEach((element)=>{
            if(typeof element==="object"){
                const newDeepCopy = _.cloneDeep(element);
                postOrderEncrypt(publicKey,null,element,newDeepCopy);
                newList.push(newDeepCopy);
            }else{
                newList.push(encryptWithRSA(publicKey,element.toString()+":::bob_::_johan::sixer"+typeof element));
            }
        })
  
        if(Array.isArray(copyText)){
            copyText.splice(0,copyText.length);
            copyText.push(...newList)
            return
        }
  
        if(typeof copyText==="object"){
            delete copyText[listKey];
            copyText[listKey]=newList;
        }
    }
  
    if(typeof data!=="object"){
        copyText[encryptWithRSA(publicKey,key)]=encryptWithRSA(publicKey,data.toString+":::bob_::_johan::sixer"+typeof data)
    }
  
    if(typeof data==="object"){
        for(const key in data){
            const encrypted=encryptWithRSA(publicKey,key)
            copyText[encrypted]=copyText[key]
            delete copyText[key]
            if(typeof copyText[encrypted] !=="object" && !Array.isArray(copyText)){
                copyText[encrypted] = encryptWithRSA(publicKey, copyText[encrypted].toString()+":::bob_::_johan::sixer"+typeof copyText[encrypted])
            } else if(Array.isArray(copyText)){
                postOrderEncrypt(publicKey,key,data[key],copyText,encrypted)
            } else{
                postOrderEncrypt(publicKey,key,data[key],copyText[encrypted])
            }
        }
    }
  
  
};

export const postOrderDecrypt=async(privateKey,key,data,copyText,listKey=null)=>{
    if (Array.isArray(data)){
      const newList=[];
      data.forEach((element)=>{
          if(typeof element==="object"){
              const newDeepCopy = _.cloneDeep(element);
              postOrderDecrypt(privateKey,null,element,newDeepCopy);
              newList.push(newDeepCopy);
          }
          else if (Array.isArray(element)){
            postOrderDecrypt(privateKey,key,element,copyText, listKey);
          }
          else{
              newList.push(parseWords(decryptWithRSA(privateKey,element.toString()+":::bob_::_johan::sixer"+typeof element)));
          }
      })

      if(Array.isArray(copyText)){
          copyText.splice(0,copyText.length);
          copyText.push(...newList)
          return
      }

      if(typeof copyText==="object"){
          delete copyText[listKey];
          copyText[listKey]=newList;
      }
  }

  if(typeof data!=="object"){
      copyText[decryptWithRSA(privateKey,key)]= parseWords(decryptWithRSA(privateKey,data.toString+":::bob_::_johan::sixer"+typeof data))
  }

  if(typeof data==="object"){
      for(const key in data){
          const encrypted=decryptWithRSA(privateKey,key)
          copyText[encrypted]=copyText[key]
          delete copyText[key]
          if(typeof copyText[encrypted] ==="string" || Number.isInteger(copyText) || isFloat(copyText)){
            try{
              copyText[encrypted] = parseWords(decryptWithRSA(privateKey, copyText[encrypted].toString()+":::bob_::_johan::sixer"+typeof copyText[encrypted]))
            }catch{
              copyText[encrypted] = copyText[encrypted].toString()
            }
          } else if(Array.isArray(copyText)){
              postOrderDecrypt(privateKey,key,data[key],copyText,encrypted)
          } else{
              postOrderDecrypt(privateKey,key,data[key],copyText[encrypted])
          }
      }
  }
};

const encryptWithRSA=(publicKey,data)=>{
    const encrypt=new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    return encrypt.encrypt(btoa(data));
};

const decryptWithRSA=(privateKey,data)=>{
    const decrypt=new JSEncrypt();
    decrypt.setPrivateKey(privateKey);
    return decrypt.decrypt(atob(data));
};

export const getFileFromFirebaseStorage=async(fileUrl,apiKey)=>{
    const response = await fetch(fileUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      }).then((response)=>{
        response.text()
      });
      return response;
};