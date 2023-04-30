const express = require('express')
const app  = express()
const db  = require('./config');
let port = 8000

app.use(express.json());
app.use(express.urlencoded({
    extended: false
  }));
app.set('view engine', 'ejs');
app.set('views', './public/views');
app.use(express.static('public'));

app.get('/',  (req, res) => {
    res.send('POWER');
})

app.get('/admin',  (req, res) => {
    res.render('admin');
})

app.get('/client',  (req, res) => {
    res.render('client');
})

app.get('/users/:id', async  (req, res) => {

    console.log(typeof req.params.id);
    console.log(`'${req.params.id}'`);
      
    //  return
    try {

        if (req.params.id) {
            // let  val =  (parseInt(req.params.id) === NaN) ?  0 : parseInt(req.params.id)
            // console.log(val);
            const conn = await db.connectDb();
            const sql =   await conn.all(`SELECT * FROM user WHERE id = '${req.params.id}'`)
	    console.log(sql)
            res.json(sql)
        }else{
            let arr = []
            res.json(arr)

        }
        
    } catch (error) {
        console.log(error);
    }
})

app.post('/transactions',  async (req, res) => {
     
    try {
        console.log(req.body.amount);
        console.log(req.body);
	
        // return
        
        const conn = await db.connectDb();
        //SET to CJ
        const sql2 =   await conn.all(`SELECT * FROM user WHERE id = '${req.body.user}'`)
	console.log(sql2)
        selector = "soiree"	
        const balance = sql2[0][selector] + parseFloat(req.body.amount)
        if (balance >= 0.0) {	
        	const sql1 =   await conn.run(`update user set ${selector}=${balance} where  id = '${req.body.user}'`)
        	const sql =   await conn.run(`insert into  payment  (user_id,amount) values ('${req.body.user}',${balance})`)
        	console.log(sql);
         	res.json(true)
	} else {
	  res.json(false)
	}
    } catch (error) {
        console.log(error);
    }
})

app.get('/transactions/:type', async (req, res) => {
    try {
        if (req.params.type == 1){

            const conn = await db.connectDb();
            const sql =   await conn.all(`SELECT  *,p.created_at as payment_at from payment  p
            INNER JOIN   user on user.id = p.user_id 
            ORDER BY p.id DESC`)
            res.json(sql)
        }else if(req.params.type == 2){
    
            const conn = await db.connectDb();
            const sql =   await conn.all(`SELECT * FROM user WHERE id = ${1}`)
            const sql1=  await conn.all(`SELECT * FROM payment WHERE user_id = ${1}
            ORDER BY id DESC`) 

            let history  = { history : sql1} ; 
            // sql[0].push(history);
            let con = []
            con.push(sql[0])
            con.push(history)

          //  console.log(sql)
            res.json(con)
        }
         
    } catch (error) {
        console.log(error)
    }
      
 
    //res.render('admin');
})
 





 

console.log("DB is connected :" + db.connectDb());
app.listen(port, () => console.log(`port is running on ${port}`))
