const handleProfileGet = (postgresdb) =>(req,res)=>{
    const {id} =req.params;  //receiving from paramenter i.e from url
    
    postgresdb.select('*').from('users').where({id})
    .then(user =>{
        if(user.length){
            res.json(user[0])
        }else{
            res.status(400).json('no such user exist')
        }
    })
    .catch(err=>res.status(400).json('error getting user'))
  }
  module.exports ={
    handleProfileGet
  }