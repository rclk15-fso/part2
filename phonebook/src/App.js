import React, { useState } from "react";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";

const App = () => {
  const sampleData = [
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
    { name: "Rick", number: "018", id: 5 },
  ];

  const [persons, setPersons] = useState(sampleData);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchedName, setSearchedName] = useState("");

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchedName(event.target.value);
  };
  const submitNewName = (event) => {
    console.log("submitted")
    console.log(persons)
    event.preventDefault();
    const duplicateIndexFunction = (personObject) =>
      personObject.name === newName;
    if (persons.findIndex(duplicateIndexFunction) !== -1) {
      alert(`${newName} has already been added to the phonebook!`);
    } else {
      setPersons(
        persons.concat({
          name: newName,
          number: newNumber,
          id: persons.length + 1,
        })
      );
      console.log(persons)
    }

    setNewName("");
    setNewNumber("");
  };

  const personsToDisplay = () => {
    if (searchedName.length === 0) {
      return persons;
    } else {
      return persons.filter((person) => person.name.includes(searchedName));
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter {...{ searchedName, handleSearchChange }} />

      <h3>Add a new number</h3>
      {/* Creating an object so we can then spread it as props */}
      <PersonForm
        {...{
          submitNewName,
          newName,
          handleNameChange,
          newNumber,
          handleNumberChange,
        }}
      />

      <h3>Numbers</h3>
      <Persons persons={personsToDisplay()} />
    </div>
  );
};

export default App;
