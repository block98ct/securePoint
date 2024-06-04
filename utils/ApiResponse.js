class ApiResponse {
    constructor(statusCode, data, message = "Success", success=true){
        this.statusCode = statusCode
        this.success = success
        this.data = data
        this.message = message
    }
}

export { ApiResponse }