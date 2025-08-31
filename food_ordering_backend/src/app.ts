import express from "express"
import dotenv from "dotenv"
import CompositionRoot from "./composition_root";
import morgan from "morgan";

dotenv.config()

const PORT = process.env.PORT ?? 3000;
const app = express()

app.use(morgan("combined"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
CompositionRoot.configure()
app.use("/auth", CompositionRoot.authRouter())

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))