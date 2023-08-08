const express = require('express');
const bodyParser = require('body-parser');
const cors = require ('cors')
const { projectManagerRouter } = require('./routes/projectRoutes');
const { usersRouter } = require('./routes/usersRouter');
const { welcomeAboard } = require('./EmailService/newUser');
const cron = require('node-cron');


const app = express();

app.use(bodyParser.urlencoded({extended: true }))
app.use(express.json())
app.use(cors())
app.use('/projects', projectManagerRouter) 
app.use('/users',usersRouter)

app.use((err,req,res,next)=>{
    res.json({Error: err})
})

//node-mailer cron job here
cron.schedule("*/5 * * * * *", async () => {
  //runs every 5 seconds

  console.log("running a task every 5 seconds");
  await welcomeAboard();
  console.log("called welcomeAboard");
}); 


app.listen(4500,()=>{
    console.log('server running on port 4500')
})