import express from "express";
import errorHandle from "../middlewares/errorHandle";
import ProtectRouter from "../middlewares/authMiddleware";
import AdminMiddleware from "../middlewares/adminMiddlewares";


import GraphController from "../../controller/graphController";
import GraphUseCase from "../../usecase/graphUseCase";
import GraphRepository from "../../repository/graphRepository";

const graphRepository=new GraphRepository()

const graphUseCase=new GraphUseCase(
    graphRepository
);

const graphController=new GraphController(
    graphUseCase
)


const graphRouter=express.Router()

 graphRouter.get('/',AdminMiddleware,(req,res,next)=>{
    graphController.getGraphData(req,res,next)
    
 })



graphRouter.use(errorHandle)

export default graphRouter

