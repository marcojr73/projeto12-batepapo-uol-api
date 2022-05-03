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
    let hour = dayjs().format("HH:mm:ss")

    const participant = {
        name: req.body.name,
        lastStatus: Date.now()
    }

    const message = {
        from: req.body.name ,
        to: "Todos" ,
        text: "entra na sala" ,
        type: "status" ,
        time: hour
    }

    try{
        const result = await participantsSchema.validateAsync(req.body)
        const notAvailable = await db.collection("participants").findOne({name: result.name})

        if(notAvailable){
            res.sendStatus(409)
            return
        }

        const status = await db.collection("participants").insertOne(participant)
        await db.collection("messages").insertOne(message)
        res.sendStatus(201)
    } catch (e) {
        if(e.isJoi){
            res.sendStatus(422)
            return
        }
        res.sendStatus(409)
    }
        
})

app.get("/participants", async (req, res) => {

    try{
        const participants = await db.collection("participants").find({}).toArray()
        res.send(participants)
    } catch (e) {
        res.send("Ocorreu um erro ao se conectar com o servidor")
    }

})

app.post("/messages", async (req, res) => {
    const message = req.body
    const name = req.headers.user
    let hour = dayjs().format("HH:mm:ss")
    console.log(name)

    try {
        const result =  await messagesSchema.validateAsync(message)
        const available = await db.collection("participants").findOne({name: message.to})
        const active = await db.collection("participants").findOne({name: name})
        console.log(available)
        console.log(active)

        if(result && active && (available || message.to === "Todos")){
            message.from = name
            message.time = hour
        } else {
            res.sendStatus(422)
            return
        }
        await db.collection("messages").insertOne(message)
        res.send(message)
    } catch (e) {
        if(e.isJoi){
            res.sendStatus(422)
            return
        }
        res.sendStatus(201)
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
        res.send("erro ao enviar as mensagens")
    }
})

app.post("/status", async (req, res) => {
    let user = req.headers.user;
    try {
        
      let userCollection = database.collection("users");
      let userDB = await userCollection.findOne({ name: user });
      if (userDB === null) {
        res.sendStatus(404);
        return;
      }
      await userCollection.updateOne(
        { name: user },
        { $set: { lastStatus: Date.now() } }
      );
      res.sendStatus(200);

    } catch {
      res.sendStatus(500);
    }
})

async function checkUsers() {
    let hour = dayjs().format("HH:mm:ss")
    try {
      let participants = await db.collection("participants").find().toArray();
      participants.forEach(user => {
        if (Date.now() - user.lastStatus > 10000) {
          db.collection("participants").deleteOne({ name: user.name });
          db.collection("messages").insertOne({
            from: user.name,
            to: "Todos",
            text: "sai da sala...",
            type: "status",
            time: hour,
          });
        }
      });
    } catch {
        console.log("deu erro")
    }
  }
  setInterval(checkUsers, 2000);

app.listen(5000, () => {
    console.log("servidor em pé")
})