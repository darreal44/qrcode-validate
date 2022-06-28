const  sqlite3 =  require('sqlite3') 

const { open } = require('sqlite')

// you would have to import / invoke this in another file
 async function connectDb () {
  try {

    //console.log("excuted");
    return open({
            filename: 'linan.db',
            driver: sqlite3.Database
        })

  } catch (err) {
      return err;
  }
}

module.exports = {connectDb};