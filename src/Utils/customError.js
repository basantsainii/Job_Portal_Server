
class customError extends Error {
    constructor(statusCode, message){
        super(message); // message will be passed from parent constructor
        this.statusCode = statusCode;

    }
}

export default customError;