/**
 *@author Thomas Fürholzer, HTL-Perg, 4AHIF
 *@requires restify,ps
 */

import { createServer, plugins, Server } from 'restify';
import { contactDoPost } from './contact-post'
import { contactDoGet } from './contact-get';
import { contactDoDelete } from './contact-delete';
import { Client } from 'pg'

export class Person {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    /**
     * @param {int} id id of the person -> should be an integer that is greater or equal 0
     * @param {string} firstName first name of the new person
     * @param {string} lastName last name of the new person
     * @param {string} email email of the person (email syntax is not checked)
     */
    public constructor(id: number, firstName: string, lastName: string, email: string) {
        this.firstName = firstName;
        this.id = id;
        this.lastName = lastName;
        this.email = email;
    }
    public static getAllPersons(client : Client) : [boolean,Array<Person>]{
        let persons : Array<Person> = new Array();
        let ret : boolean = true
        client.query("SELECT * FROM Persons" ,(error, result)=>{
            if(error){
                console.log(error.stack);
                ret = false;
            }else{
                result.rows.forEach((row)=>{
                    persons.push(new Person(row.personid,row.firstname,row.lastname,row.email));
                });
            }
        });
        return [ret,persons];
    }
    public static deletePersonById(client : Client, id : number) : boolean{
        let ret : boolean = true;
        client.query(`DELETE FROM persons where personid=${id};`, (result,error)=>{
            if(error){
                ret = false;
            }
        });
        return ret;
    }
    public insertPerson(client : Client) : boolean{
        let ret : boolean = true;
        client.query(`INSERT into persons (personid,firstname,lastname,email)values(${this.id},'${this.firstName}','${this.lastName}','${this.email}');`,(result,error) =>{
            if(error){
                ret = false;
            }
        })
        return ret;
    }
}
export const databaseConnection : Client = new Client({connectionString: process.env.DATABASE_URL,ssl: true,});
databaseConnection.connect();
/**
 * Function that checks if a person already existis in the array (same id)
 * @param {Person} newPerson Person to be added
 * @param {Array<Person>} storage  array where all persons are stored
 * @return {boolean} returns true if the person was added and false if not
 */
export function addPerson(newPerson : Person, storage : Array<Person>) : boolean{
    if(storage.filter(person => person.id === newPerson.id).length === 0){
        storage.push(newPerson);
        return true;
    }else{
        return false;
    }
}


const port = process.env.PORT || 8080;
//Defining Port

const server: Server = createServer();
server.use(plugins.bodyParser());
server.post("/contacts", contactDoPost);
server.get("/contacts", contactDoGet);
server.del("/contacts/:id", contactDoDelete);
//Creating server and adding bodyParser plugin as well as setting all methods
server.listen(port, () => console.log(`Server is now listening to port ${port}`));
//Starting server