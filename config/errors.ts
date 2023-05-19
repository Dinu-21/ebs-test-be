class CustomError extends Error {
    status: number;

    constructor(message: string) {
        super(message);
        this.status = 400;
    }
}

class NotFoundError extends CustomError {
    constructor(name: string) {
        super(`${name} not found.`);
        this.status = 404;
    }
}

class InputValidationError extends CustomError {
    constructor(message: string) {
        super(message);
        this.status = 422;
    }
}


class ConflictError extends CustomError {
    constructor(message: string) {
        super(message);
        this.status = 409;
    }
}

export { NotFoundError, InputValidationError, ConflictError, CustomError };
