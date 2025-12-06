const mongoose = require('mongoose')

const connection = ()=>{
    try {
        mongoose.connect("mongodb+srv://vickram:LUNJZQgg62672mRL@cluster0.snrccc2.mongodb.net/cloudnaryimg?retryWrites=true&w=majority&appName=Cluster0")
        console.log("connected database..")
        

        
    } catch (error) {
        console.log(`connection ${error.message}`)
    }
}

module.exports = connection;