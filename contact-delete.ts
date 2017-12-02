import {Request,Response,Next} from 'restify'
import {Person ,databaseConnection} from './contact-main'

export function contactDoDelete(request : Request, response : Response, next : Next) : void{
    let personID : number = Number.parseInt(request.params.id);
    //Parsing number
    let description : string = "";
    Person.deletePersonById(databaseConnection,personID,(ret : boolean)=>{
        if(ret){
            response.statusCode = 200;
            description = "Delete successfull";
        }else{
            response.statusCode = 500;
            description = "Error deleting from database";
        }
        response.send(description);
        next();
    })
    
    
    //sending back the response and calling next
}