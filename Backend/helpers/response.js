const failResponse = (req,res,data,message,statusCode)=>{
    return res.status(statusCode).send({
        error:false,
        sucess:false,
        message:message
    });
}
const successResponse =(req,res,data,message,statusCode)=>{
    
    return res.status(statusCode).send({
        error:false,
        sucess:true,
        message:message,
        data
    });
}
const errorResponse = (req,res,errorDesc,errorKey)=>{
    
   const statusCode = errorKey ? errorKey:500;
   return res.status(statusCode).send({
    error:true,
    sucess:false,
    message:errorDesc.message,
    data:null
});
}
module.exports={
    failResponse,
    successResponse,
    errorResponse
}