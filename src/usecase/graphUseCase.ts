import GraphRepository from "../repository/graphRepository"

class GraphUseCase{
     private _graphRepository:GraphRepository
    constructor(graphRepository:GraphRepository){
      this._graphRepository=graphRepository
    }
   async takeGraphData(){
    

    const data=await this._graphRepository.createGarphData()
    if(data){
        return{
            status:200,
            data:data
        }
    }
    return{
        status:400,
        message: 'Failed to retrieve graph data. Please try again later or contact support if the issue persists.',
    }

   }

}

export default GraphUseCase