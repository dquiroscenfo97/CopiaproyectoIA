//Utilizar express
const express = require('express');
const conectarDB = require('../modelos/conexion.js');
conectarDB();
const app = express();

const path = require('path');

app.set('views', path.join(__dirname,'views'));
app.engine('html',require('ejs').renderFile);
app.set('view engine','ejs');

//Configuración del bodyparser --> Esto es para almacenar la información que escribe el usuario en los formularios dentro del servidor

const bodyparser = require('body-parser');
app.use(bodyparser.json());//Formato tipo json
app.use(bodyparser.urlencoded({extended:false}));//Formato tipo url encoded


//Archivos estáticos --> Esto es para identificar que dentro de la carpeta public están los archivos que aportan forma a las views.
app.use(express.static(path.join(__dirname,'public')));


//Encender el servidor
app.listen(3000,()=>{
    console.log("Se conecto el puerto");
})

//***Rutas***

// views/General
app.get('/',(req,res)=>{
    res.render("General/index.html");
})

app.get('/inicioSesion',(req,res)=>{
    res.render("General/inicioSesion.html");
})

app.get('/Registro',(req,res)=>{
    res.render("General/Registro.html");
})

//views/Administradores

app.get('/EmprendimientosAdmin',(req,res)=>{
    res.render("Administradores/EmprendimientosAdmin.html");
})

app.get('/OfertasAdmin',(req,res)=>{
    res.render("Administradores/OfertasAdmin.html");
})

app.get('/panelAdmin',(req,res)=>{
    res.render("Administradores/panelAdmin.html");
})

app.get('/publicacionesAdmin',(req,res)=>{
    res.render("Administradores/publicacionesAdmin.html");
})

app.get('/ReportesAdmin',(req,res)=>{
    res.render("Administradores/ReportesAdmin.html");
})

app.get('/transporteadmin',(req,res)=>{
    res.render("Administradores/transporteadmin.html");
})

//views/Usuarios

app.get('/envioReportes',(req,res)=>{
    res.render("Usuarios/envioReportes.html");
})

app.get('/ofertas',(req,res)=>{
    res.render("Usuarios/ofertas.html");
})

app.get('/perfil',(req,res)=>{
    res.render("Usuarios/perfil.html");
})

app.get('/publicaciones',(req,res)=>{
    res.render("Usuarios/publicaciones.html");
})

app.get('/transporte',(req,res)=>{
    res.render("Usuarios/transporte.html");
})

//views/Emprendedores

app.get('/RegistroEmprendimiento',(req,res)=>{
    res.render("Emprendedores/RegistroEmprendimiento.html");
})

//***Metodo POST***
//Transporte
const importTransportModel = require('../modelos/transporte.js')

app.post('/addRoutesInformation',(req,res)=>{
    //Obtener la información que escribe el usuario
    let transportData = new importTransportModel({
        routeName: req.body.routeName,
        transportTime: req.body.transportTime,
        transportDestination: req.body.transportDestination,
        transportFrecuency: req.body.transportFrecuency,
        transportFee: req.body.transportFee,
        tripDuration: req.body.tripDuration
    })
    //Almacenar los datos
    transportData.save()
    .then(()=>{
        console.log("Ruta configurada")
    })
    .catch((err)=>{
        console.log("Error al configurar la ruta", err)
    })
    //Renderizar
    res.redirect('/transporteadmin')
})
//Reportes
app.post('/addReport',(req,res)=>{
    console.log(req.body.reportTitle);
    console.log(req.body.reportDescription);
    console.log(req.body.communityLocation);
    res.redirect('/envioReportes')
    //Preguntar a la profe si acá se pone el de cargar archivo
})

app.post('/LoginSite',(req,res)=>{
    console.log(req.body.email);
    console.log(req.body.password);
    console.log(req.body.communityLocation);
    res.redirect('/')
})

app.post('/addBusiness',(req,res)=>{
    console.log(req.body.businessName);
    console.log(req.body.businessDescription);
    console.log(req.body.communityTelephone);
    console.log(req.body.email);
    console.log(req.body.businessLocation);
    res.redirect('/RegistroEmprendimiento')
})


