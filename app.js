/*consider this as fire&forget*/
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://user:pw@ip:port/db_name';

console.log(void(0));

var insertDocuments = function(db, insertions, callback) {
    // Get the documents collection
    var collection = db.collection('test');
    // Insert some documents
    collection.insertMany(insertions, function(err, result) {
        assert.equal(err, null);
        assert.equal(insertions.length, result.result.n);
        assert.equal(insertions.length, result.ops.length);
        console.log("Inserted " + insertions.length + " documents into the document collection");
        callback(result);
    });
}

function pushToDb(array) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        switch (process.argv[3]) {
            case "--push":
            case "-p":
                insertDocuments(db, array, function() {
                    db.close();
                });
                break;
            case "--debug":
            case "-d":
                console.log(array);
                db.close();
                break;
            default:
                console.log("You are missing an CLI argument. Valid example: 'node app.js codes.json --debug'");
                db.close();
        }

    });
}


try {

    var codes = require('./' + process.argv[2]);
    var array = Object.keys(codes).map(function(k) {
        return codes[k]
    });


    pushToDb(array, true);

} catch (err) {

    switch (err.code) {
        case "MODULE_NOT_FOUND":
            console.log("The JSON: '" + process.argv[2] + "' was not found");
            break;
        default:
            console.log(err);
    }

}
