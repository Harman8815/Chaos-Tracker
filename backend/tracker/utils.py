from rest_framework.response import Response
from rest_framework import status


def success_response(data=None, message=None, count=None, status_code=status.HTTP_200_OK):
    """
    Standard success response format:
    {
        "success": true,
        "data": ...,
        "message": ...,
        "count": ...
    }
    """
    response = {"success": True}
    if data is not None:
        response["data"] = data
    if message is not None:
        response["message"] = message
    if count is not None:
        response["count"] = count
    return Response(response, status=status_code)


def error_response(message, code=None, details=None, status_code=status.HTTP_400_BAD_REQUEST):
    """
    Standard error response format:
    {
        "success": false,
        "error": {
            "code": ...,
            "message": ...,
            "details": ...
        }
    }
    """
    error = {"message": message}
    if code is not None:
        error["code"] = code
    if details is not None:
        error["details"] = details
    return Response({"success": False, "error": error}, status=status_code)
