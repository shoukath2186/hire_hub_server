import GraphUseCase from "../usecase/graphUseCase";
import { Request,Response,NextFunction } from "express";

class GraphController{
    private _graphUseCase:GraphUseCase

   constructor(graphUseCase:GraphUseCase){
     this._graphUseCase=graphUseCase
   }

   async getGraphData(req:Request,res:Response,next:NextFunction){
    try {
        const response= await this._graphUseCase.takeGraphData()
        if(response.status==200){
            res.status(200).json(response.data)
        }else{
            res.status(response.status).json(response.message);
        }
    } catch (error) {
        next(error)
    }

    
   }
}


export default GraphController;