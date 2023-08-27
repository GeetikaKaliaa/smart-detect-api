const express = require("express");
// const bodyParser = require("body-parser");
const cors =require('cors');
const bcrypt = require('bcrypt');
const knex = require("knex");

const signIn = require("./Controllers/Signin");
const register = require("./Controllers/Register");
const image = require("./Controllers/Image");
const profile = require("./Controllers/Profile");

const app = express();
// app.use(bodyParser.json());
app.use(express.json());
app.use(cors());


//sync method of bcrypt
const saltRounds = 10;
//connected server to database by using knex 
const postgresdb = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
    //   port : 5432, // add your port number of db here
      user : 'postgres',
      password : 'geetika1',
      database : 'smartdetect'
    }
  });



app.get('/',(req,res)=>{res.send(postgresdb.users);})
app.post('/signin', signIn.handleSignIn(postgresdb,bcrypt ));
app.post('/register', register.handleRegister(postgresdb,bcrypt ));
app.put('/image', image.handleImage(postgresdb));
app.get('/profile/:id', profile.handleProfileGet(postgresdb));
/*
app.post('/signin',(req, res)=>{
   postgresdb.select('email','hash').from('login')
   .where('email','=',req.body.email)
   .then(data=>{
    const isValid= bcrypt.compareSync(req.body.password, data[0].hash);
    
    if(isValid) {
       return  postgresdb.select('*').from('users')
        .where('email','=',req.body.email)
        .then(user =>{
            res.json(user[0])
        })
        .catch(err=>res.status(400).json('unable to login'))
    }  else {
        res.status(400).json('wrong credentials')
      }
})
.catch(err=>res.status(400).json('wrong credentials'))
        

})

app.post('/register',(req,res)=>{
    const {email,name,password}=req.body;
    // const hash = bcrypt.hashSync(password, saltRounds);
    const salt = bcrypt.genSaltSync(saltRounds);
const hash = bcrypt.hashSync(password, salt);
     postgresdb.transaction(trx=>{
        trx.insert({
            hash:hash,
            email:email,
        })
        .into('login')
        .returning('email')
        .then(loginEmail =>{
            return  trx('users')
                .returning('*')
                .insert({
                email: loginEmail[0].email,
                name: name,
                joined:  new Date()
                
                }).then(user =>{
            
                    res.json(user[0]);
                })
        })
        .then(trx.commit)
        .catch(trx.rollback)
     })
   .catch(err => res.status(400).json('unable to join'))
})

app.get('/profile/:id',(req,res)=>{
    const {id} =req.params;  //receiving from paramenter i.e from url
    postgresdb.select('*').from('users').where({id:id})
    .then(user =>{
        if(user.length){
            res.json(user[0])
        }else{
            res.status(400).json('no such user exist')
        }
    })
    .catch(err=>res.status(400).json('error getting user'))
  })

app.put('/image',(req,res)=>{
    const {id} =req.body; //receiving from body
    postgresdb('users').where('id' ,'=', id)
    .increment('entries' ,1)
    .returning('entries')
    .then(entries=>{
        res.json(entries[0].entries)
    })
    .catch(err=>res.status(400).json('cannot get entries count'))
})
*/
app.listen(3000,()=>{
    console.log("run at 3000");
});