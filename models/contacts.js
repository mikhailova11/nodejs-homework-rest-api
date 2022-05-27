const { readFile, writeFile } = require('fs/promises');
const path = require('path');




const contactsPath = path.join(__dirname, './contacts.json');


const listContacts = async () => {
  const listContactsString = await readFile(contactsPath, 'utf8')
  return JSON.parse(listContactsString)

}

const getContactById = async (contactId) => {
  const allContact = await listContacts();
  const contactById = allContact.find(contact =>contact.id.toString() === contactId)
  return contactById || null;
}

const removeContact = async (contactId) => {
const allContact = await listContacts();
const index = allContact.findIndex(({id}) => id === contactId)
const deleteContact = allContact[index];

if(index !== -1){
allContact.splice(index,1);
await writeFile(contactsPath, JSON.stringify(allContact));
return deleteContact;
}  else {
  return null
}
}


const addContact = async (body) => {
  const {name, email, phone} = body;
  const allContact = await listContacts();
  const newContact = {id: (allContact.length+1).toString(), name, email, phone }
  allContact.push(newContact);
  await writeFile(contactsPath, JSON.stringify(allContact));
  return newContact;
}

const updateContact = async (contactId, body) => {
  const {name, email, phone} = body;
  const allContact = await listContacts();
  const contactIndex = await allContact.findIndex((data) => data.id === contactId)

  if(contactIndex !== -1){
    allContact[contactIndex].name = name;
    allContact[contactIndex].email = email;
    allContact[contactIndex].phone = phone;

    await writeFile(contactsPath, JSON.stringify(allContact));
    return allContact[contactIndex];
  }  else {
    return null
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
