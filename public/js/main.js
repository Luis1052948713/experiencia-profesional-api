document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const todosContainer = document.getElementById("todos");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const text = form.text.value.trim();

    if (text) {
      const response = await fetch("/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const result = await response.json();
      if (result.response === "success") {
        form.text.value = "";
        loadTodos(); // Recarga la lista
      } else {
        alert("Error al agregar experiencia");
      }
    }
  });

  async function loadTodos() {
    const response = await fetch("/getall");
    const result = await response.json();
    todosContainer.innerHTML = "";

    result.data.forEach((todo) => {
      const todoItem = document.createElement("div");
      todoItem.className = "todo";
      todoItem.innerHTML = `
        <div class="checkbox-container">
          <input type="checkbox" ${todo.completed ? "checked" : ""}>
        </div>
        <div class="text-container ${todo.completed ? "completed" : ""}">
          ${todo.text}
        </div>
        <div class="actions-container">
          <a href="#" data-id="${todo._id}" class="delete">Eliminar</a>
        </div>
      `;

      // Evento de eliminación
      todoItem.querySelector(".delete").addEventListener("click", async (e) => {
        e.preventDefault();
        const id = e.target.getAttribute("data-id");

        const deleteResponse = await fetch(`/delete/${id}`, {
          method: "DELETE",
        });

        const deleteResult = await deleteResponse.json();
        if (deleteResult.response === "success") {
          loadTodos(); // Recarga la lista después de eliminar
        } else {
          alert("Error al eliminar experiencia");
        }
      });

      todosContainer.appendChild(todoItem);
    });
  }

  loadTodos(); // Cargar al inicio
});
