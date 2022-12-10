const express=require('express');
const axios = require('axios')
require('dotenv').config()
const app=express();
app.set('view engine','ejs');
const sleep = require('util').promisify(setTimeout);
//app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.get('/',(req,res)=>{
   res.render('index',{opID:null});
})


app.post('/', (req,res)=>{
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
        console.log(JSON.parse(headers)["operation-location"])
        const opID=JSON.parse(headers)["apim-request-id"]
       // res.send(headers);
        res.render('index',{opID:opID})

    })
    .catch(err => {
        console.log(err)
        console.log(err.message)
        res.render('index',{opID:null})
    })
});



app.get('/:id',  async (req,res)=>{

      console.log(req.params.id);
      const getConfig={
             headers:{
                 'Ocp-Apim-Subscription-Key':process.env.apiKey,
             }
         }         
       const ans= await call_api(req.params.id);
       const readResults=ans.analyzeResult.readResults;
       const lines=[]
      // console.log(ans.analyzeResult.readResults[0])
      for (const page in readResults) {
        if (readResults.length > 1) {
          console.log(`==== Page: ${page}`);
        }
        const result = readResults[page];
        if (result.lines.length) {
          for (const line of result.lines) {
            console.log(line.words.map(w => w.text).join(' '));
            lines.push(line.words.map(w => w.text).join(' '));
        
          }
        }
        else { console.log('No recognized text.'); }
      }
       res.send(lines);
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
    console.log('initial status is'+result.status);
    while(result.status!='succeeded')
    {
        // console.log("in if");
        // resp= await  axios.get('https://eastus.api.cognitive.microsoft.com/vision/v3.2/read/analyzeResults/'+id,getConfig);
        // result=resp.data;
     //   await call_api(id);
    
    await sleep(2000);
    resp = await axios.get('https://eastus.api.cognitive.microsoft.com/vision/v3.2/read/analyzeResults/'+id,getConfig);
    // console.log(result.data.status)
    result=resp.data;
    console.log(result.status)
    }
        return result;
    }



app.listen(3000,()=>{
    console.log('app is connected to port',3000);
   });