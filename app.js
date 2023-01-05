const express       = require("express");
const session       = require('express-session');
const passport      = require('passport');
const mongoose      = require('mongoose'); 
const bodyparser    = require('body-parser');
const today         = require("./date")
const multer        = require('multer');
const db = require ('./config/connection');
const path          = require("path");

// storage
const Storage1 = multer.diskStorage({
    destination:'public/informasi',
    filename:(req,file,cb) => {
        cb(null, file.originalname)
    }
});

const Storage2 = multer.diskStorage({
    destination:'public/kegiatan',
    filename:(req,file,cb) => {
        cb(null, file.originalname)
    }
})

const uploadinfo = multer({
    storage:Storage1
});

const uploadkeg = multer({
    storage:Storage2
});

const app = express()
app.set('view engine', 'ejs')
app.use(express.static(__dirname+'/public'));
app.use(session({
	secret: "verygoodsecret",
	resave: false,
	saveUninitialized: true
}));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Passport.js
app.use(passport.initialize());
app.use(passport.session());

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) return next();
    res.redirect('/login');
}
function isLoggedOut(req, res, next) {
    if(!req.isAuthenticated()) return next();
    res.redirect('/');
}

app.get("/", function (req,res) {
    let sql = 'SELECT * FROM info';
    db.query(sql, (err,infor)=> {
        if(err) throw err;
        res.render("index", {
            date : today,
            infolist : infor
        });
    });
    
});

app.get("/info", function (req,res) {
    var nama = "info";
    let sql = 'SELECT * FROM info WHERE judul="'+req.query.name+'"';
    db.query(sql, (err,informasi)=> {
        if(err) throw err;
        res.render("home",{
            name : nama,
            info: informasi });
    });
})

// BAGIAN SECTION
app.get("/visimisi", function (req,res) {
    var nama = "section-visi";
    const sql1 = 'SELECT * FROM visimisi WHERE id = "1"'
    const sql2 = 'SELECT * FROM visimisi WHERE id > "1" '
    db.query(sql1, (err,sect)=> {
    db.query(sql2, (err,sect2)=> {
    
        if(err) throw err;
        res.render("home",{
            judul : "visimisi",
            isi1 : sect,
            isi2 : sect2,
            date : today,
            name : nama });
        });
        });
    });

app.get("/sejarah", function (req,res) {
    var nama = "section";
    const sql = 'SELECT * FROM sejarah WHERE title ="sejarah"'
    db.query(sql,(err,sect)=> {
        if (err) throw err;
        res.render("home",{
            judul : "SEJARAH",
            isinya : sect,
            date : today,
            name : nama });
    });
});

app.get("/struktur", function (req,res) {
    var nama = "struktur";
    const sql = 'SELECT * FROM struktur WHERE title ="struktur"';
    db.query(sql, (err,informasi)=> {
        if(err) throw err;
        res.render("home",{
            name : nama,
            info: informasi, 
            date: today });
    });
});


app.get("/tatatertib", function (req,res) {
    var nama = "section-tater";
   const sql = 'SELECT * FROM tatatertib WHERE title ="tatatertib"'
   db.query(sql,(err,sect)=>{
    if(err) throw err;
    res.render("home",{
        judul : "TATA TERTIB",
        isinya : sect,
        date : today,
        name : nama });
   });
});

// BAGIAN FITUR

app.get("/daftarguru", function (req,res) {
    var nama = "daftar";
    const sql = 'SELECT * FROM guru';
    db.query(sql,(err,guru)=>{
        if(err) throw err;
        res.render("home",{
            judul : "DAFTAR GURU",
            isinya : guru,
            date : today,
            name: nama });
    });    
});

app.get("/daftartendik", function (req,res) {
    var nama = "daftar";
    const sql = 'SELECT * FROM tendik';
    db.query(sql,(err,guru)=>{
        if(err) throw err;
        res.render("home",{
            judul : "DAFTAR TENAGA KEPENDIDIKAN",
            isinya : guru,
            date : today,
            name: nama });
    });    
});

// BAGIAN ADMIN
app.get("/admin", function (req,res) {
    var reqname = null;
    if( req.query.name != reqname){
        let bagian = req.query.bagian;
        let nama = req.query.name; 
        const sql = 'SELECT * FROM '+nama+'';
        db.query(sql,(err,hal)=>{
            let titel =  nama;
            if(err) throw err;
            res.render("admin",{
                name : bagian,
                array : hal,
                title : titel
            });
        })
    }else{
        var nama = "adminn";
        res.render("admin",{
            name : nama
        });  
    }
    
})

// Bagian Sect

app.get("/add-sect", function (req,res) {
    let halaman = req.query.add;
    var field = req.query.halaman;
            res.render("admin",{
                name : halaman,
                element: field
            });
    
})

app.post("/add-sect",function (req,res) {
    var hal = req.body.halaman;
    var field = req.body.title;
    var content = req.body.bagian;
    const sql = "INSERT INTO "+field+"(id,title,content) VALUES('', '"+field+"','"+content+"')";
    db.query(sql,(err)=>{
        if(err)throw err;
    })
        res.redirect('/admin?name='+field+'&bagian=admin-sect');  
    });

app.post("/admin-sect",function (req,res) {
    var hal = req.body.halaman;
    var field = req.body.title;
    var content = req.body.bagian;
    const sql = 'UPDATE '+field+' SET content ="'+content+'" WHERE id = "'+hal+'"';
    db.query(sql,(err)=>{
        if(err)throw err;
    })
        res.redirect('/admin?name='+field+'&bagian=admin-sect');
        
    });

app.get("/pull-sect", function (req,res) {
    var hal = req.query.halaman;
    var field = req.query.field;
    const sql = 'DELETE FROM '+hal+' WHERE id ="'+field+'"';
    db.query(sql,(err)=>{
        if(err)throw err;
    })
    res.redirect('/admin?name='+hal+'&bagian=admin-sect');
})

// Akhir Bagian Sect

app.get("/update", function (req,res) {
    var bagian = req.query.update;
    var hal = req.query.halaman;
    var field = req.query.field;
    const sql = 'SELECT * FROM '+hal+' WHERE id = "'+field+'"';
        db.query(sql,(err,hal)=>{
            if(err) throw err;
            res.render("admin",{
                name : bagian,
                array: hal,
            });
        });
    
})

// Bagian Mult
app.get("/add-mult", function (req,res) {
    let halaman = req.query.add;
    var field = req.query.halaman;
            res.render("admin",{
                name : halaman,
                element: field
            });
    
})

app.post("/add-mult",uploadinfo.single('gambar'), (req,res)=> {
    var hal = req.body.halaman;
    var field = req.body.title;
    var content = req.body.bagian;
    var judul = req.body.judul;
    var gambar = req.file.originalname;
    const sql = "INSERT INTO "+field+"(id,title,tanggal,gambar,judul,content) VALUES('', '"+field+"','"+today+"','"+gambar+"','"+judul+"','"+content+"')";
    db.query(sql,(err)=>{
        if(err)throw err;
    })
        res.redirect('/admin?name='+field+'&bagian=admin-mult');  
    });

app.post("/admin-mult",uploadinfo.single('gambar'), (req,res) => {
    var hal = req.body.halaman;
    var field = req.body.title;
    var content = req.body.bagian;
    var judul = req.body.judul;
    if(req.file){
        var gambar = req.file.originalname;
            const sql = 'UPDATE '+field+' SET gambar="'+gambar+'", judul="'+judul+'", content ="'+content+'"  WHERE id = "'+hal+'"';
            db.query(sql,(err)=>{
                if(err)throw err;
            })
                res.redirect('/admin?name='+field+'&bagian=admin-mult');
            
    }
    else{
            const sql = 'UPDATE '+field+' SET  judul="'+judul+'", content ="'+content+'"  WHERE id = "'+hal+'"';
            db.query(sql,(err)=>{
                if(err)throw err;
            })
                res.redirect('/admin?name='+field+'&bagian=admin-mult');
    }
        
    });

app.get("/pull-mult", function (req,res) {
    var hal = req.query.halaman;
    var field = req.query.field;
    const sql = 'DELETE FROM '+hal+' WHERE id ="'+field+'"';
    db.query(sql,(err)=>{
        if(err)throw err;
    })
    res.redirect('/admin?name='+hal+'&bagian=admin-mult');
})

// Akhir Bagian Mult

// BAGIAN DAFTAR
app.get("/add-daftar", function (req,res) {
    let halaman = req.query.add;
    var field = req.query.halaman;
            res.render("admin",{
                name : halaman,
                element: field
            });
})

app.get("/pull-daftar", function (req,res) {
    var hal = req.query.halaman;
    var field = req.query.field;
    const sql = 'DELETE FROM '+hal+' WHERE id ="'+field+'"';
    db.query(sql,(err)=>{
        if(err)throw err;
    })
    res.redirect('/admin?name='+hal+'&bagian=admin-daftar');
})

app.get("/update-daftar", function (req,res) {
    var bagian = req.query.update;
    var hal = req.query.halaman;
    var field = req.query.field;
    const sql = 'SELECT * FROM '+hal+' WHERE id = "'+field+'"';
        db.query(sql,(err,hal)=>{
            if(err) throw err;
            res.render("admin",{
                name : bagian,
                array: hal,
            });
        });
    
})

app.post("/add-daftar",uploadinfo.single('gambar'), (req,res)=> {
    var hal = req.body.halaman;
    var field = req.body.title;
    const sql = "INSERT INTO "+field+" (id,title,nama,nuptk,jk,nip,status,jenis,agama) VALUES ('','"+field+"', '"+req.body.nama+"','"+req.body.nuptk+"','"+req.body.jk+"','"+req.body.nip+"','"+req.body.status+"', '"+req.body.jenis+"', '"+req.body.agama+"')";
    db.query(sql,(err)=>{
        if(err)throw err;
    })
        res.redirect('/admin?name='+field+'&bagian=admin-daftar');  
    });

app.post("/admin-daftar",function (req,res) {
    var hal = req.body.halaman;
    var field = req.body.title;
    const sql = 'UPDATE '+field+' SET nama ="'+req.body.nama+'", nuptk ="'+req.body.nuptk+'", jk ="'+req.body.jk+'", nip ="'+req.body.nip+'", status ="'+req.body.status+'", jenis ="'+req.body.jenis+'", agama ="'+req.body.agama+'" WHERE id ="'+hal+'"';
    db.query(sql,(err)=>{
        if(err)throw err;
    })
        res.redirect('/admin?name='+field+'&bagian=admin-daftar');
        
    });




let port = process.env.PORT;
let host = '0.0.0.0';
if (port == null || port == "") {
  port = 3000;
}
app.listen(port,host,()=> {
    console.log("working at port 3000");
})
