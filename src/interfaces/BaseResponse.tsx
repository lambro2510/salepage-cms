interface BaseResponse <T> {
    errorCode: number,
    error: boolean,
    message: string,
    data: T,
}