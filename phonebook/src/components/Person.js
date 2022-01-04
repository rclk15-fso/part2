

const Person = ({ person,handleDeletePerson }) => {
  // console.log(person.id)
  return (
    <li>
      {`${person.name} ${person.number}`}
      <button onClick={()=>handleDeletePerson(person.id)}>Delete</button>
    </li>
  );
};

export default Person;
