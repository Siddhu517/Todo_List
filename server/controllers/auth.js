import Todos from "../models/todos";

export const postData = async (req, res) => {
  const { todo } = req.body;
  try {
    await new Todos({
      todo,
      check: true,
    }).save();
    res.status(200).json({ message: "Success" });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

export const getData = async (req, res) => {
  try {
    const data = await Todos.find({});
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ message: "error" });
  }
};

export const deleteData = async (req, res) => {
  try {
    await Todos.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

export const postDataCheck = async (req, res) => {
  try {
    const { check } = req.body;
    await Todos.findByIdAndUpdate(req.params.id, { check: check });
    res.status(200).json({ message: "OK" });
  } catch (err) {
    res.status(200).json({ message: "error" });
  }
};
