const app=require("./app");

const dotenv= require("dotenv");

const connectDatabase= require("./config/database")

//handling uncaught exception
process.on("uncaughtException",(err)=>{
    console.log(`Error:${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
});

//cofig
dotenv.config({path:"backend/config/config.env"});

connectDatabase();

app.listen(process.env.PORT,()=>{
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
});
// console.log(youtube);
// Unhandled promise rejection
process.on("unhandledRejection",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandled promise rejection`);

    setDriver.close(()=>{
        process.exit(1);
    });
});