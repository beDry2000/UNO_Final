const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ?? 400;

    res.status(statusCode);

    res.json({
        message: err.message
    });
}

export default errorHandler;