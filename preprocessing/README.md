# Preprocessing the dataset

## Table of contents
- [Introduction](#introduction-📖)
- [The preprocessing](#the-preprocessing-🛠️)
- [Building the MongoDB database](#building-the-mongodb-database-🏗️)

## Introduction 📖

As we wanted to make a book-site, we needed a book-dataset. For this dataset we had a few criterias about what information each entry should contain about each book. These were:

- A rating
- Book title
- Description
- Genres
- Page count
- Author
- An image of the book cover
- More than 10 000 entries (books)

The problem was that only one dataset satisfied all our criteria: [the "Best Books Ever Dataset" by Lorena Casanova Lozano and Sergio Costa Planells](https://zenodo.org/records/4265096). The dataset satisfied all the criteria, but had another problem: lots and lots of missing values. The solution: preprocessing of the data.

## The preprocessing 🛠️

We chose to preprocess the data using pandas as it is ["a fast, powerful, flexible and easy to use open source data analysis and manipulation tool"](https://pandas.pydata.org/).

First we looked at the dataset to get an idea of what it looked like. It has 52478 entries, and some columns were missing more values than others. The columns with too many missing values that we also were not that interested in, like price, likedPercent, etc. were just dropped. We also found that some of the bookIds were duplicates, so we removed them.

Then we moved on to trying to remove rows with missing values in the columns we cared about. We replaced all empty strings with NAN values. We also replaced the other standard values for some columns with NAN. The standard page number for unknown values were 0, which would be confusing for a user.

```python
df['pages'] = df['pages'].replace('0', np.nan)
```

About 30 000 entries had one date format, and the other 20 000 entries had another, so we standardized the formats to one format.

```python
# Function to parse dates using dateutil
def parse_date(date_str):
    try:
        return pd.to_datetime(parser.parse(date_str), errors='coerce')
    except (ValueError, TypeError):
        return pd.NaT
```

We also parsed the authors and genres columns from being comma-separated strings to be lists of strings.

```python
# Replace values in authors and genres
df['authors'] = df['authors'].str.split(',').apply(lambda x: [y.strip() for y in x])
df['genres'] = df['genres'].apply(literal_eval).apply(lambda x: [y.strip() for y in x])
```

Then we dropped all the NAN values, indexed the dataset around bookId, and saved the pandas dataframe to JSON.

```python
# Save the DataFrame as a JSON list
df.to_json('preprocessing/books.json', orient='records')
```

In the end we ended up with a clean dataset with around 40 000 entries.

## Building the MongoDB database 🏗️

After having preprocessed the data into a neat format and storing it in a JSON file, we wanted to upload the data to a MongoDB database. We used the `pymongo` library to interact with the database.

We made a connection to the database and created a new collection called `books`. We then inserted all the entries from the JSON file into the collection.

We also made multiple indexes on the collection to make it faster to query the data. We made indexes on the fields we sort and search by.
