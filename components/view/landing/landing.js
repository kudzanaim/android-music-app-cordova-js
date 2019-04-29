const Landing = {
    // Splash Screen
    SplashScreen: function(){
        // Load the splash Screen then render Page
        let splash = splashSVG();
        $("body").append(splash);

        // Load Landing background
        $("body").addClass("body_main_");
        
        // load landing after 3seconds
        setTimeout(() => {
            $(".splashpage_").remove();
            Landing.render();
        }, 4000);

    },
    // Render Landing
    render: function(){
       try {
            // Ensure App Root isnt Visible
            // $(".App_Root").css("display", "none");
            
            // Add Background Class to Body
            $("body").addClass("body_main_");
            $(".app_body_").html("");

            // Markup
            let markup = Landing.markup();
            
            // Append to Body
            $("body").append(markup)
       } catch (error) {
           alert(error.message)
       }
    },
    // Render Sign Up
    render_signup: function(){
        // Close Sign in
        $(".body_main_container_").remove();

        // Get Markup
        let markup  = Landing.registerPage();

        // Set  listener for login type selector
        window.fieldListener = Landing.logtype_listener()

        return $("body").append(markup)
    },
    // Render Login
    renderlgn:function(){
        // Close Sign in
        $(".body_main_container_").remove();

        // Get Markup
        let markup  = Landing.signInmarkup();

        return $("body").append(markup)
    },
    cls:function(){
        // Render Home
        let markup = Landing.markup();
        // Append to Body
        $("body").append(markup);

        // Slide Page Out
        $(".sign_lgn_backg_cont").addClass("closepage").removeClass("landingpagefx ");
        
        // Close Page
        setTimeout(()=>{
            $(".sign_lgn_backg_cont").addClass("closepage");
            $(".sign_lgn_backg_cont").remove()
        },230)
        

    },
    // Page Markup
    markup:function(){
        let output = `
            <div class="body_main_container_">

                <article class="logoMain_mobile">
                    <img class="logomain_item_mobile" src="assets/icon/logo.png" onclick="nav_logo_click()">
                </article>

                <p class="homeDesc_">
                    <i>Music for<br/>everyone.</i>
                </p>
                <p class="homeDesc_small">
                    Discover your favourite artists & keep up with<br/>the latest releases.
                </p>
                
                <div class="btn_lndg_cont">
                    <a class="homme_btn_cont">
                        <button class="download_app_btn ripple" onclick="signup()">Register Account</button>
                    </a>
                    <a class="homme_btn_cont">
                        <button class="web_app_btn ripple" onclick="signin()">Sign In</button>
                    </a>
                </div>
                <div class="reg_here_mobile">Forgot Password?<a onclick="" class="reg_here_link">Click here.</a></div>
                
            </div>
        `;
        return output
    },
    // Sign In Page markup
    signInmarkup:function(){
        let output  = `
            <div class="sign_lgn_backg_cont _loginform_ landingpagefx">
                <div class="_loginform_cont_p">
                    
                    <h1 class="reg_user_hdr_land1_">Sign In</h1>
                    
                    <div class="explain_page_">Sign into your Account below.</div>
                        
                        <div class="reguser_form_cornt_webapp">
                            <input value="kudzmurefu@gmail.com" type="email" class="reguserfrm_webapp usr_lgn_" placeholder="Username" required>
                            <input value="Computer9900" type="password" class="reguserfrm_webapp pss_lgn_" placeholder="Password" required>
                        </div>
                        
                        <div class="btn_container_reguser_webapp">
                            <button class="sign_btn_reguser_login _loginbtn_ ripple" onclick="lg_n()">Sign In</button>
                        </div> 
                        
                        <button class="cls_sgn_lgn" onclick="backtolanding()">Back</button>

                    </div>
            </div>
        `;
        return output
    },
    // Register page Markup
    registerPage: function(){
        let country_list = Lib.country_list();
        let output  = `
            <div class="sign_lgn_backg_cont landingpagefx">
                
                <div class="registeruser_cont_">
                    
                    <h1 class="reg_user_hdr_land1_">Sign Up</h1>
                    <div class="explain_page_">Register below to Create Account.</div>
                    
                    <div style="padding-top: 0;" class="reguser_form_cornt_webapp">
                        <input value="cirroiwowedewd" class="reguserfrm_webapp first_sgnup" placeholder="Username" required>
                        <input value="ediedede" type="password" class="reguserfrm_webapp lastnme_sgnup" placeholder="Password" required>
                        <select class="loginWith_type_ reguserfrm_webapp loginWith_type_selector" type="contactSelector">
                            <option value="">Login with Email or Phone</option>
                            <option value="Email">Email</option>
                            <option value="Phone">Phone</option>
                        </select>

                        <input value="eideoidd@gmail.com" type="email" class="reguserfrm_webapp email_userreg_landing" placeholder="Email" required>
                        <input value="12896774349" type="tel" class="reguserfrm_webapp phone_userreg_landing" placeholder="Phone" required>

                        <input value="2019-04-11" type="date" class="reguserfrm_webapp date_sgnup_" placeholder="Birthday" required>
                        <input value="12896774349" type="tel" class="reguserfrm_webapp cellphone_sgnup" placeholder="Cell Phone e.g. (77-843-3245)" required>
                        <div class="reguser_city_country_">
                            `+country_list+`
                            <input value="harare" class="reguserfrm_webapp city_signup" placeholder="City/Town" required>
                        </div>
                        <input value="deueideudeuided" class="reguserfrm_webapp streetAddress_signup" placeholder="Street Address" required>
                        
                        <select class="gender_ loginWith_type_ reguserfrm_webapp ">
                            <option value="">Gender</option>
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                        </select>
                    </div>
                    <div class="btn_container_reguser_webapp">
                        <button class="sign_btn_reguser_login ripple" onclick="sgn()">Create</button>
                    </div> 
                    <button class="cls_sgn_lgn" onclick="backtolanding()">Back</button>
                </div>
            </div>
        `;

        return output
    },
    // Form Listener
    logtype_listener:function(){
        return setInterval(function(){
            if($(".loginWith_type_").val() != ""){
                // Clear Listener && Get Value of field
                clearInterval(fieldListener)
                let value = $(".loginWith_type_").val()

                // Open selected Login Type
                switch(value){
                    case "Email":
                        return $(".email_userreg_landing").css("display","block"), $(".loginWith_type_selector").css("display", "none")
                    case "Phone":
                        return $(".phone_userreg_landing").css("display","block"), $(".loginWith_type_selector").css("display", "none")
                }
            }
        },100)
    },
    // Proceed to Register the User
    registerUser:function(){
        try {
            //  Determine login type
            let login_type = ( $(".registeruser_cont_").find(".email_userreg_landing").css("display") == "block"  ) ? "Email": "Phone";
            let email = (login_type == "Email") ? $(".email_userreg_landing").val() : ``+$(".phone_userreg_landing").val()+`@strma.com`;
            
            // Get For Data
            let user_data = {
                data:{
                    usr: $(".first_sgnup").val(),
                    email:email,
                    paswrd: $(".lastnme_sgnup").val(),
                    gender: $(".gender_").val(),
                    lgn_typ: login_type,
                    lgn: $(".email_userreg_landing").val() || $(".phone_userreg_landing").val(),
                    dob: $(".date_sgnup_").val(),
                    cll: $(".cellphone_sgnup").val(),
                    adrs: {
                        ntn: $(".country_origin_").val(),
                        cty: $(".city_signup").val(),
                        stAd: $(".streetAddress_signup").val(),
                    },
                },
                type: "reg"
            }

            // send to server and login user
            let url = "https://us-central1-strmamedia.cloudfunctions.net/user_auth";
            $.post(url, user_data, function(data, status){
                if(data.message == "Successful"){

                    // Change lgn State
                    State.lgn_sts = true;

                    // Append Spinner
                    $("body").append(` <div class="spinner_container"><div class="mk-spinner-centered mk-spinner-ring"></div>
                    <div class="spin_text">Retrieving Playlists...</div></div>`);

                    
                    // Remove Spinner and Append Users Login Details
                    $(".spinner_container").remove();

                    // Log User and Create fileSystem
                    let user = data.usr;        let userEmail = user.eml;           let password = user.pss;
                    Landing.logUserIn(userEmail, password);  
                }
            })
            // Error Callback
            .catch(function error(){
                return alert("Error Registering Account!")
            });

        } catch (e) {
            alert(e.message)
        }
    },
    // User Log In
    signUserIn:function(_email_, _password_){
        try {
            // Vals
            let eml_ = ( _email_ != undefined)? _email_:$(".usr_lgn_").val(); let pss_ = ( _password_!= undefined)? _password_:$(".pss_lgn_").val();

            // Log user in
            m_.auth().signInWithEmailAndPassword(eml_, pss_).then(()=>{
                Landing.logUserIn( eml_, pss_);
            })
            // Handle Login Errors
            .catch(error=>{
                // Error Types
                let errorType = { pasword_err: "auth/wrong-password", no_user_found: "auth/user-not-found", invalid_email: "auth/invalid-email"};

                // Alert message to user
                switch(error.code){
                    case errorType.pasword_err:
                        // Remove Past error message
                        $(".pass_err").remove();    $(".user_err").remove();    $(".email_err").remove();

                        return $(".pss_lgn_").css({"border": "solid 2px #d0c221","background": "#eaeaea"}), 
                            $(".reguser_form_cornt_webapp").append(`<div class="auth_error pass_err">Oops! invalid password</div>`)
                    
                    case errorType.invalid_email:
                        // Remove Past error message
                        $(".email_err").remove();   $(".user_err").remove();    $(".user_err").remove();

                        return $(".usr_lgn_").css({"border": "solid 2px #d0c221","background": "#eaeaea"}), 
                            $(`<div class="auth_error email_err">Oops! Invalid Email/Username</div>`).insertAfter(".usr_lgn_")
                        
                    case errorType.no_user_found:
                        // Remove Past error message
                        $(".user_err").remove();        $(".email_err").remove();           $(".pass_err").remove();

                        return $(".pss_lgn_").css({"border": "solid 2px #d0c221","background": "#eaeaea"}), 
                            $(".usr_lgn_").css({"border": "solid 2px #d0c221","background": "#eaeaea"}), 
                            $(`<div class="auth_error user_err">Oops! No matching User Found!</div>`).insertAfter(".reguser_form_cornt_webapp")
                }
            });
        } catch (e) {
            alert(e.message)
        }
    },
    // Validate Registration Values
    validateRegistrationValues:function(type){
        try {
            // Validation no Empty Fields
            if(type == "rg"){
                if( $(".first_sgnup").val() != "" && $(".lastnme_sgnup").val() != "" && $(".date_sgnup_").val() != "" && $(".cellphone_sgnup").val() != "" && $(".country_origin_").val() != "" && $(".city_signup").val() != "" &&  $(".streetAddress_signup").val() != "" &&  $(".gender_").val() != ""){ 
                    // Remove any errors
                    $(".auth_error").remove();

                    // if either email || phone is selected as logn type
                    if(  $(".email_userreg_landing").val() != "" || $(".phone_userreg_landing").val() != ""  ){
                        
                        // Remove Any Auth Error Messages
                        $(".auth_error").remove()
                        
                        // Validation Rules
                        let email_val = /^.+@[^\.].*\.[a-z]{2,}$/;      let username_val = /[0-9a-zA-Z]{6,}/;    let pass_val = /[0-9a-zA-Z]{6,}/;   let phone_val = /[0-9]{11}$/;  let val_state = 0; // 3/3 for success

                        // Validate Username
                        if(username_val.test( $(".first_sgnup").val()  )){  val_state++ }  else{  $(`<div class="auth_error">Username must be atleast 6 chracters</div>`).insertAfter(".first_sgnup");  $(".first_sgnup").addClass("field_incomplete")   }; // Username
                        
                        // Validate Password
                        if(username_val.test( $(".lastnme_sgnup").val()  )){  val_state++ }  else{  $(`<div class="auth_error">Password must be atleast 6 chracters</div>`).insertAfter(".lastnme_sgnup");  $(".lastnme_sgnup").addClass("field_incomplete")   }; // Username
                        
                        // Validate second number
                        if( phone_val.test( $(".cellphone_sgnup").val() )){ val_state++ } else {  $(`<div class="auth_error">Telephone should have 11 digits!</div>`).insertAfter(".cellphone_sgnup");   $(".cellphone_sgnup").addClass("field_incomplete")  }  //Cellphone
                        
                        // Validite Email
                        if($(".email_userreg_landing").css("display") != "none"){
                            if(email_val.test( $(".email_userreg_landing").val() )){  val_state++ }  else{  $(`<div class="auth_error">Incorrect Email Format</div>`).insertAfter(".email_userreg_landing");  $(".email_userreg_landing").addClass("field_incomplete")   }; // Email
                        }
                        // Validate Phone
                        else if(    $(".phone_userreg_landing").css("display") != "none"    ){
                            if(phone_val.test(   $(".phone_userreg_landing").val()   )){  val_state++ }  else{  $(`<div class="auth_error">Telephone should have 11 digits!</div>`).insertAfter(".phone_userreg_landing");  $(".phone_userreg_landing").addClass("field_incomplete")  }; // Phone
                        };
                        console.clear()
                        console.log(val_state)

                        // Success the Proceed
                        if(val_state == 4){
                            return Landing.registerUser()
                        }
                        else{
                        }
                    }else{
                        // if Email missing
                        if(  $(".phone_userreg_landing").val() == "" && $(".email_userreg_landing").css("display") == "none" ){
                            // Highlight form && Alert User
                            $(".phone_userreg_landing").addClass("field_incomplete");
                            $(`<div class="auth_error">Phone number missing!</div>`).insertAfter(".phone_userreg_landing")
                        }
                        // if Phone missing
                        else if(  $(".email_userreg_landing").val()  == "" && $(".phone_userreg_landing").css("display") == "none" ){
                            // Highlight form && Alert User
                            $(".email_userreg_landing").addClass("field_incomplete");
                            $(`<div class="auth_error">Email number missing!</div>`).insertAfter(".email_userreg_landing")
                        }
                    }
                }
                else{
                    $(`<div class="auth_error">Missing Information! Please ensure all fields have been filled.</div>`).insertAfter(".reguser_form_cornt_webapp")
                    // return alert("Missing Information! Please ensure all fields have been filled.")
                }
            }
            else if( type == "lgn"){
                if(     $(".usr_lgn_").val() != "" && $(".pss_lgn_").val() != "" && $(".usr_lgn_").val().includes("@") == true  && $(".usr_lgn_").val().includes(".") == true  ){
                    return Lib.signUserIn()
                }else{
                    return alert("Your email is not in correct format!")
                }
            }
        } catch (e) {
            alert(e.message)
        }
    },
    // Get User Database
    logUserIn: function(emailFromForm, passwordFromForm){
        try {
            // Collect User Login Email && Password
            let user_login_data = {email: emailFromForm, password: passwordFromForm };

            // Get User Account in DB
            m_.database().ref("Users").orderByChild("accountname").startAt(user_login_data.email).endAt(user_login_data.email+"\uf8ff").once("child_added", (snap)=>{
                // Match account with same password
                if( snap.child("AccountDetails/password").val()  == user_login_data.password ){
                  
                    // Remove Home Page
                    $(".sign_lgn_backg_cont").remove();
                    // Remove login Class from Body Element
                    $("body").removeClass("body_main_");
                    sys_operations.getUserDataFromDatabase(snap.val(), snap.key);
                }
            })     
        } catch (e) {
            alert(e.message)
        }    
    }
}

// Render Login Page
const signin = function(){
    return Landing.renderlgn()
}
// Render Sign Up
const signup = function(){
    return Landing.render_signup()
}
// Back Button
const backtolanding = function(){
    return Landing.cls()
}
// reg finish
const sgn = function(){
    return Landing.validateRegistrationValues("rg")
}
// finish lgn
const lg_n = function(){
    return Landing.signUserIn()
}