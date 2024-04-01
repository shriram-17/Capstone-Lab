import typing
import strawberry
 
@strawberry.type
class File:
    content:str

@strawberry.type
class Book:
    title:str
    author :str
 
@strawberry.type
class Query:
    Books :typing.List[File]