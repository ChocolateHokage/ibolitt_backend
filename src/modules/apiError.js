export default class ApiError extends Error {
    constructor(
        status,
        message,
        errors = []
    ) {
        super(message)
        this.status = status
        this.message = message
        this.errors = errors
    }

    static UnauthorizedError() {
        return new this(401, "Not authorized");
    }

    static BadRequest(message, errors = []) {
        return new this(400, message, errors);
    }
}