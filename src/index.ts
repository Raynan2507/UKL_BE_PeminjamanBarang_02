import Express  from "express";
import userRouter from "./router/userRouter";
import barangRouter from "./router/barangRouter";
import peminjamanRouter from "./router/peminjamanRouter";

const app = Express ();

app.use(Express.json())
app.use(`/user`,userRouter)
app.use(`/barang`,barangRouter)
app.use(`/peminjaman`,peminjamanRouter)

const port = 1975
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
