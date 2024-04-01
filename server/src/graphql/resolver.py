import strawberry
import typing
from src.graphql.schema import Book

@strawberry.type
class Query:

    @strawberry.field
    def get_hello(self) -> str:
        return "Hello World"

    @strawberry.field
    def get_books(self) ->  typing.List[Book]:
        return [
        Book(
            title="The Great Gatsby",
            author="F. Scott Fitzgerald",
        ),
    ]
    
schema = strawberry.Schema(query=Query)