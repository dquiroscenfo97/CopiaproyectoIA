//Utilizar express
const express = require('express');
const conectarDB = require('../modelos/conexion.js');
const upload = require('../middlewares/uploadimage');
const app = express();

const path = require('path');

conectarDB();

app.set('views', path.join(__dirname,'views'));
app.engine('html',require('ejs').renderFile);
app.set('view engine','ejs');

//Configuración del bodyparser --> Esto es para almacenar la información que escribe el usuario en los formularios dentro del servidor

const bodyparser = require('body-parser');
app.use(bodyparser.json());//Formato tipo json
app.use(bodyparser.urlencoded({extended:false}));//Formato tipo url encoded


//Archivos estáticos --> Esto es para identificar que dentro de la carpeta public están los archivos que aportan forma a las views.
app.use(express.static(path.join(__dirname,'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


//Encender el servidor
app.listen(3000,()=>{
    console.log("Se conecto el puerto");
})

//***Rutas***

//Declarar modelos
const importTransportModel = require('../modelos/transporte.js')
const Business = require('../modelos/emprendimiento.js')

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

app.get('/transporteadmin', async (req, res) => {
  try {
    const rutasRegistradas = await importTransportModel.find();
    res.render('Administradores/transporteadmin', { rutas: rutasRegistradas });
  } catch (error) {
    console.log("Error al cargar rutas:", error);
    res.render('Administradores/transporteadmin', { rutas: [] });
  }
});

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

app.get('/transporte', async (req, res) => {
  try {
    const rutasRegistradas = await importTransportModel.find();
    res.render("Usuarios/transporte", { rutas: rutasRegistradas });
  } catch (error) {
    console.log("Error al cargar rutas:", error);
    res.render("Usuarios/transporte", { rutas: [] });
  }
});





//views/Emprendedores
app.get('/RegistroEmprendimiento', async (req, res) => {
  try {
    const emprendimientos = await Business.find({ aprobado: true });

    // Capturar el parámetro de éxito si existe
    const exito = req.query.exito === 'true';

    // Pasar ambos datos a la vista
    res.render('Emprendedores/RegistroEmprendimiento', {
      emprendimientos,
      exito
    });

  } catch (error) {
    console.error("Error al cargar emprendimientos:", error);
    res.render('Emprendedores/RegistroEmprendimiento', {
      emprendimientos: [],
      exito: false
    });
  }
});


//***Metodo POST***
//Transporte


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
//Ruta post para actualizar rutas
app.post('/updateRoute/:id', async (req, res) => {
  try {
    await importTransportModel.findByIdAndUpdate(req.params.id, {
      routeName: req.body.routeName,
      transportTime: req.body.transportTime,
      transportDestination: req.body.transportDestination,
      transportFrecuency: req.body.transportFrecuency,
      transportFee: req.body.transportFee,
      tripDuration: req.body.tripDuration
    });
    console.log("Ruta actualizada:", req.params.id);
  } catch (err) {
    console.log("Error al actualizar ruta:", err);
  }
  res.redirect('/transporteadmin');
});
//Para eliminar rutas
app.post('/deleteRoute/:id', async (req, res) => {
  try {
    await importTransportModel.findByIdAndDelete(req.params.id);
    console.log("Ruta eliminada:", req.params.id);
  } catch (err) {
    console.log("Error al eliminar ruta:", err);
  }
  res.redirect('/transporteadmin');
});


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


// Ruta POST para registrar emprendimiento
app.post('/addBusiness', upload.single('image'), async (req, res) => {
  try {
    const {
      businessName,
      businessDescription,
      businessTelephone,
      email,
      businessLocation,
      category
    } = req.body;

    const loginDate = new Date();
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newBusiness = new Business({
      businessName,
      businessDescription,
      businessTelephone,
      email,
      businessLocation,
      category,
      loginDate,
      imagePath
    });

    await newBusiness.save();

    // Redirigir al formulario con mensaje de éxito
    res.redirect('/RegistroEmprendimiento?exito=true');

  } catch (error) {
    console.error(error);
    res.status(500).send('Error al registrar el emprendimiento');
  }
});


