var express               = require("express");
var app                   = express();
var methodOverride        = require("method-override");
var passport              = require("passport");
var LocalStrategy         = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var flash                 = require("connect-flash");
var dotenv                = require("dotenv");
var mongoose              = require("mongoose");
var diagnosis             = require("./treatments");

dotenv.config();

mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DATABASEURL, {useNewUrlParser:true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);

var historySchema = new mongoose.Schema({
    date: {type: Date, default: Date.now()},
    diseaseName: String
 });

var History = mongoose.model("History", historySchema);

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    fname: String,
    lname: String,
    contact: String,
    email: String,
    addressl1: String,
    addressl2: String,
    history: [
        historySchema
    ]
});

UserSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User", UserSchema);

app.set("view engine","ejs");
app.use(flash());
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(require("express-session")({
    secret: "This is secret code",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


// Routes

app.get("/",function(req, res){
    res.render("landing");
});

app.get("/home",function(req,res){
    res.render("home");
});

app.get("/guide",function(req,res){
    res.render("guide");
});

app.get("/sign-in",function(req,res){
    res.render("signin");
});

app.post("/sign-in", passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/sign-in",
    successFlash: "You have Sign In successfully.",
    failureFlash: "Invalid username or password."
}) ,function(req, res){
});

app.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You have Log Out Successfully.");
    res.redirect("/home");
});

app.get("/sign-up",function(req,res){
    res.render("signup");
});

app.post("/sign-up", function(req, res){
    User.register(new User({username: req.body.username, fname: req.body.fname, lname: req.body.lname, email: req.body.email, contact: req.body.contact, addressl1: req.body.addressl1, addressl2: req.body.addressl2}), req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            res.redirect("/signup");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "You have registered successfully.");
            res.redirect("/home");
        });
    });
});


app.get("/crop/:cropName",function(req,res){
    res.render("predict_disease");
});

app.get("/diagnosis/:disease",function(req,res){
    res.render("diagnosis",{diagnosis:diagnosis[req.params.disease],dis:req.params.disease.split("_").join(" ")});
    if(req.user){
        History.create({
            diseaseName: req.params.disease
        },function(err, history){
            if(err){
                req.flash("error", "Something Went Wrong, Try Again.")
                res.redirect("back");
            }
            User.findOne({username: req.user.username},function(err, user){
                if(err){
                    req.flash("error", "Something Went Wrong, Try Again.")
                    res.redirect("back");
                }else{
                    user.history.push(history);
                    user.save(function(err, data){
                        if(err){
                            req.flash("error", "Something Went Wrong, Try Again.")
                            res.redirect("back");
                        }
                    });
                }
            });
        });
    }
});


app.get("*",function(req, res)
{
    res.send("Page not found");
});


// Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must be Sign In first.");
    res.redirect("/login");
}


app.listen(process.env.PORT||1000,function()
{
    console.log("Server started on http://localhost:1000/");
});
