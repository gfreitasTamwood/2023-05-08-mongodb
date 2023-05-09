const uri = "mongodb+srv://gfreitas:FKPNlNFzWzox2C4M@cluster0.p2smffr.mongodb.net/sample_mflix?retryWrites=true&w=majority";

const { MongoClient, ServerApiVersion } = require('mongodb');
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErros: true,
    }
});

async function run(){

    try {
        await client.connect();
        await client.db("admin").command({ ping: 1});
        console.log("Database connected successfully!");
    } finally {
        await client.close();
    }
}

// run().catch(console.dir);

let movieList = [];

async function getMovies(){
    try {
        await client.connect();
        const database = client.db("sample_mflix");
        const catalog = database.collection("movies");

        const theater = { year: {$lt: 1900} };

        const options = {
            sort: { year: 1},
            projection: { _id:0, year: 1, title: 1, imdb: 1 },
        };

        const cursor = catalog.find(theater,options);

        for await (const doc of cursor) {
            // console.dir(doc);
            movieList.push(doc);
        }
    } finally {
        await client.close();
    }
}
getMovies().catch(console.dir);


async function findMovie(){
    try {
        //Select which database you will work from your mongo connection
        const database = client.db("sample_mflix");
        //From database selected, get the collection you will work
        const collection = database.collection("movies");

        const query = { title: "Love Actually" }

        //Delete a movie based on the query
        const result = await collection.findOne(query);

        console.log(`You found the movie title ${result.title}`);

    } finally {
        await client.close()
    }
}

// findMovie();

const newMovie = {
    "plot": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate facere suscipit aliquam rem nemo iste.",
    "genres": [
        "Short"
    ],
    "runtime": 10,
    "cast" : [
        "Keira Knightley",
        "Keanu Reeves",
        "Ryan Gosling"
    ],
    "num_mflix_comments": 1,
    "title": "Love Actually",
    "fullplot": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod eligendi, quis tenetur, doloremque, autem quaerat labore animi dolore corporis omnis sapiente? Quasi maiores recusandae sunt ex nisi dolor hic, delectus qui blanditiis incidunt aperiam ratione laborum, culpa nesciunt beatae sit in earum cupiditate nemo? Ut deserunt accusamus mollitia itaque reiciendis!",
    "countries": [
        "USA",
        "France",
        "Italy"
    ],
    "released": {
        "$date": {
            "$numberLong": "-2418768000000"
        }
    },
    "directors" : [
        "Clint Eastwood",
        "Sam Raimy"
    ],
    "rated": "UNRATED",
    "awards": {
        "wins": 3,
        "nominations" : 5,
        "title": 2
    },
    "year" : 1800,
    "imdb": {
        "rating": 8.6,
        "votes": 20000,
        "id": 6
    },
    "lastupdated": "2015-08-26 00:03:50.133000000",
    "type": "movie",
    "tomatoes": {
        "viewer": {
            "rating": 3,
            "numReviews": 184,
            "meter": 32
        },
        "lastUpdated": {
            "$date": "2015-06-28T18:34:09Z"
        }
    }
};

/**
 * Include a new Movie object inside collection movies from sample_mflix database
 */
async function includeMovie(){
    try {
        //Select which database you will work from your mongo connection
        const database = client.db("sample_mflix");
        //From database selected, get the collection you will work
        const collection = database.collection("movies");

        //Add a new movie into the collection
        const result = await collection.insertOne(newMovie);
        console.log(`A new movie was added to your movies collection: ${newMovie.title}`);

    } finally {
        await client.close()
    }
}

// includeMovie().catch(console.dir);

async function deleteMovie(){
    try {
        //Select which database you will work from your mongo connection
        const database = client.db("sample_mflix");
        //From database selected, get the collection you will work
        const collection = database.collection("movies");

        const query = { title: "Love Actually" }

        //Delete a movie based on the query
        const result = await collection.deleteOne(query);
        //Check if the movie was deleted or not
        if (result.deletedCount === 1) {
            console.log(`You successfully deleted your movie called: ${query.title}`);
        } else {
            console.log(`No movie with this name was found to be deleted`);
        }

    } finally {
        await client.close()
    }
}

// deleteMovie();

const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

PORT = 5000;

app.get("/movies",function(req,res){
    res.json(movieList);
});

app.listen(PORT, function(){
    console.log(`Server is running on port ${PORT}`);
});