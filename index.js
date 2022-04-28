import express, { text } from "express"
import cors from "cors"
import dayjs from "dayjs"
import { MongoClient } from "mongodb"
import dotenv from "dotenv"


const app = express()
app.use(cors())
app.use(express.json())
dotenv.config()

let hour = dayjs().format("HH:mm:ss")
let date = dayjs().format("DD/MM/YYYY HH:mm:ss")

let db = null;
const mongoClient = new MongoClient(process.env.URL_MONGO) 
console.log(process.env.URL_MONGO)

app.post("/participants", async (req,res) => {
    let { name } = req.body
    // validação pela biblioteca join a ser inserida aqui

    if(name == ""){
        res.status(422).send("Todos os campos são obrigatórios!")
        return
    }

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
        await mongoClient.connect()
        db = mongoClient.db("test")

        const status = await db.collection("participants").insertOne(participant)
        await db.collection("messages").insertOne(message)

        res.send(status)
        mongoClient.close()

    } catch (e) {
        console.log("deu ruim chefe", e)
        res.send("deu ruim de mais")
        mongoClient.close()
    }
        
})

app.get("/participants", async (req, res) => {

    try{
        await mongoClient.connect()
        db = mongoClient.db("test")

        const participants = await db.collection("participants").find({}).toArray()
        res.send(participants)
        mongoClient.close()
        return
        
    } catch (e) {
        console.log("xabuuuuu", e)
        res.send("deu ruim de mais")
        mongoClient.close()
    }

})

app.post("/messages", async (req, res) => {
    const { to, text, type } = req.body
    const user = req.headers.user

    const message = {
        to: to,
        from: user,
        type: type,
        text: text,
        time: hour
    }

    try {
        await mongoClient.connect()
        db = mongoClient.db("test")

        await db.collection("messages").insertOne(message)
        res.send("201")
        mongoClient.close()
    } catch (e) {
        console.log("deu ruim chefe", e)
        res.send("deu ruim de mais")
        mongoClient.close()
    }
    
})

app.get("/messages", async (req, res) => {
    const {limit} = req.query
    const user = req.headers.user
    console.log(limit, user)

    try{
        // find({$or: [{from:user},{to:user},{to:"todos"}]})
        
        await mongoClient.connect()
        db = mongoClient.db("test")

        const messages = await db.collection("messages").find({}).toArray()
        res.send(messages)
        mongoClient.close()
    } catch (e) {
        console.log("deu ruim", e)
        mongoClient.close()
    }
})

app.post("/status", (req, res) => {
    
})

app.listen(5000, () => {
    console.log("servidor em pé")
})