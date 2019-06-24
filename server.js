var express = require("express")
var bodyParser=require('body-parser')
var app = express()
var http=require('http').Server(app)
var io=require("socket.io")(http)
var mongoose= require('mongoose')
app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
var uri='mongodb://ebasicstest:ebasicstest@ebasics-test-shard-00-00-dnrmf.mongodb.net:27017,ebasics-test-shard-00-01-dnrmf.mongodb.net:27017,ebasics-test-shard-00-02-dnrmf.mongodb.net:27017/chat?ssl=true&replicaSet=eBasics-test-shard-0&authSource=admin'
mongoose.connect(uri,{ useNewUrlParser: true },(err)=>{
    console.log("database connected")
})

var Message = mongoose.model('Message',{
    name:String,
    message:String
})

app.get("/messages",(req,res)=>{
    Message.find({},(err,messages)=>{
        res.send(messages)
    })
})

app.post("/messages",(req,res)=>{
    var message=new Message(req.body)
    message.save((err)=>{
        if(err)
            sendStatus(500)
            
            // messages.push(req.body)
            io.emit("message",req.body)
            res.sendStatus(200)
    })
})

io.on("connection",(socket)=>{
    console.log("user connected")
})


var port = process.env.PORT || 3000
var server=http.listen(port,(err,data)=>{
    console.log("Server running under port on"+ port)
})
