const  express =require("express");

const{
    createUser,
    getAllUsers,
    getUserInfoByID,
}=
 require("../controllers/user.controller.js") ;

const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/").post(createUser);
router.route("/:id").get(getUserInfoByID);

module.exports= router;