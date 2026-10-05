

export const isLoggedIn =(req,res,next)=>{
    if(!req.session.user){
        return res.redirect('/login');
    }
    next();
}

export const isAdmin = (req,res,next)=>{
    if(req.session.user.role !== "admin"){
        return res.redirect('/');
    }
    next();
}