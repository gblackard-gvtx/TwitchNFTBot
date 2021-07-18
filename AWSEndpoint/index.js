// The url for the AWS Endpoint is currently https://167u5tt2o0.execute-api.us-east-2.amazonaws.com/default/Endpoint
exports.handler = async (event) => {
    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda Geoffery!'),
    };
    return response;
};
