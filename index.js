import express, { text } from "express"
import cors from "cors"
import dayjs from "dayjs"
import { MongoClient } from "mongodb"

const app = express()
app.use(cors())
app.use(express.json())

let hour = dayjs().format("HH:mm:ss")
let date = dayjs().format("DD/MM/YYYY HH:mm:ss")

//
let db = null;
const mongoClient = new MongoClient("mongodb://localhost:27017") 
const promisse = mongoClient.connect();
promisse.then(response => {
    db = mongoClient.db("test")
    console.log("banco de dados conectados")
})
promisse.catch(e => console.log("deu ruim meu patrão",e))
//

let participants = []
let messages = []

app.post("/participants", (req,res) => {
    let { name } = req.body

    // validação pela biblioteca join a ser inserida aqui

    if(name == ""){
        res.status(422).send("Todos os campos são obrigatórios!")
        return
    }
    const particant = {
        name: name,
        lastStatus: Date.now()
    }
    const message = {
        from: "xxx" ,
        to: "todos" ,
        text: "entra na sala" ,
        type: "status" ,
        time: hour
    }
    console.log(mdb)
    res.status(201)
})

app.get("/participants", (req, res) => {
    
})

app.post("/messages", (req, res) => {
    
})

app.get("/messages", (req, res) => {
    
})

app.post("/status", (req, res) => {
    
})

app.listen(5000, () => {
    console.log("servidor em pé")
})