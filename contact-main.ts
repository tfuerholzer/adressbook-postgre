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
    /**
     * Uses a PostgreClient to connect to the database and querry all Persons. After that calls callback
     * @param {Client} client opend Client is required.
     * @param {([boolean,Array<Person>] )=> void} callback Will be called after all persons have been querried. the boolean is true
     * if everything was successfull otherwise its false.
     */
    public static getAllPersons(client : Client, callback : (data : [boolean,Array<Person>] )=> void) : void{
        let persons : Array<Person> = new Array();
        let ret : boolean = true
        let x = client.query("SELECT * FROM Persons" ,(error, result)=>{
            console.log(result.rowCount);
            if(error){
                console.log(error.stack);
                ret = false;
            }else{
                result.rows.forEach((row)=>{
                    persons.push(new Person(row.personid,row.firstname,row.lastname,row.email));
                });
            }
            callback([ret,persons]);
        });
    }
    /**
     * Uses a PostgreClient to the DB and delte a user.
     * @param {Client} client opend Client is required.
     * @param {int} id Number of the person to be deleted
     * @param {(value : boolean)=>void} callback Will be called after a person has been deleted. the boolean is true
     * if the operation was successfull.
     */
    public static deletePersonById(client : Client, id : number, callback : (value : boolean)=>void) : void{
        let ret : boolean = true;
        client.query(`DELETE FROM persons where personid=${id};`, (result,error)=>{
            if(error){
                ret = false;
            }
            callback(ret);
        });
    }
    /**
     * Inserts this person object
     * @param {Client} client opend Client is required.
     * @param {(values : boolean)=> void} callback Will be called after a person has been inserted. the boolean is true
     * if the operation was successfull.
     */
    public insertPerson(client : Client, callback : (values : boolean)=> void) : void{
        let ret : boolean = true;
        client.query(`INSERT into persons (personid,firstname,lastname,email)values(${this.id},'${this.firstName}','${this.lastName}','${this.email}');`,(result,error) =>{
            if(error){
                ret = false;
            }
            callback(ret);
        })
    }
}
export const databaseConnection : Client = new Client({connectionString: process.env.DATABASE_URL,ssl: true,});
databaseConnection.connect();

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