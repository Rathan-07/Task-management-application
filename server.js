
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { Schema, model, connect} = mongoose
const {checkSchema,validationResult,matchedData} = require('express-validator')
app.use(express.json())
const port = 3069
connect('mongodb://127.0.0.1:27017/task-app')
.then(()=>{
    console.log("connected to the database");
})
.catch((err)=>{
    console.log("error connecting to db",err);
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
const taskValidationSchema = {

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
        // custom:{
        //     options:function(value){
        //         return Task.findOne({title:value})
        //         .then((obj)=>{
        //             if(obj){
                       
        //                 throw new Error('title name is already exists')
        //         }
        //         return true
        //         })
            
        //     }
        // },
        // custom:{
        //     options:function(value,{req}){
        //         // const fieldValue = req.body.name;
        //         const fieldValue = matchedData(req)
            
        //         if(typeof fieldValue !== 'string'||!fieldValue.includes(' ')){
        //             throw new Error("Field should not contain  a space")
        //             // return res.status(400).json({error:"name field cannot have space"})
        //         }
        //         return  true
        //     }
        // }
        
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
        isIn:{
            options:[['pending','inProgress','completed']],
            errorMessage:'status should be one of (pending, inProgress,completed)'
        }

    }
}

// id validationSchema

const idValidationSchema = {
    id:{
        in:['params'],
        isMongoId:{
            errorMessage:"should be a valid mongodb id"
        }
    }
}
// Post Request

// Post Request
app.post('/tasks', checkSchema(taskValidationSchema), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let body = req.body;
    body.title = modifyTitle(body.title);

    // Check if the title is unique before creating the task
    Task.findOne({ title: body.title })
        .then(existingTask => {
            if (existingTask) {
                return res.status(400).json({ errors: [{ msg: 'Title name is already taken' }] });
            }

            // If the title is unique, proceed to create the task
            Task.create(body)
                .then(createdTask => {
                    res.status(201).json(createdTask);
                })
                .catch(err => {
                    res.status(500).json(err);
                });
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

function modifyTitle(value) {
    return value.trim().toUpperCase();
}


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

app.get('/tasks/:id',checkSchema(idValidationSchema),(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
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


app.put('/tasks/:id',checkSchema(updateTaskvalidationSchema),checkSchema(idValidationSchema),(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
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
app.delete('/tasks/:id',checkSchema(idValidationSchema),(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
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
app.listen(port,()=>{
    console.log("connected to the port_No",port);
})
