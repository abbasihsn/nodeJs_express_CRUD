const Joi = require('joi');
const express = require('express');


const courses = [
    {
        id:1,
        name: "course 1"
    },
    {
        id:2,
        name: "course 2"
    },
    {
        id:3,
        name: "course 3"
    },
]


const app = express();
app.use(express.json());

app.get('/',(request, response)=>{
    response.send(courses);
})

app.get('/api/courses', (req, res)=>{ 
    res.send(courses)
})

app.get('/api/courses/:id', (req, res)=>{ 
    const course = courses.find((c=>c.id==req.params.id))
    if(course){
        res.send(course)
    } else {
        res.status(404); // 404 nout found
        res.send("not found ")
    }
})

app.get('/api/posts/:year/:month', (req, res)=>{ 
    // res.send(req.params);
    res.send(req.query);
})


app.post('/api/courses',(req, res)=>{
    const {error} = validateCourse(req.body);
        if(error){ 
            res.status(400); // 400 bad request
            res.send(error.details[0].message)        
        } else {
        const course = {
            id: courses.length + 1,
            name: req.body.name
        }
        courses.push(course);
        res.send(course);
    }
})

app.put('/api/courses/:id', (req, res)=>{
    const course = courses.find((c=>c.id==req.params.id))
    if(course){
        const {error} = validateCourse(req.body);
        if(error){ 
            res.status(400); // 400 bad request
            res.send(error.details[0].message)        
        } else {
            course.name = req.body.name;
            res.send(course);
        }
    } else {
        res.status(404); // 404 nout found
        res.send("not found ")
    }
})


app.delete('/api/courses/:id', (req, res)=>{
    const course = courses.find((c=>c.id==req.params.id))
    if(course){
        const idx = courses.indexOf(course);
        courses.splice(idx, 1);
        res.send(course)
    } else {
        res.status(404); // 404 nout found
        res.send("not found ")
    }
})

const port = process.env.PORT || 3000;
app.listen(port, ()=>console.log(`listening to the port ${port}`));


function validateCourse(course){
    const schema = {
        name:Joi.string().min(3).required()
    }
    // Joi is very useful for input validation
    return Joi.validate(course, schema);
}