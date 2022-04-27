import express, { text } from "express"
import cors from "cors"
import dayjs from "dayjs"

const app = express()

let hour = dayjs().format("HH:mm:ss")
let date = dayjs().format("DD/MM/YYYY HH:mm:ss")
app.use(cors())
app.use(express.json())


let participants = []
let messages = []

app.post("/participants", (req,res) => {
    let { name } = req.body

    // validação pela biblioteca join a ser inserida aqui

    if(name == ""){
        res.status(422).send("Todos os campos são obrigatórios!")
        return
    }
    const particampdb = {
        name: name,
        lastStatus: Date.now()
    }
    const messagedb = {
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