from pathlib import Path
import mimetypes

from litestar import Litestar, get
from litestar.response import File, Response

BASE_DIR = Path(__file__).resolve().parent
DIST_DIR = BASE_DIR / "frontend" / "dist"
INDEX_FILE = DIST_DIR / "index.html"


def resolve_media_type(path: Path) -> str:
    if path.suffix == ".js":
        return "text/javascript"
    if path.suffix == ".css":
        return "text/css"
    if path.suffix == ".html":
        return "text/html"
    guessed = mimetypes.guess_type(str(path))[0]
    return guessed or "application/octet-stream"


@get("/api/questions")
async def get_questions() -> File:
    return File(path="questions.json", filename="questions.json", content_disposition_type="inline")


@get("/health")
async def health() -> Response[str]:
    return Response(content="ok", media_type="text/plain")


@get("/")
async def root() -> File:
    if not INDEX_FILE.exists():
        return File(path="index.html", filename="index.html", content_disposition_type="inline")
    return File(
        path=INDEX_FILE,
        filename="index.html",
        content_disposition_type="inline",
        media_type="text/html",
    )


@get("/{path:path}")
async def spa(path: str) -> File:
    if not INDEX_FILE.exists():
        # Fallback for local backend-only execution.
        return File(path="index.html", filename="index.html", content_disposition_type="inline")

    normalized_path = path.lstrip("/")
    requested = DIST_DIR / normalized_path
    if normalized_path and requested.exists() and requested.is_file():
        media_type = resolve_media_type(requested)
        return File(path=requested, content_disposition_type="inline", media_type=media_type)

    return File(
        path=INDEX_FILE,
        filename="index.html",
        content_disposition_type="inline",
        media_type="text/html",
    )


app = Litestar(route_handlers=[get_questions, health, root, spa])
