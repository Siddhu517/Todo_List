import React, { useState, useEffect } from "react";
import { getData, postData, deleteData, checkDataPost } from "../services/api";
import { toast } from "react-toastify";

export const Main = () => {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [check, setCheck] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (todo) {
      await postData({ todo });
      setTodo("");
      toast.success("Todo added");
      await loadData();
    } else {
      toast.error("Error");
    }
  };

  const handleKeyPress = async (e) => {
    if (e.key === "Enter") {
      await handleSubmit();
    }
  };

  const loadData = async () => {
    const res = await getData();
    setTodos(res.data);
  };

  const handleCheck = async (e, id) => {
    const checkbox = e.target.checked;
    if (checkbox === true) {
      setCheck(false);
      console.log(check);
      await checkDataPost(id, { check });
      toast.success("Task Completed");
      await loadData();
    } else {
      setCheck(true);
      console.log(check);
      await checkDataPost(id, { check });
      toast.error("Task Incomplete");
      await loadData();
    }
  };

  const handleDelete = async (id) => {
    if (id) {
      await deleteData(id);
      toast.error("Todo Deleted");
      await loadData();
    } else {
      toast.error("Error");
    }
  };

  return (
    <div className="container-fluid mt-5">
      <div className="row justify-content-center">
        <div className="col-4 mt-5">
          <form className="form">
            <div className="input-group mb-3">
              <input
                type="text"
                onChange={(e) => setTodo(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e)}
                name="todo"
                value={todo}
                className="form-control"
                placeholder="todos.."
              />
              <button
                onClick={(e) => handleSubmit(e)}
                type="submit"
                className="input-group-text btn btn-primary"
              >
                Add
              </button>
            </div>
          </form>
          {todos.map((item) => (
            <div
              className="col d-flex todo shadow w-auto  h-auto"
              key={item._id}
            >
              <div className="checkbox">
                <div className="form-check">
                  <input
                    onChange={(e) => handleCheck(e, item._id)}
                    className="form-check-input"
                    type="checkbox"
                    value={check}
                  />
                </div>
              </div>
              <div
                className={item.check === true ? "todoText" : "  todoTextHide"}
              >
                {item.todo}
              </div>
              <button
                className="btn button"
                onClick={() => handleDelete(item._id)}
              >
                <ion-icon className="icon" name="close-circle"></ion-icon>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
