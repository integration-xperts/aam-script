/* import axios from 'axios'
import https from 'https'

const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
})

let authToken: any;
let authKey: any;
let systemTime: any;

const loginCode = async () => {

}

const Login = async () => {

  return await instance.post('https://203.176.190.21:8002/mobileService/login/loginScreen/loginUser',{
    brandName:"atlas",
    userName:"huda.feroz@integrationxperts.com",
    password:"Issues12"
    })
}

Login(); */

import express from 'express';
import axios from 'axios'
import https from 'https'
import cryptoJS, { enc } from 'crypto-js'
import crypto from 'crypto'
import { emit } from 'process';

const app = express();
const port = 3000;
const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
})

app.get('/getFoliosWithoutAll', async (req, res) => {
  try {
    let apiName = 'getFoliosWithoutAll'
    const headerInfoResult = await getHeaderInfo()
    const {authKey,authToken, ServerTime} = headerInfoResult

    let sessionKey = await encryptSampleCheck(authKey,authToken,ServerTime,apiName)

    const headers = {
      'Content-Type': 'application/json',
      "sessionKey": sessionKey,
      key: authKey
    }

    let getFoliosResult = await instance.post('https://203.176.190.21:8002/mobileService/dashboard/getFoliosWithoutAll', {
      authToken
    }, {headers: headers})

    
    res.send(getFoliosResult.data)
  } catch (error) {
    console.log(error);

  }
})

app.get('/getFolios', async (req, res) => {
  try {
    let apiName = 'getFolios'

    const headerInfoResult = await getHeaderInfo()
    const {authKey,authToken, ServerTime} = headerInfoResult

    let sessionKey = await encryptSampleCheck(authKey,authToken,ServerTime,apiName)
    console.log(headerInfoResult);
    
    const headers = {
      'Content-Type': 'application/json',
      sessionKey,
      key: authKey
    }

    let getFoliosResult = await instance.post('https://203.176.190.21:8002/mobileService/accountStatement/getFolios', {
      authToken
    }, {headers: headers})
    
    res.send(getFoliosResult.data)
  } catch (error) {
    console.log(error);
  }
})

app.get('/getFolios', async (req, res) => {
  try {
    let apiName = 'getFolios'

    const headerInfoResult = await getHeaderInfo()
    const {authKey,authToken, ServerTime} = headerInfoResult

    let sessionKey = await encryptSampleCheck(authKey,authToken,ServerTime,apiName)
    console.log(headerInfoResult);
    
    const headers = {
      'Content-Type': 'application/json',
      sessionKey,
      key: authKey
    }

    let getFoliosResult = await instance.post('https://203.176.190.21:8002/mobileService/accountStatement/getFolios', {
      authToken
    }, {headers: headers})
    
    res.send(getFoliosResult.data)
  } catch (error) {
    console.log(error);
  }
})

app.get('/testingAlgo', async(req,res) => {

  try {
    let result = await encryptSampleCheck('f67dfc78-f2ea-4a0b-803f-6d3c066a04e7','eb114862-dd42-4b0b-8837-49b79bb90569','1624253435790','getFolios');
    // let resul2 = await decrypt3DES(result,'')
    res.send({result})   
  } catch (error) {
    console.log(error);
  }
})

app.get('/', async (req, res) => {
  try {
    let loginCodeResult = await instance.post('https://203.176.190.21:8002/mobileService/login/loginScreen/loginUser', {
      brandName: "atlas",
      userName: "huda.feroz@integrationxperts.com",
      password: "Issues12"
    })
    res.send(loginCodeResult)
  } catch (error) {
    console.error(error)
  }
});
app.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});

const getHeaderInfo = async () => {
  try {
    let loginCodeResult = await instance.post('https://203.176.190.21:8002/mobileService/login/loginScreen/loginCode', {
      loginCode: "9CRTFR"
    })

    let { authKey, authToken } = loginCodeResult.data

    let systemTimeResult = await instance.post('https://203.176.190.21:8002/mobileService/SystemTime/getSystemTime', {
      authToken
    })

    let { ServerTime } = systemTimeResult.data

    return {authKey, authToken, ServerTime}
  } catch (error) {
    return error
  }
}


const encryptSampleCheck = async (authKey, authToken, systemTime, apiName) => {
  authKey = authKey.slice(0,24)
  const platform='android';
  const text = `${authToken}|${platform}|${apiName}|${systemTime}`
  console.log(text);
  console.log(authKey);
  
  let cipher = crypto.createCipheriv('des-ede3', authKey, null);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  console.log(encrypted);
  
  return encrypted;
}