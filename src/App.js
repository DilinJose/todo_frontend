import { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./App.css";
import axios from "axios";

function App() {
  const [notes, setNotes] = useState([]);
  const [editInitialValues, setEditInitialValues] = useState(null);

  const fetchData = async () => {
    await axios.get("http://192.168.0.54:8050/todo/").then((response) => {
      setNotes(response.data.todo);
    });
  };
  const fetchDataById = async (id) => {
    await axios.get(`http://192.168.0.54:8050/todo/${id}`).then((response) => {
      setEditInitialValues(response.data.todo);
    });
  };
  const postData = async (data) => {
    try {
      await axios.post("http://192.168.0.54:8050/todo/", data);
    } catch (err) {
      console.log("err :>> ", err);
    }
  };

  const editData = async (id, data) => {
    try {
      await axios.put(`http://192.168.0.54:8050/todo/${id}`, data);
    } catch (err) {
      console.log("err :>> ", err);
    }
  };
  const deleteData = async (id) => {
    try {
      await axios.delete(`http://192.168.0.54:8050/todo/${id}`);
    } catch (err) {
      console.log("err :>> ", err);
    }
  };

  useEffect(() => {
    // setInterval(() => {
    fetchData();
    // }, 5000);
  }, []);

  const handleSubmit = (values) => {
    // e.preventDefault();
    postData(values);
    fetchData();
  };

  const handleDelete = (id) => {
    deleteData(id);
    fetchData();
  };
  const handleEdit = (id) => {
    fetchDataById(id);

    fetchData();
  };

  console.log("editInitialValues :>> ", editInitialValues);

  const initialValues = editInitialValues
    ? editInitialValues
    : { title: "", desc: "" };

  return (
    <div className="App">
      <div className="todo form d-flex justify-content-center align-items-center flex-column">
        {" "}
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object({
            title: Yup.string()
              .max(15, "Must be 15 characters or less")
              .required("Required"),
            desc: Yup.string()
              .max(20, "Must be 20 characters or less")
              .required("Required"),
          })}
          onSubmit={(values, { resetForm }) => {
            setTimeout(() => {
              handleSubmit(values);
            }, 400);
            resetForm();
          }}
        >
          <Form>
            <div className="d-flex justify-content-center align-items-center bg-light text-dark p-5">
              <div className="">
                <label className="form-label" htmlFor="title">
                  Title
                </label>
                <Field className="form-control" name="title" type="text" />
                <ErrorMessage name="title" />
              </div>
              <div className="m-3">
                <label className="form-label" htmlFor="desc">
                  Description
                </label>
                <Field className="form-control" name="desc" type="text" />
                <ErrorMessage name="desc" />
              </div>
              <div className="mt-4">
                <button className="btn btn-primary" type="submit">
                  Submit
                </button>
              </div>
            </div>
          </Form>
        </Formik>
        <div
          className="d-flex justify-content-center align-items-center flex-column p-5"
          style={{
            width: "50%",
            backgroundColor: "beige",
          }}
        >
          <h4>Todo List</h4>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {notes &&
                notes.map(({ _id, title, desc }) => {
                  return (
                    <tr>
                      <td className="pe-3 ps-3">{title}</td>
                      <td className="pe-3 ps-3">{desc}</td>
                      <button
                        className="btn btn-success btn-sm pe-3 ps-3 ms-3"
                        onClick={() => handleEdit(_id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm pe-3 ps-3 ms-3"
                        onClick={() => handleDelete(_id)}
                      >
                        Delete
                      </button>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
