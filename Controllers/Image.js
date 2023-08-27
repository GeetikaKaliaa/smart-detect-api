// const Clarifai = require('clarifai');

// //You must add your own API key here from Clarifai. 
// const app = new Clarifai.App({
//  apiKey: 'YOUR API KEY HERE' 
// });


// const handleApiCall = (req, res) => {
 

//   app.models.predict('face-detection', req.body.input)
//     .then(data => {
//       res.json(data);
//     })
//     .catch(err => res.status(400).json('unable to work with API'))
// }
const handleImage = (postgresdb) => (req,res)=>{
    const {id} =req.body; //receiving from body
    postgresdb('users').where('id' ,'=', id)
    .increment('entries' ,1)
    .returning('entries')
    .then(entries=>{
        res.json(entries[0].entries)
    })
    .catch(err=>res.status(400).json('cannot get entries count'))
}

module.exports ={
   handleImage,
//    handleApiCall
}