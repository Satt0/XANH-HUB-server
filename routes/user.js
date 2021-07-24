const route = require("express").Router({ mergeParams: true });
const { logInUser,signUpUser } = require("../database/queries/user");
const { signToken } = require("../authen");
route.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await logInUser({ username, password });
    if(!user.err){
        return res.json({ user, jwt: signToken({ user }) });
    }
    throw new Error(user.err)
  } catch (e) {
    next(e);
  }
});
route.post('/signup',async(req,res,next)=>{
  try{
        const {username,password,email}=req.body
        return res.json(await signUpUser({username,password,email}))
  }catch(e){
    next(e)
  }
})
module.exports = route;
