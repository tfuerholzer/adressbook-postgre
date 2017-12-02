import {Request,Response,Next} from 'restify'
import {Person,databaseConnection} from './contact-main' 

export function contactDoGet(request : Request, response : Response, next : Next): void{
    response.setHeader("content-type","application/json");
    Person.getAllPersons(databaseConnection,(result : [boolean,Array<Person>])=>{
        let text : string = "";
        if(result[0]){
            response.code = 200;
            text = JSON.stringify(result[1]);
        }else{
            response.code = 500;
            text = "Internal database error";
        }
        response.send(text);
        next();
    });
    
    //very simple - just sending a stringifiyed Array of persons and calling next
}