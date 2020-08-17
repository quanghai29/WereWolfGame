const db = require('../utils/db');

module.exports = {
    add: entity => db.add('users', entity),
    singleByUsername: async username => {
        const rows = await db.load(`select * from users where username = '${username}'`);
        if (rows.length === 0)
          return null;
    
        return rows[0];
      },
    allName:() => {return db.load('select username, ten, email, password from users');},
    // getUserName:()=> db.load(`select username,ten from users as m inner join loai_member as l on m.loai=l.id `),
    patch: entity => {
        const condition = { username: entity.username };
        if(entity.password==entity.password2)
        {
          if(entity.password == "")
            delete entity.password;
          delete entity.username;
          delete entity.password2;
          console.log(condition, entity);
          db.patch('users',entity,condition);
          
        }
        else{
          console.log("update user failed!");
          
        }
    }
};