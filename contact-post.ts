import { Request, Response, Next } from 'restify'
import { Person, databaseConnection} from './contact-main'

export function contactDoPost(request: Request, response: Response, next: Next): void {
    let description: string = "";
    if(request.body.id === undefined || request.body.firstName === undefined || request.body.lastName === undefined || request.body.email === undefined){
        description="Invalid input (e.g. required field missing or empty)";
        response.statusCode = 400;
        response.send(description);
        //if any of these fields are undefined i will send back an error and the status-code 400
    }else{
        (new Person(request.body.id, request.body.firstName, request.body.lastName, request.body.email).insertPerson(databaseConnection,(ret : boolean)=>{
            if(ret){
                response.statusCode = 200;
                description = "Person successfully created";
            }else{
                response.statusCode = 500;
                description = "Error from DB";
            }
            response.send(description);
            next();
        })) 
    }
    
    //sending and calling next
}