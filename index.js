import fetch from 'cross-fetch';
import express from 'express';
import bodyParser from 'body-parser';
import Resize from './resize.js';
import path from 'path';
import fileUpload from 'express-fileupload';
import fs from 'fs';

/** IPFS */
import * as IPFS from 'ipfs-core'

import cors from 'cors';
const corsOptions ={
   origin:'*',
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

/** Launch express */
const app = express();
app.use(cors(corsOptions)) // Use this after the variable declaration
app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 },
}));


var jsonParser = bodyParser.json()
const PORT = 3004;

/** Initiate IPFS client */
let IPFS_URL = "http://192.81.215.106:5001/api/v0";
let IPFS_GATEWAY = "https://ipfsgateway.orbis.club/ipfs/";
//const ipfsClient = create({ host: 'localhost', port: 5001, protocol: 'http'});
//const ipfsClient = IPFS.create();
let ipfsClient;

/** Init IPFS client */
async function init() {
  ipfsClient = await IPFS.create();
  console.log("IPFS Initiated.");
}
init();


app.listen(process.env.PORT || PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    else
        console.log("Error occurred, server can't start", error);
    }
);

/** Hello API */
app.get('/', async (req, res) => {
  res.json({
    status: 200,
    result: "Hello world!"
  });
});

/** Healthcheck endpoint */
app.get('/healthcheck', async (req, res) => {
  res.json({
    status: 200,
    result: "Alive!"
  });
});

/** Uploads an image to IPFS */
app.post('/upload-image', async function (req, res) {
  if(!req.files) {
    res.status(401).json({error: 'Please provide an image'});
  }

  /** Upload image to IPFS */
  try {
    const file = new Buffer(req.files.image.data);
    //let added = await ipfsClient.add(file);
    const { cid } = await ipfsClient.add(file)

    /** Return results */
    res.json({
      status: 200,
      result: {
        url: "ipfs://" + cid,
        gateway: IPFS_GATEWAY
      }
    });
  } catch(e) {
    console.log("Error uploading file to IPFS:", e);
    /** Return results */
    res.json({
      status: 300,
      error: e
    });
  }
});
