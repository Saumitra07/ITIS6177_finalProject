const express=require('express');
const axios = require('axios')
require('dotenv').config()
const app=express();
app.set('view engine','ejs');
const { body, validationResult } = require('express-validator');
const sleep = require('util').promisify(setTimeout);
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.get('/',(req,res)=>{
   res.render('index',{opID:null});
})

app.post('/', body('image').not().isEmpty(),(req,res,next)=>{
    const config={
        headers:{
            'Ocp-Apim-Subscription-Key':process.env.apiKey,
            'Content-Type':'application/json'
        }
    }
    data={'url':req.body.image}
    axios.post('https://eastus.api.cognitive.microsoft.com/vision/v3.2/read/analyze', data, config)
    .then(res1 => {
        
        const headers=JSON.stringify(res1.headers);
        const opID=JSON.parse(headers)["apim-request-id"]
        res.render('index',{opID:opID})

    })
    .catch(err => {
       const errorObj=err.response.data.error;
       errorObj.status=err.response.status
       next(errorObj);
    })
});



app.get('/:id',  async (req,res,next)=>{

      console.log(req.params.id);
  
       const lines=[]
        try{
       const ans= await call_api(req.params.id);
    
       const readResults=ans.analyzeResult.readResults;
      
      for (const page in readResults) {
        const result = readResults[page];
        if (result.lines.length) {
          for (const line of result.lines) {
            lines.push(line.words.map(w => w.text).join(' '));
          }
        }
        else { console.log('No recognized text.'); }
      }
      res.render('textAnalysis',{lines:lines})
    }
      catch(e){
        const errorObj=e.response.data.error;
        errorObj.status=e.response.status
        next(errorObj);
}

})

  async function call_api(id){
        const getConfig={
            headers:{
                'Ocp-Apim-Subscription-Key':process.env.apiKey,
            }
        }
        let resp=  await  axios.get('https://eastus.api.cognitive.microsoft.com/vision/v3.2/read/analyzeResults/'+id,getConfig);
        let result=resp.data;
        while(result.status!='succeeded')
        {
          await sleep(2000);
          resp = await axios.get('https://eastus.api.cognitive.microsoft.com/vision/v3.2/read/analyzeResults/'+id,getConfig);
          result=resp.data;
    
        }
        return result;
    }

app.use((err,req,res,next)=>{
        console.log("Error is"+JSON.stringify(err));
        if(err.status==400)
        {
          err.message='This image file may not be supported due to incorrect media format or size, please try with new image';
        }
        res.status(err.status);
        res.render('error',{error:err});
    })


app.listen(3000,()=>{
    console.log('app is connected to port',3000);
   });