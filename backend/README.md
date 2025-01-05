# Backend

## Table of contents

- [Introduction](#introduction-📖)
- [How to run](#how-to-run-⚙️)
- [How to run on the VM](#how-to-run-on-the-vm-🖥️)
- [API Reference](#api-reference-📚)
  - [Example query and response](#example-query-and-response)
- [Storage in MongoDB](#storage-in-mongodb-📦)
  - [Indexes](#indexes)
  - [Performance](#performance)
  - [Structure of stored documents](#structure-of-stored-documents)
    - [Books](#books)
    - [Users](#users)
    - [Reviews](#reviews)

## Introduction 📖

This is the backend of the project. It is a GraphQL server built with [Apollo Server](https://www.apollographql.com/docs/apollo-server/), [GraphQL](https://graphql.org/), [Express](https://expressjs.com/) and [MongoDB](https://www.mongodb.com/).

## How to run ⚙️

1. Install dependencies

   ```bash
   npm install
   ```

2. Create a MongoDB database and get the connection URI. See the MongoDB Community Edition [installation guide](https://www.mongodb.com/docs/manual/administration/install-community/).

3. Run [`preprocessing.py`](../preprocessing/preprocessing.py) to preprocess the data. This will create json files in [`/preprocessing`](/preprocessing/) which you have to upload to the MongoDB database.

4. Run [`upload_json_to_mongo.py`](../preprocessing/upload_json_to_mongo.py) to upload the json files to the MongoDB database. This assumes you have a database called "bookvault". If you have a different database name, you have to change the database name in the script.

5. Modify the `.env` file in [`/backend`](/backend/.env) to your MongoDB URI:

   ```env
   ATLAS_URI=<your mongodb uri>
   PORT=<your port number>
   ```

6. Start the server

   ```bash
   npm run start
   ```

7. The server is now running on `http://localhost:<your port number>` and the API is available at `http://localhost:<your port number>/graphql`. You can use the [sandbox](https://studio.apollographql.com/sandbox/explorer) to test the API.

8. Connect the frontend to the backend by changing the [`.env`](../frontend/.env) file in frontend.

## How to run on the VM 🖥️

To run the backend on the VM, you can simply run the [`vmSetup.sh`](../vmSetup.sh) script on the VM. This will install the necessary dependencies and start the server. You run the script by running the following commands in the terminal (assuming you have already used ssh to establish a connection to the VM):

```bash
cd /home/krisose/T05-Project-2
sh vmSetup.sh
```

> 💡 **Note** <br> Running [`vmSetup.sh`](../vmSetup.sh) will also do other things such as pulling from `main` and building the app. If you are only interested in running the backend, the relevant commands would be:
>
> ```sh
> cd /home/krisose/T05-Project-2/backend
> npm install
> pkill -f node
> nohup npm start &
> ```

If you simply want to connect to the backend running on the VM, you can use the following URL:

```url
http://140.238.102.215/graphql/
```

## API Reference 📚

The API is a GraphQL API. You can find the schema in [`/backend/schema.graphql`](/backend/schema.graphql). Instead of including an API Reference here, you can use the reference generated in the VM-hosted [sandbox](http://140.238.102.215/graphql/) to explore the API.

### Example query and response

This is an example of a query for fetching information about a book:

```graphql
query {
  book(id: "2767052-the-hunger-games") {
    title
    authors {
      name
    }
    description
    genres {
      name
    }
    pages
    publisher
    publishDate
    rating
    coverImg
  }
}
```

This is the response you would get:

```yaml
{
  'data':
    {
      'book':
        {
          'id': '2767052-the-hunger-games',
          'title': 'The Hunger Games',
          'series': 'The Hunger Games',
          'authors': [{ 'name': 'Suzanne Collins' }],
          'description': 'WINNING MEANS FAME AND FORTUNE...',
          'language': 'English',
          'isbn': '9780439023481',
          'genres': [{ 'name': 'Drama' }, { 'name': 'Fantasy/Fiction' }, ...],
          'characters': ['Katniss Everdeen', 'Peeta Mellark', 'Cato (Hunger Games)', ...],
          'bookFormat': 'Hardcover',
          'pages': 374,
          'publisher': { 'name': 'Scholastic Press' },
          'publishDate': '2008-09-14T00:00:00.000Z',
          'awards':
            [
              'Locus Award Nominee for Best Young Adult Book (2009)',
              'Georgia Peach Book Award (2009)',
              'Buxtehuder Bulle (2009)',
              ...,
            ],
          'rating': 4.325370328,
          'numRatings': 6376780,
          'ratingsByStars': [93557, 171994, 745221, 1921313, 3444695],
          'setting': ['District 12, Panem', 'Capitol, Panem', 'Panem (United States)'],
          'coverImg': 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1586722975l/2767052.jpg',
          'numberInSeries': 1,
        },
    },
}
```

## Storage in MongoDB 📦

The data is stored in a MongoDB database. The database is hosted on the VM and is populated with data from the [preprocessing step](/preprocessing/README.md).

### Indexes

We make use of indexes to speed up queries. The indexes we have created are for fields used during search and filtering of books, and they play a crucial role in the performance and efficiency of the application. The indexes are created on the following fields:

- Used during sorting:

  - `title` and `_id` (compound index)
  - `authors.0` and `_id` (compound index)
  - `publisher` and `_id` (compound index)

- Used during filtering:
  - `authors`
  - `genres`
  - `publishDate`
  - `pages`
  - `rating`

In addition to this, we have also created an index on the `UUID` field in the `users` collection in order to improve the performance of fetching users.

### Performance

In addition to using indexes, we make sure to perform all of the filtering and sorting operations through MongoDB aggregation pipelines. This way we do not have to fetch all the data from the database and then filter and sort it in the resolvers. This is done to ensure that the application is as performant as possible.

### Structure of stored documents

#### Books

The books are stored in the `books` collection. As an example of how a book is stored in the database, here is the entry for "The Hunger Games":

```yaml
{
  '_id': { '$oid': '673233a5cf39837971bbb91d' },
  'title': 'The Hunger Games',
  'series': 'The Hunger Games',
  'authors': ['Suzanne Collins'],
  'description': 'WINNING MEANS FAME AND FORTUNE...',
  'language': 'English',
  'isbn': '9780439023481',
  'genres': ['Action', 'Science Fiction', ...],
  'characters': ['Katniss Everdeen', 'Peeta Mellark', ...],
  'bookFormat': 'Hardcover',
  'pages': 374,
  'publisher': 'Scholastic Press',
  'publishDate': { '$date': '2008-09-14T00:00:00.000Z' },
  'awards':
    [
      'Locus Award Nominee for Best Young Adult Book (2009)',
      'Georgia Peach Book Award (2009)',
      'Buxtehuder Bulle (2009)',
      ...,
    ],
  'ratingsByStars': { '1': 93557, '2': 171994, '3': 745221, '4': 1921313, '5': 3444695 },
  'setting': ['District 12, Panem', 'Capitol, Panem', 'Panem (United States)'],
  'coverImg': 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1586722975l/2767052.jpg',
  'numberInSeries': 1,
  'rating': 4.325370328,
  'id': '2767052-the-hunger-games',
}
```

We do not store Authors, Genres, Characters, Awards, or Settings as separate collections. Instead, we store them as arrays in the book object. This is because these entities are not used in any other context than in relation to the book.

#### Users

The users are stored in the `users` collection. Here is an example of how a user is stored in the database:

```yaml
{
  '_id': { '$oid': '6732345e8f588d3b7ddb8e1e' },
  'UUID': '7598afda-18cd-4de8-bbb5-457649926119',
  'name': 'Swanky Mermaid',
  'at': { '$date': '2024-11-11T16:44:14.932Z' },
  'wantToRead':
    [
      '909011._Exterminate_All_the_Brutes_',
      '10473353-there-are-things-i-want-you-to-know-about-stieg-larsson-and-me',
      '18667945-girlboss',
      '17415348-scandal',
    ],
  'haveRead':
    [
      '90629._Repent_Harlequin_Said_the_Ticktockman',
      '11590._Salem_s_Lot',
      '388307._Slowly_Slowly_Slowly_said_the_Sloth',
    ],
  'secret': 'dfd0d256a8c2472e6108b0b901d60ee87c627077e8db8352c8946c5ec57f8640',
}
```

#### Reviews

The reviews are stored in the `reviews` collection. Here is an example of how a review is stored in the database:

```yaml
{
  '_id': { '$oid': '673233a8cf39837971bc4e31' },
  'UUID': '47dd9f7d-ff62-4317-bd91-3083aefa7d58',
  'description': 'Great book! All though Im sure it could have been better ;)',
  'rating': 4,
  'at': { '$date': '2024-10-24T11:55:40.887Z' },
  'userUUID': '294f3890-e86e-4b98-9cb3-08f70adcb2f4',
  'bookID': '2767052-the-hunger-games',
}
```
