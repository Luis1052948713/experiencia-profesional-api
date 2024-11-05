const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

// Corregir el uso de bodyParser
app.use(bodyParser.json()); // Agregar paréntesis para llamar a la función
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

mongoose
  .connect("mongodb://localhost:27017/experiencias")
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar con MongoDB", err));

// Definir el modelo de datos
const Experiencias = mongoose.model("Experiencias", {
  text: String,
  completed: Boolean,
});

// Ruta principal
// Ruta para agregar una nueva experiencia
app.post("/add", (req, res) => {
  const experiencias = new Experiencias({
    text: req.body.text,
    completed: false,
  });
  experiencias
    .save()
    .then((doc) => {
      console.log("Dato insertado correctamente", doc);
      res.json({ response: "success", data: doc }); // Enviar respuesta consistente
    })
    .catch((err) => {
      console.log("Error al insertar", err.message);
      res.json({ response: "failed", error: err.message });
    });
});

app.get("/getall", (req, res) => {
  Experiencias.find()
    .then((doc) => {
      res.json({ response: "success", data: doc });
    })
    .catch((err) => {
      console.log("error al consultar", err.message);
      res.json({ response: "failed" });
    });
});
app.get("/complete/:id/:status", (req, res) => {
  const id = req.params.id;
  const checked = req.params.status == "true";

  Experiencias.findByIdAndUpdate({ _id: id }, { $set: { completed: checked } })
    .then((doc) => {
      res.json({ response: "success" });
    })
    .catch((err) => {
      console.error("Error al actualizar: ", err.message);
      res.json({ response: "update failed" });
    });
});
app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;

  Experiencias.findByIdAndDelete(id)
    .then((doc) => {
      if (!doc) {
        console.log("No se encontró la experiencia con el id especificado.");
        return res.status(404).json({
          response: "failed",
          message: "No se encontró la experiencia",
        });
      }
      console.log("Experiencia eliminada:", doc);
      res.json({ response: "success", data: doc });
    })
    .catch((err) => {
      console.error("Error al eliminar:", err.message);
      res.status(500).json({ response: "remove failed", error: err.message });
    });
});

app.listen(3000, () => {
  console.log("Servidor listo en el puerto 3000");
});
