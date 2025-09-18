from pymongo import MongoClient

# Connect to the MongoDB server
client = MongoClient('mongodb://localhost:27017/')
db     = client['bookvault']
collection = db['books']  # Replace with your collection name

# Fetch unique genres
unique_genres = collection.distinct('broadGenres')

# Print the unique genres
print(unique_genres)

# Close the connection
client.close()