const express =require('express')
const dotenv=require('dotenv')
const cors=require('cors')

const connectDB =require("./config/connect.js") ;
const userRouter =require("./routes/user.routes.js") ;
const propertyRouter=require("./routes/property.routes.js");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
    res.send({ message: "" });
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/properties", propertyRouter);
const startServer = async () => {
    try {
        connectDB(process.env.URI);

        app.listen(8080, () =>
            console.log("Server started on port http://localhost:8080"),
        );
    } catch (error) {
        console.log(error);
    }
};

startServer();