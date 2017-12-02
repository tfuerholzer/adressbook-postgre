"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contact_main_1 = require("./contact-main");
function contactDoGet(request, response, next) {
    response.setHeader("content-type", "application/json");
    let result = contact_main_1.Person.getAllPersons(contact_main_1.databaseConnection);
    let text = "";
    if (result[0]) {
        response.code = 200;
        text = JSON.stringify(result[1]);
    }
    else {
        response.code = 500;
        text = "Internal database error";
    }
    response.send(text);
    next();
    //very simple - just sending a stringifiyed Array of persons and calling next
}
exports.contactDoGet = contactDoGet;
