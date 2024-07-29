const mongoose = require('mongoose');

const errorMsg = () => {
    console.log('Usage: node mongo.js password [optional: "name" "phone"]');
    process.exit(1);
};

if (process.argv.length < 3) {
    errorMsg();
}

const password = process.argv[2];
const url = `mongodb+srv://roweller:${password}@cluster0.e8whlu0.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});
const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
    console.log('phonebook');
    Person.find({}).then(result => {
        result.forEach(person => console.log(`${person.name} ${person.number}`));
        mongoose.connection.close();
    });
}else if (process.argv.length <= 5) {
    const [name, number] = [process.argv[3], process.argv[4]];
    const newPerson = new Person({ name, number });
    newPerson.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`);
        mongoose.connection.close();
    });
}else {
    errorMsg();
}
