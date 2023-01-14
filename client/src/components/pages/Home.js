import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/Context";
import "./home.css";
import { toast } from "react-toastify";
import {
  getTodosList,
  addTodo,
  todoTaskComplete,
  deleteTodo,
  deleteUser,
} from "../../services/api";

const Home = () => {
  const [state, setState] = useContext(UserContext);

  const [todo, setTodo] = useState("");
  //const [task, setTask] = useState(false);

  useEffect(() => {
    loadtodolist();
  }, []);

  /* submit Todo */
  const handleAddTodo = async (e) => {
    e.preventDefault();
    try {
      if (!todo) {
        toast.error("Enter Todo");
        return;
      }

      const { data } = await addTodo(todo);
      if (data.status !== "ok") {
        toast.error(data.error);
        return;
      }
      await loadtodolist();
      setTodo("");
      toast.success(data.message);
    } catch (err) {
      console.log(err);
    }
  };

  /* enter key to submit data */
  const handleKeyPress = async (e) => {
    if (e.key === "Enter") {
      await handleAddTodo(e);
    }
  };

  /* get todo list */

  const loadtodolist = async () => {
    try {
      const { data } = await getTodosList();
      //console.log(data);
      let auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = data.user;
      localStorage.setItem("auth", JSON.stringify(auth));
      //update Context
      setState({ ...state, user: data.user });
    } catch (err) {
      console.log(err);
    }
  };

  /* check list complete task */
  const handleCheck = async (e, id) => {
    try {
      const checkbox = e.target.checked;

      // setTask(checkbox);
      let task = checkbox;

      const { data } = await todoTaskComplete(id, task);
      if (data.status !== "ok") {
        toast.error(data.error);
        return;
      }

      await loadtodolist();
      toast.success(data.message);
    } catch (err) {
      console.log(err);
    }
  };

  /* delete todo */
  const handleDelete = async (id) => {
    try {
      if (!id) {
        return;
      }

      const { data } = await deleteTodo(id);
      if (data.status !== "ok") {
        toast.error(data.error);
        return;
      }
      await loadtodolist();
      toast.success(data.message);
    } catch (err) {
      console.log(err);
    }
  };

  /* account delete */
  const handleDeleteUser = async () => {
    try {
      if (window.confirm("Are you sure you want to Logout ?")) {
        const { data } = await deleteUser();
        if (data.status !== "ok") {
          toast.error(data.error);
          return;
        }
        window.localStorage.removeItem("auth");
        setState(null);
        toast.success(data.message);
        window.location = "/";
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* user Logout */
  const logout = async () => {
    try {
      if (window.confirm("Are you sure you want to Logout ?")) {
        window.localStorage.removeItem("auth");
        setState(null);
        toast.success("Logout successfully");
        window.location = "/";
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container-fluid m-0 p-0">
      <div className="navbar-container">
        <div className="AppName">
          <span className="">Todos</span>
        </div>
        <div className="User">
          <span className="Username">
            {state && state.user ? state.user.username : "User"}
          </span>
          <span className="logout ms-5 btn btn-danger" onClick={logout}>
            Logout
          </span>
          <span
            className="logout ms-5 btn btn-danger"
            onClick={handleDeleteUser}
          >
            Delete Account
          </span>
        </div>
      </div>

      <div className="body-container">
        <div className="inputBox">
          <form className="form w-100 h-100">
            <div className="input-group mb-3 w-100 h-100">
              <input
                type="text"
                onChange={(e) => setTodo(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e)}
                name="todo"
                id="input"
                value={todo}
                className="form-control"
                placeholder="todos.."
              />
              {/* add todo */}
              <button
                onClick={(e) => handleAddTodo(e)}
                type="submit"
                className="input-group-text btn btn-primary"
              >
                Add
              </button>
            </div>
          </form>
        </div>
        <div className="todoslist">
          {state && state.user && state.user.todos ? (
            <ul className="list-unstyled">
              {state.user.todos
                .sort((a, b) => a - b)
                .map((item, index) => (
                  <li key={item._id}>
                    <div className="list-container ">
                      <div className="sec1">
                        <input
                          className="form-check-input checkBox"
                          type="checkbox"
                          onChange={(e) => handleCheck(e, item._id)}
                          checked={item.task}
                        />
                      </div>
                      <div className="sec2 ">
                        {item.task === true ? (
                          <span className="text" style={{fontWeight:"400"}}>
                            <del >{item.todo}</del>
                          </span>
                        ) : (
                          <span className="text">{item.todo}</span>
                        )}
                      </div>
                      <div
                        className="sec3"
                        onClick={() => handleDelete(item._id)}
                      >
                        <ion-icon name="close-circle-sharp"></ion-icon>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
