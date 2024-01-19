const express = require('express')
const app = express()

const http = require('http').createServer(app)
const io = require('socket.io')(http, {cors:{origin:"*"}})

let userInfo = []

io.on('connection', (socket)=>{
    console.log("user connection!!")

    socket.on('disconnect', ()=>{
        const user = userInfo.find(c=>c.id == socket.id)
        socket.broadcast.emit('msg',{level:"sys", msg:user.input_ref + "님이 퇴장하였습니다"})
    })

    socket.on('login', (input_ref)=>{
        const info = {
            input_ref:input_ref,
            id:socket.id
        }
        userInfo.push(info)
        io.emit('msg',{level:"sys", msg:input_ref + " 님이 입장하였습니다"})
    })
    
    socket.on('send', ({nickName:nickName, msg:msg1})=>{
        socket.broadcast.emit('msg',{level:"", msg:msg1, nickName:nickName})
    })
})

http.listen(process.env.PROT || 3001, ()=>{
    console.log("chat")
})