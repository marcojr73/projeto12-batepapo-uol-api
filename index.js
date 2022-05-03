import express, { text } from "express"
import cors from "cors"
import dayjs from "dayjs"
import { MongoClient } from "mongodb"
import dotenv from "dotenv"
import joi from "joi"

const app = express()
app.use(cors())
app.use(express.json())
dotenv.config()

const mongoClient = new MongoClient(process.env.URL_MONGO) 

await mongoClient.connect()
let db = mongoClient.db("test")


const participantsSchema = joi.object({
    name: joi.string().min(1).required()
})
const messagesSchema = joi.object({
    to: joi.string().min(1).required(),
    text: joi.string().min(1).required(),
    type: joi.any().valid("message", "private_message").required()
})

app.post("/participants", async (req,res) => {
    let { name } = req.body
    let hour = dayjs().format("HH:mm:ss")
    // validação pela biblioteca join a ser inserida aqui

    const participant = {
        name: name,
        lastStatus: Date.now()
    }

    const message = {
        from: name ,
        to: "todos" ,
        text: "entra na sala" ,
        type: "status" ,
        time: hour
    }

    try{
        name = await participantsSchema.validateAsync({name})
        const available = await db.collection("participants").findOne(name)
        console.log(available, name)
        if(available){
            res.send("Usuário já existente")
            return
        }
        const status = await db.collection("participants").insertOne(participant)
        await db.collection("messages").insertOne(message)
        res.send(status)
        
    } catch (e) {
        console.log("deu ruim chefe", e)
        if(e.isJoi){
            res.sendStatus(422)
            return
        }
        res.send("deu ruim de mais")
    }
        
})

app.get("/participants", async (req, res) => {

    try{
        await mongoClient.connect()
        db = mongoClient.db("test")

        const participants = await db.collection("participants").find({}).toArray()
        res.send(participants)
    } catch (e) {
        console.log("xabuuuuu", e)
        res.send("deu ruim de mais")
    }

})

app.post("/messages", async (req, res) => {
    // const { to, text, type } = req.body
    const message = req.body
    const name = req.headers.user
    let hour = dayjs().format("HH:mm:ss")

    try {
        const result =  await messagesSchema.validateAsync(message)
        const available = await db.collection("participants").findOne({name: message.to})
    
        console.log(available)
        if(available || message.to == "Todos"){
            message.from = name
            message.time = hour
        } else {
            res.send("usuário nao esta no servidor")
            return
        }
        await db.collection("messages").insertOne(message)
        res.send(message)
    } catch (e) {
        if(e.isJoi){
            res.send("tipo de mensagem errada")
            return
        }
        res.send("deu ruim de mais")
    }
    
})

app.get("/messages", async (req, res) => {
    const {limit} = req.query
    const {user} = req.headers

    try{
        const messages = await db.collection("messages")
            .find({$or: [{from:user},{to:user},{to:"Todos"}]})
            .toArray()

        if(limit){
            res.send(messages.slice(-limit))
            return
        }
        res.send(messages)
    } catch (e) {
        res.send("erro ao receber as mensagens")
    }
})

app.post("/status", async (req, res) => {
    const {user} = req.headers

    try {
        await mongoClient.connect()
        db = mongoClient.db("test")

        await db.collection("participants")
        .updateOne({user: user}, {$set: {lastStatus: Date.now()}})
        res.send("deve ter alterado")
    } catch (e) {
        console.log("erro", e)
    }
})

app.listen(5000, () => {
    console.log("servidor em pé")
})