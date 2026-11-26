from fastapi import HTTPException
from starlette import status


class NotFoundException(HTTPException):
    def __init__(self, detail: str = "Not Found"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)


class AuthenticationFailedException(HTTPException):
    def __init__(self, detail: str = "Incorrect username or password"):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )


class UnauthorizedException(HTTPException):
    def __init__(self, detail: str = "Could not validate credentials"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )


class BadRequestException(HTTPException):
    def __init__(self, detail: str = "Bad Request"):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)


class ConflictException(HTTPException):
    def __init__(self, detail: str = "Conflict"):
        super().__init__(status_code=status.HTTP_409_CONFLICT, detail=detail)
