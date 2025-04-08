const express= require("express");

const { JWT_SECRET } = require("../config.js");
const { verify } = require("jsonwebtoken");

async function usermiddleware(req,res,next) {
    try {
        const token =req.headers.authorization;
    
    
    
    const word = token.split(" ");
    const jwtToken= word[1];
    const decodedValue=verify(jwtToken,JWT_SECRET );
    if(!decodedValue){
        return res.status(403).json({
            msg:"not authorized"
        })
    }
    console.log(decodedValue.userName);
    
    if(decodedValue.userName){
        
        req.userName= decodedValue.userName;
        console.log(`token ${token}`);
        next();

    }

    }catch(err){
        res.status(403).json({
            msg:"not authorized",
            error:err

    })
}
    
}

module.exports = {
    usermiddleware
}