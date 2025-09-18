import json
from pymongo import MongoClient, TEXT
from datetime import UTC, datetime, timedelta

print("Connecting to client...")
client = MongoClient('mongodb://localhost:27017/')
db = client['bookvault']

print("Dropping collections...")
db.drop_collection('authors')
db.drop_collection('genres')
db.drop_collection('publishers')
db.drop_collection('books')
db.drop_collection('nouns')
db.drop_collection('adjectives')

# Uncomment this line if you want to drop the users collection.
# Dropping the collection will lead to an error if you try to load
# the page with the user you were assigned previously. That would be
# very unfortunate for end users and we don't want to do that in the VM.

# db.drop_collection('users')

db.drop_collection('reviews')

print("Creating collections...")
authors = db['authors']
genres = db['genres']
publishers = db['publishers']
books = db['books']
nouns = db['nouns']
adjectives = db['adjectives']
users = db['users']
reviews = db['reviews']

print("Populating collections...")
for file in ['authors.json', 'genres.json', 'publishers.json', 'books.json', 'nouns.json', 'adjectives.json', 'reviews.json', 'users.json']:
    with open(f'preprocessing/{file}', 'r') as f:
        print(file)
        data = json.load(f)
        match file:
            case 'authors.json':
                authors.insert_many(data)
            case 'genres.json':
                genres.insert_many(data)
            case 'publishers.json':
                publishers.insert_many(data)
            case 'books.json':
                for book in data:
                    if book['publishDate'] < 0:
                        book['publishDate'] = datetime(
                            1970, 1, 1) + timedelta(seconds=book['publishDate']/1000)
                    else:
                        book['publishDate'] = datetime.fromtimestamp(
                            book['publishDate']/1000, tz=UTC)
                books.insert_many(data)
            case 'nouns.json':
                nouns.insert_many(data)
            case 'adjectives.json':
                adjectives.insert_many(data)
            case 'users.json':
                for user in data:
                    users.replace_one({'UUID': user['UUID']}, user, upsert=True)
            case 'reviews.json':
                for review in data:
                    review['at'] = datetime.strptime(review['at'], "%Y-%m-%dT%H:%M:%S.%fZ")
                reviews.insert_many(data)

print("Creating indexes...")
books.create_index([('authors', 1)])
books.create_index([('genres', 1)])
books.create_index([('publisher', 1)])
books.create_index([('publishDate', 1)])
books.create_index([('pages', 1)])
books.create_index([('rating', 1)])
books.create_index([('title', 1), ('_id', 1)])
books.create_index([('authors.0', 1), ('_id', 1)])
books.create_index([('publisher', 1), ('_id', 1)])
users.create_index([('UUID', 1)])

client.close()
print("Connections closed successfully")
