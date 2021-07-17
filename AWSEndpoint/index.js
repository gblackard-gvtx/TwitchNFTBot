// The url for the AWS Endpoint is currently https://usr9herp2j.execute-api.us-east-2.amazonaws.com/default/NFTClipTwitch
exports.handler = async (event) => {
    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda Geoffery!'),
    };
    return response;
};
