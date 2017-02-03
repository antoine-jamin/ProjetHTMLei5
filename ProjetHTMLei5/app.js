/*  Variable pour utiliser les dépendances  */
var express = require('express');
var app = express();
var ejs = require('ejs');
var bodyParser = require("body-parser");
var XLSX = require('xlsx');
//File uploade
var fileUpload = require('express-fileupload');
var multer = require('multer');

var NombreData = 4;
var NombreDataMoy = 3;
/*  Methode pour utliser les posts  */
app.use(bodyParser.urlencoded({ extended: true }));

/*  Méthode pour utiliser le css  */
app.use(express.static(__dirname + '/public'));

/* Méthode pour upload le fichier */
app.use(fileUpload());

// set the view engine to ejs
app.set('view engine', 'ejs');

/*  URL */
//  Page d'accueil
app.get('/', function (req, res) {
    res.render("pages/index.ejs"); 
});

// Zone téléchargement des feuilles de style
app.get('/download', function(req,res){
    res.render("pages/download.ejs");
});

app.get('/liste', function (req, res) {
    //res.render("pages/index.ejs");
    try{
        var workbook = XLSX.readFile('public/uploads/patients.xlsx');
    }catch(err){
        var all_sheet = false;
        res.render("pages/listes.ejs",{all_sheet}); 
    }
    
    // Récupèrer tous les sheets
    var all_sheet = workbook.SheetNames;
    console.log(all_sheet);
    res.render("pages/listes.ejs",{all_sheet}); 
});

app.get('/patients/:num', function (req, res) {
    var num = req.params.num;
    console.log(num);
    //res.render("pages/index.ejs");
    var workbook = XLSX.readFile('patients.xlsx');

    // Récupèrer tous les sheets
    var all_sheet = workbook.SheetNames;
    //console.log(all_sheet);
    var nombre_sheet = all_sheet.length;

    // Récupère le patient 1
    var patient1_data = workbook.Sheets[num];

    // pour 4 entrées de tableau
    var data_jour = {"dA":0,"dB":0,"dC":0,"dD":0,"dPam":0,"dPincee":0};
    var i =0;
    var y =0;
    var patient1 = [];
    var valeur = {"pam_moyenne":0,"pince_moyenne":0,"patients":null};

    // Récupèrer le patient 1
    for (data in patient1_data) {
        if(y%NombreData==0)var data_jour = {"dA":0,"dB":0,"dC":0,"dD":0,"dPam":0,"dPincee":0};
        //console.log(data_jour);

        if(data[0] === '!')continue;
        if(data[1] === '1' && i<NombreData){
            //console.log(data + "=" + JSON.stringify(patient1_data[data].v));
            //console.log(i);
            if(data[0] === 'A'){data_jour.dA=patient1_data[data].v;};
            if(data[0] === 'B'){data_jour.dB=patient1_data[data].v;};
            if(data[0] === 'C'){data_jour.dC=patient1_data[data].v;};
            if(data[0] === 'D'){
                data_jour.dD=patient1_data[data].v;
                data_jour.dPam="PAM";
                data_jour.dPincee="Pincee";
                patient1.push(data_jour);
                //console.log(patient1);
            };
            i++;    
        }
        else{
            if(data[0] === 'A'){data_jour.dA=patient1_data[data].w;};
            if(data[0] === 'B'){data_jour.dB=patient1_data[data].v;};
            if(data[0] === 'C'){data_jour.dC=patient1_data[data].v;};
            if(data[0] === 'D'){
                data_jour.dD=patient1_data[data].v;
                data_jour.dPam = ((data_jour.dC + 2 * data_jour.dD) /3).toFixed(1);
                data_jour.dPincee = data_jour.dC - data_jour.dD;
                patient1.push(data_jour);
                //console.log(patient1);

                valeur.pam_moyenne = parseInt(valeur.pam_moyenne) + parseInt(data_jour.dPam);
                valeur.pince_moyenne = parseInt(valeur.pince_moyenne) + parseInt(data_jour.dPincee);
                console.log(valeur.pam_moyenne);
            };        
        }
        y++;
    }

    valeur.pam_moyenne = (parseFloat(valeur.pam_moyenne / patient1.length)).toFixed(1);
    valeur.pince_moyenne = (parseFloat(valeur.pince_moyenne / patient1.length)).toFixed(1);
    valeur.patients = patient1;

    console.log(valeur);

    res.render("pages/patients.ejs",{valeur});
    
});

app.get('/moyenne', function (req, res) {
 //res.render("pages/index.ejs");
    var workbook = XLSX.readFile('eleves.xlsx');

    // Récupèrer tous les sheets
    var all_sheet = workbook.SheetNames;
    //console.log(all_sheet);
    var nombre_sheet = all_sheet.length;

    // Récupère le patient 1
    var sheet_name_list = workbook.SheetNames;
    var moyenne_data = workbook.Sheets[sheet_name_list[0]];

    // pour 4 entrées de tableau
    var data_jour = {"dA":0,"dB":0,"dC":0};
    var i =0;
    var y =0;
    var moyenne = [];

    var valeur = {"ecart_type":0,"moyenne_classe":0,"eleves":null};
    // Récupèrer le patient 1
    for (data in moyenne_data) {
        if(y%NombreDataMoy==0)var data_jour = {"dA":0,"dB":0,"dC":0};
        //console.log(data_jour);

        if(data[0] === '!')continue;
        if(data[1] === '1' && i<NombreData){
            //console.log(data + "=" + JSON.stringify(patient1_data[data].v));
            //console.log(i);
            if(data[0] === 'A'){data_jour.dA=moyenne_data[data].v;};
            if(data[0] === 'B'){data_jour.dB=moyenne_data[data].v;};
            if(data[0] === 'C'){
                data_jour.dC=moyenne_data[data].v;
                moyenne.push(data_jour);
                //console.log(patient1);
            };
            i++;    
        }
        else{
            if(data[0] === 'A'){data_jour.dA=moyenne_data[data].w;};
            if(data[0] === 'B'){data_jour.dB=moyenne_data[data].v;};
            if(data[0] === 'C'){
                data_jour.dC=moyenne_data[data].v;
                moyenne.push(data_jour);
                //console.log(patient1);
            };        
        }
        y++;
    }
    valeur.eleves = moyenne;
    console.log(valeur);

    res.render("pages/moyenne.ejs",{valeur});
}); 


//Upload, action POST
var upload = multer( { dest: './public/uploads/'  } );
app.post( '/upload', upload.single( 'file' ), function( req, res, next ) {
  // Metadata about the uploaded file can now be found in req.file
  //console.log(req.files.file.name);
  var sampleFile;
 
  if (!req.files) {
    res.send('No files were uploaded.');
    return;
  }
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
  sampleFile = req.files.file;
  // Use the mv() method to place the file somewhere on your server 
  sampleFile.mv('./public/uploads/'+ 'patients.xlsx', function(err) {
    if (err) {
      res.status(500).send(err);
    }
    else {
        console.log('File uploaded');
    }
  });  
   res.render('pages/uploaded');
});


// Démarrer le serveur
app.listen(3000);