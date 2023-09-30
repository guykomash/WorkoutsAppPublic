/*Capitilze each first letter in a string, word divided by spaces. ('guy komash' -> 'Guy Komash')*/
const formatName = (name) => {
  //trim() removes any wrapping spaces in name.

  if (!name || name === '') return name;
  if (name.length === 1) return name.toUpperCase();
  else {
    const names = name.trim().split(' ');
    let formattedName = '';
    for (const n of names) {
      if (n !== '') {
        // skip extra spaces.
        const first = n[0].toUpperCase();
        const rest = n.substring(1).toLowerCase();
        formattedName = `${formattedName}${first}${rest} `;
      }
    }
    return formattedName.trim();
  }
};

module.exports = { formatName };
