const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database");

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));

const session = require("express-session");

app.use(session({
  secret: "crudsecret",
  resave: false,
  saveUninitialized: true
}));

// Guardar nuevo usuario
app.post("/new", (req, res) => {
  const { name, email } = req.body;
  db.run("INSERT INTO users (name, email) VALUES (?, ?)", [name, email], () => {
    req.session.message = { type: "success", text: "Usuario guardado correctamente." };
    res.redirect("/");
  });
});

// Actualizar usuario
app.post("/edit/:id", (req, res) => {
  const { name, email } = req.body;
  db.run("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, req.params.id], () => {
    req.session.message = { type: "info", text: "Usuario actualizado." };
    res.redirect("/");
  });
});


// Middleware para pasar el mensaje a la vista
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// 🔹 Mostrar todos los usuarios
app.get("/", (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) throw err;
    res.render("index", { users: rows });
  });
});

// 🔹 Formulario para nuevo usuario
app.get("/new", (req, res) => {
  res.render("new");
});

// 🔹 Eliminar usuario
app.get("/delete/:id", (req, res) => {
  db.run("DELETE FROM users WHERE id = ?", [req.params.id], () => {
    res.redirect("/");
  });
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
