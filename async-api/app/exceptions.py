from fastapi import HTTPException, status


def resource_not_found(
    status_code: int = status.HTTP_404_NOT_FOUND, detail: str = "Resource not found"
):
    raise HTTPException(
        status_code,
        detail,
    )


def conflict(
    status_code: int = status.HTTP_409_CONFLICT,
    detail: str = "There was a conflit during the operation",
):
    raise HTTPException(status_code, detail)


def resource_repited(
    status_code: int = status.HTTP_400_BAD_REQUEST,
    detail: str = "The resource already exists",
):
    raise HTTPException(status_code, detail)
