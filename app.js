const express=require('express');
const axios = require('axios')
require('dotenv').config()
const app=express();
app.set('view engine','ejs');
const { body, validationResult } = require('express-validator');
const sleep = require('util').promisify(setTimeout);
//app.use(methodOverride('_method'))
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
       // console.log(JSON.parse(headers)["operation-location"])
        const opID=JSON.parse(headers)["apim-request-id"]
       // res.send(headers);
        res.render('index',{opID:opID})

    })
    .catch(err => {
      //  console.log(err)
        //console.log(err.message)
       // res.render('index',{opID:null})
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
        if (readResults.length > 1) {
         // console.log(`==== Page: ${page}`);
        }
        const result = readResults[page];
        if (result.lines.length) {
          for (const line of result.lines) {

            lines.push(line.words.map(w => w.text).join(' '));
        
          }
        }
        else { console.log('No recognized text.'); }
      }
   
   
      // res.send(lines);
      res.render('textAnalysis',{lines:lines})
    }
      catch(e){
        console.log(e.response.data.error)
        console.log(e.response.status);
        //res.send(e.status);
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
        console.log("in api call");
   let resp=  await  axios.get('https://eastus.api.cognitive.microsoft.com/vision/v3.2/read/analyzeResults/'+id,getConfig);
    let result=resp.data;
    while(result.status!='succeeded')
    {
        // console.log("in if");
        // resp= await  axios.get('https://eastus.api.cognitive.microsoft.com/vision/v3.2/read/analyzeResults/'+id,getConfig);
        // result=resp.data;
     //   await call_api(id);
    
    await sleep(2000);
    resp = await axios.get('https://eastus.api.cognitive.microsoft.com/vision/v3.2/read/analyzeResults/'+id,getConfig);
    result=resp.data;
 
    }
        return result;
    }

    app.use((err,req,res,next)=>{
        // err.status=err.status;
        // err.message=err.message
        console.log("Error is"+JSON.stringify(err));
        if(err.status==400)
        {
          err.message='This image file may not be supported due to incorrect media format or size, please try with new image';
        }
        // else if(err.status==404)
        // {
        //   err.message='This URL can not be located, please verify the id'
        // }
        res.status(err.status);
        res.render('error',{error:err});
    })


app.listen(3000,()=>{
    console.log('app is connected to port',3000);
   });