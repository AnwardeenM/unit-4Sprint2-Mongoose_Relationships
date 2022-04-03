const express = require("express");

const mongoose = require("mongoose");

const app = express();

app.use(express.json());

const connect = () => {

    mongoose.connect("mongodb+srv://AnwardeenM:anwar1234@cluster0.mnqdo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
};



const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);


const User = mongoose.model("user", userSchema);


const sectionSchema = new mongoose.Schema(
  {
    section_name: { type: String, required: false, default: "general" },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Section = mongoose.model("section", sectionSchema);


const booksSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    check: { type: Boolean, required: false, default: false },
    section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "section",
      required: true,
    },
    auth_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "auth",
        required: true,
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Book = mongoose.model("book", booksSchema);


const authenticationSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    books_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "book",
        required: true,
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Auth = mongoose.model("auth", authenticationSchema);


app.post("/sections", async (req, res) => {
  try {
    const section = await Section.create(req.body);
    return res.status(200).send(section);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.post("/auths", async (req, res) => {
  try {
    const auth = await Auth.create(req.body);
    return res.status(200).send(auth);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.post("/books", async (req, res) => {
  try {
    const book = await Book.create(req.body);
    return res.status(200).send(book);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.put("/auths/:id", async (req, res) => {
  try {
    const auth = await Auth.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { books_id: req.body.bookId } },
      { new: true }
    );
    return res.status(200).send(auth);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

app.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

app.put("/books/:id", async (req, res) => {
  try {
    const book = await Book.findOneAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).send(book);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});


app.get("/books", async (req, res) => {
  try {
    const book = await Book.find({ check: { $eq: true } });
    return res.status(200).send(book);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

app.get("/auths/:id", async (req, res) => {
  try {
    const auth = await Auth.findById(req.params.id).populate({
      path: "books_id",
    });
    return res.status(200).send(auth);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

app.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findMany({

      section_id: { $eq: req.params.id },
    });
    return res.status(200).send(book);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

app.get("/books", async (req, res) => {
  try {
    const book = await Book.find({ check: { $eq: false } });
    return res.status(200).send(book);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

app.get("/auths/:id", async (req, res) => {
  try {
    const auth = await Auth.findById(req.params.id).populate({
      path: "books_id",
    });
    return res.status(200).send(auth);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

app.listen(3000,async()=>{
    try{

        await connect();
        console.log("listening at port 3000") ;

    }catch(error){

        console.log("...something went wrong",error.message)
    }
})