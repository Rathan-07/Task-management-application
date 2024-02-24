const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { Schema, model, connect} = mongoose
const {checkSchema,validationResult} = require('express-validator')
app.use(express.json())
const port = 3068
connect('mongodb://127.0.0.1:27017/task-app')
.then(()=>{
    console.log("connected to the db");
})
.catch((err)=>{
    console.log("error connecting to db",err);
})
app.listen(port,()=>{
    console.log("connected to the port_No",port);
})


// Task Schema

const taskSchema = new Schema({
    title:String,
    description:String,
    status:String
},{timestamps:true})
// Model for Task app

const Task = model('Task',taskSchema)

//TaskSchema Validation
const taskvalidationSchema = {

    title:{
        in:['body'],
        exists:{
            errorMessage:"title field is required"
        },
        notEmpty:{
            errorMessage:"title cannot be empty"
        },
        trim:true,
        isLength:{
            options:{min:5,max:25},
            errorMessage:"title should  have atleast min char "
        },
        custom:{
            options:function(value){
                return Task.findOne({title:value})
                .then((obj)=>{
                    if(obj){
                       
                        throw new Error('title name is already exists')
                }
                return true
                })
            
            }
        }
    },
    description:{
        in:['body'],
        exists:{
            errorMessage:"description field is required"
        },
        notEmpty:{
            errorMessage:"description cannot be empty"
        },
        trim:true,

    },
    status:{
        in:['body'],
        exists:{
            errorMessage:"status field is required"
        },
        notEmpty:{
            errorMessage:"status  cannot be empty"
        },
        trim:true,
        isLength:{
            options:{min:5,max:25},
            errorMessage:"title should  have atleast min char "
        },
        isIn:{
            options:[['pending','inProgress','completed']],
            errorMessage:'status should be one of (pending, inProgress,completed)'
        }

    }
}

// update taskvalidationSchema
const updateTaskvalidationSchema = {

    title:{
        in:['body'],
      
        notEmpty:{
            errorMessage:"title cannot be empty"
        },
        trim:true,
        isLength:{
            options:{min:5,max:25},
            errorMessage:"title should  have atleast min char "
        },
        custom:{
            options:function(value){
                return Task.findOne({title:value})
                .then((obj)=>{
                    if(obj){
                       
                        throw new Error('title name is already exists')
                }
                return true
                })
            
            }
        }
        
    },
    description:{
        in:['body'],
        notEmpty:{
            errorMessage:"description cannot be empty"
        },
        trim:true,

    },
    status:{
        in:['body'],
        notEmpty:{
            errorMessage:"status  cannot be empty"
        },
        trim:true,
        isLength:{
            options:{min:5,max:25},
            errorMessage:"title should  have atleast min char "
        },
        isIn:{
            options:[['pending','inProgress','completed']],
            errorMessage:'status should be one of (pending, inProgress,completed)'
        }

    }
}

// id validationSchema

const idvalidationSchema = {
    id:{
        in:['params'],
        isMongoId:{
            errorMessage:"should be a valid mongodb id"
        }
    }
}
// Post Request

app.post('/tasks',checkSchema(taskvalidationSchema),(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(404).json({errors:errors.array()})
    }
    const body = req.body
    Task.create(body)
    .then((tasks)=>{
        res.json(tasks)
    })
    .catch((err)=>{
      res.json(err)  
    })
})

// Get request -all tasks
app.get('/tasks',(req,res)=>{
    Task.find()
    .then((tasks)=>{
        res.json(tasks)
    })
    .catch((err)=>{
        res.json(err)
    })
})

// Get request -single tasks

app.get('/tasks/:id',checkSchema(idvalidationSchema),(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(404).json({errors:errors.array()})
    }
    const id = req.params.id
    Task.findById(id)
    .then((tasks)=>{
        if(!tasks){
            return res.status(404).json({})
        }
        res.json(tasks)
    })
    .catch((err)=>{
        res.json(err)
    })
})

//put request - update task

app.put('/tasks/:id',checkSchema(updateTaskvalidationSchema),checkSchema(idvalidationSchema),(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(404).json({errors:errors.array()})
    }
    const id = req.params.id
    const body = req.body
    Task.findByIdAndUpdate(id,body,{new:true})
    .then((tasks)=>{
        if(!tasks){
            return res.status(404).json({})
        }
        res.json(tasks)
    })
    .catch((err)=>{
        res.status(500).json({ error:'Internal server error'})
    })
})
// Delete request 
app.delete('/tasks/:id',checkSchema(idvalidationSchema),(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(404).json({errors:errors.array()})
    }
    const id = req.params.id
   
    Task.findByIdAndDelete(id)
    .then((tasks)=>{
        if(!tasks){
            return res.status(404).json({})
        }
        res.json(tasks)
    })
    .catch((err)=>{
        res.status(500).json({ error:'Internal server error'})
    })
})

