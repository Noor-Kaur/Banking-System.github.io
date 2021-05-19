const express = require('express');
const app = express();
const mysql = require('mysql');

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Qwemnb12@',
    database: 'bank',
    multipleStatements:true
});

connection.connect((err) => {
    if (err) {
      console.log('error connecting: ' + err.stack);
      return;
    }
    console.log('success');
  });

  app.get('/',(req,res)=>{
    res.render('home.ejs');
});
 

app.get('/list', (req, res) => {
    connection.query(
      'SELECT * FROM customers',
      (error, results) => {
        console.log(results);
        res.render('list.ejs',{customers: results});
      }
    );
  });

app.get('/transfer/:Id', (req,res) =>{
    connection.query(
      'SELECT * FROM customers WHERE Id=?',
      [req.params.Id],
      (error,results)=>{
        console.log(results);
        res.render('tr.ejs',{customer: results[0]});
      }
    );
  });

  app.post('/update/:Id', (req, res) => {
    
    var sql='UPDATE customers SET Amount=Amount+? WHERE Id =?; UPDATE customers SET Amount=Amount-? WHERE Id =?; INSERT INTO transaction VALUES (?, ?, ?)';   
    
    connection.query(sql,
       [req.body.cash, req.body.num, req.body.cash, req.params.Id, req.params.Id, req.body.num, req.body.cash],
      (error, results) => {
          res.redirect('/list');
        }
      );
  });

  app.get('/transaction',(req,res)=>{
    connection.query(
      'SELECT * FROM transaction',
      (error,results)=>{
        res.render('transaction.ejs',{transaction: results});
      }
    );
  });
  
app.listen(4000,()=>console.log('Server running on port 4000!'));