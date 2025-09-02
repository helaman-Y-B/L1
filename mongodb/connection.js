// Calls the mongo client and server api
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

// The connection string
const uri = process.env.URI;

// Create a new MongoClient
const client = new MongoClient(uri, {
    // Set the Server API version
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
}); 

// Execute the client
async function run() {
    try {
        await client.connect();

        await client.db("admin").command({ ping: 1 });

        // Create a new listing
        /*await createListing(client, {
            salesDate: new Date(),
            items: {
                name: "computer",
                tags: ["electronics", "computers"],
                price: 999.99,
                quantity: 1
            }
        })*/

        // Find a listing by items name
        //await findOneListbyName(client, "computer");

        // Update a listing by items name
        // If you need to update an items inside the listing, you will need to pass the whole path, or the query will create the items in the root of the document
        /*await updateListingByName(client, "computer", { "items.price": 799.99, "items.quantity": 2 });*/

        // Delete a listing by items name
        await deleteListingByName(client, "computer");

        console.log ("Ping command successful");
    } finally {
        await client.close();
    }
}

// Execute the client
run().catch(console.dir);

// List all databases in the cluster
async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => {
        console.log(`- ${db.name}`)
    })
}

// Create operation

async function createListing(client, newListing) {
    // Insert ONE new listing into the sales collection
    // You can also use insertMany to create multiple listings
    const result = await client.db("sample_supplies").collection("sales").insertOne(newListing);
    console.log(`New listing created with the following id: ${result.insertedId}`);
}

// Read operation

async function findOneListbyName(client, nameOfListing) {
    // Find ONE listing by the items name
    // You can also use find to find multiple listings
    const result = await client.db("sample_supplies").collection("sales").findOne( { "items.name": nameOfListing } );

    if (result) {
        console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
        console.log(result);
    } else {
        console.log(`No listing found with the name '${nameOfListing}'`);
    }
}

// Update operation

async function updateListingByName(client, nameOfListing, updateListing) {
    // Update ONE listing by the items name
    // There is a "function" called upsert which when true, creates a new document
    // if no document matches the filter or query.

    // There is also updateMany for updating many listings at once
    const result = await client.db("sample_supplies").collection("sales").updateOne(
        { "items.name": nameOfListing },
        { $set: updateListing }
    );

    if (result.modifiedCount > 0) {
        console.log(`Successfully updated the listing with the name '${nameOfListing}'`);
    } else {
        console.log(`No listing found with the name '${nameOfListing}'`);
    }
}

// Delete operation

async function deleteListingByName(client, nameOfListing) {
    // Delete ONE listing by the items name
    // There is also deleteMany for deleting many listings at once
    const result = await client.db("sample_supplies").collection("sales").deleteOne({
        "items.name": nameOfListing,
    });

    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

/** Mongo Db information:
 * A Document is like a row of data.
 * A Collection is like a table of data.
 * 
 * CRUD operations:
 * 
 * CREATE;
 * READ;
 * UPDATE;
 * DELETE;
 **/