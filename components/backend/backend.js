

const Setting_ = {
    topUp: function(){
        // Get Markup
        let markup = Setting_.topUpPage();
        // Save Settings page
        State.settingsPage = $(".settingsContainer")[0];
        // Clear Page
        $(".settingsContainer").remove();
        
        $("._menu_settings_").append( markup )
        
        // Set input formater
        let cleave = new Cleave('.voucher_input', {
            delimiter: '-',
            blocks: [4, 4, 4, 4]
        });
    },
    topUpPage: function(){
        let output = `
            <div class="topUpPage landingpagefx">
                <div class="topupContentContainer">
                    <div class="fromContainer">
                        <div class="_topupprem_cont_">
                            <h1 class="formHeader">Top Up</h1>
                            <div class="tip_sepRATOR_2"><i>Premium</i></div>
                        </div>
                        <div class="formdescrp">Enter voucher code from your scratch card below.</div>
                        <input class="voucher_input" placeholder="Enter code here">
                        <div class="error_msg_container"></div>
                    </div>
                    <div class="vcher_btn_container">
                        <button class="submitvoucher ripple" onclick="submit_voucher()">Submit</button>
                        <button class="cancelvoucher ripple" onclick="close_mnu()">Cancel</button>
                    </div>
                    <div class="purchaseVoucherLink" onclick="purchaseVoucher()">Buy Top-Up Voucher Here</div>
                </div>
            </div>
        `;
        return output
    },
    // Render purchaseVoucher Page
    purchaseVoucher: function(){
        // Get Markup
        let markup = Setting_.purchaseVoucherMarkup();

        // Clear Page
        $(".topUpPage").remove();

        // Append Page
        $("._menu_settings_").append( markup );

        // Notify User that Online Purchase only for EcoCash
        setTimeout(function(){
            let confirms = confirm("Note: Online voucher purchases are currently only available for EcoCash Wallet users.");
            ( confirms == true)? null:null;
        },3000);

        // Set input formater
        let cleave = new Cleave('.ecocashNumberField', {
            delimiter: '-',
            blocks: [4, 3, 4]
        });

    },
    // purchaseVoucherMarkup
    purchaseVoucherMarkup: function(){
        let output = `
            <div class="purchaseVoucherPage landingpagefx">
                <h1 class="_pvHdr_">Purchase Voucher</h1>
                <div class="_pvrDesc_">Please enter the Name and cellphone phone number associated with your <span class="ecocashAccountHghlt">Ecocash Account</span>.</div>
                    <div class="_pvrFieldsCont">
                        <div class="fldsectn">
                            <label for="firstname_pvr">First Name</label>
                            <input id="firstname_pvr" class="firstname_pvr pvrinputFields" placeholder="First Name">
                        </div>
                        <div class="fldsectn">
                            <label for="lastname_pvr">Last Name</label>
                            <input id="lastname_pvr" class="lastname_pvr pvrinputFields" placeholder="Last Name">
                        </div>
                        <div class="fldsectn">
                            <label for="ecocashNumberField">Cellphone</label>
                            <input id="ecocashNumberField" class="ecocashNumberField pvrinputFields" placeholder="e.g (0772-123-4567)">
                        </div>
                    </div>
                    <button class="proceedTransactionbtn" onclick="proceedToInvoice()">Proceed</button>
            </div>
        `;
        return output
    },
    // Form Validation
    userDetailsInputValidation: function(){
        // Validations
        let fname = /[a-zA-Z]{1,}/.test( $(".firstname_pvr").val() );
        let lname = /[a-zA-Z]{1,}/.test( $(".lastname_pvr").val() );
        let cell = /^([0-9]{11})$/.test( parseInt($(".ecocashNumberField").val().split("-").join("")) );
 
        // Test
        if( fname == true && lname == true && cell && true){
            // Proceed to Invoice Page
            return Setting_.invoicePage()
        }
        // Reject
        else{
            let message = `Please ensure all fields filled in correctly!`;
            return $(".voucherformerror").text(message)
        }

    },
    // Proceed To InvoicePage
    invoicePage: function(){
        // Collect User Data from Input
        let data = {firstname: $(".firstname_pvr").val() , lastname:$(".lastname_pvr").val() , cellphone:parseInt($(".ecocashNumberField").val().split("-").join("")) , date: new Date().getTime(), userID: null};
        // Get Markup
        let markup  =  Setting_.invoicePageMarkup(data);
        // Attatch to State
        State.subscription.data = data;
        // Load Invoice Page
        $(".purchaseVoucherPage").remove();
        $("._menu_settings_").append(markup);
    },
    // InvoicePageMarkup
    invoicePageMarkup: function(data){
        let output = `
            <div class="invoicePage landingpagefx">
                <h1 class="_pvHdrInvoice_ _pvHdr_">Billing</h1>
                <div class="_pvHdrInvDesc_ _pvrDesc_">Below is your invoice for this transaction, please press "Confirm Purchase" to buy your voucher.</div>
                <div class="userInvoice">
                    <div class="invoiceField">
                        <div class="invoiceKey">Name</div>
                        <div class="invoiceValue">`+ data.firstname +` `+data.lastname+`</div>
                    </div>
                    <div class="_fld_sep_"></div>
                    <div class="invoiceField">
                        <div class="invoiceKey">Account ID</div>
                        <div class="invoiceValue">`+ data.userID +`</div>
                    </div>
                    <div class="_fld_sep_"></div>
                    <div class="invoiceField">
                        <div class="invoiceKey">Subscription Type</div>
                        <div class="invoiceValue">Monthly</div>
                    </div>
                    <div class="_fld_sep_"></div>
                    <div class="invoiceField">
                        <div class="invoiceKey">Subscription End</div>
                        <div class="invoiceValue">`+ new Date( data.date + (1000 * 60 * 60 * 24 * 31) ).toDateString()  +`</div>
                    </div>
                    <div class="_fld_sep_"></div>
                    <div class="invoiceField">
                        <div class="totalKey">Amount</div>
                        <div class="totalValue">$`+ State.subscription.monthly+`</div>
                    </div>
                </div>
                <button class="confirmPrchsbtn" onclick="confirmPurchase()">Confirm Purchase</button>
            </div>
        `;
        return output
    },
    // Complete Purchase
    completePurchase: function(){
        console.clear();
        console.log( State.subscription.data )
    },
    // Submit Voucher
    submit_voucher: function(){

        // Get Value from Input
        let voucherCode = $(".voucher_input").val().split("-").join("");
        let val_test = /^([0-9a-zA-Z]{16})$/.test( voucherCode );

        // Input Validation
        if(  val_test == true && voucherCode.length > 0){
            // Remove Error Message
            $(".error_msg_container").css("display", "none");
            // Send voucherCode to server for Further Validation
            Setting_.voucherToServer( voucherCode )
        }
        else if( val_test == false && voucherCode.length > 0){
            // Code Must exactly 16characters
            $(".error_msg_container").css("display", "block").text(`Code must be exactly 16 characters!`);
        }
        else if( val_test == false && voucherCode.length == 0){
            // Alert User Filed Cant Be Empty
            $(".error_msg_container").css("display", "block").text(`Input filed cant be empty on Submit!`);

        }
    },
    // Sumbit Code to server
    voucherToServer: function( code ){
        try{
            // Server Endpoint
            let url = ``;
            // Voucher Code and Email
            let voucherCode = code;                         let userEmail = State.filesystem.configsCopy.email;
            let timeStamp = new Date().getTime();           let subEnd = new Date().getTime() + (1000 * 60 * 60 * 24 * 31);
            // Data object to Server 
            let dataObject = { voucherCode: voucherCode, email: userEmail, timeStamp: timeStamp, subEnd: subEnd };
            
            // Post Request to Server
            $.post(url, dataObject, function(data, status){
    
                let validity = data.codeValid;
                let matchedCode = data.code;
    
                // Successful Top Up
                if (validity == 1 && matchedCode == voucherCode) {
                    // Alert user of Successful Top Up
                    alert("Top Up Successful! Subscription Activated");
                    // Get Configs Copy
                    let configs = State.filesystem.configsCopy;
                    // Change offline Access
                    configs.offlineAccess = true;
                    // Change Subscription Start and End Date
                    configs.subStatus.subStart =  new Date().getTime();
                    configs.subStatus.subEnd =  new Date().getTime() + (1000 * 60 * 60 * 24 * 30);
                    // Delete old Configs
                    sys_operations.deleteFile( State.files.configs , function(){
                        // Create New Configs
                        sys_operations.createFile( State.files.configs , configs, State.fileTypes.json);
                        // Attatch New Configs to State
                        State.filesystem.configsCopy = configs;
                        // Close Menu
                        close_mnu()
                    })
                }
                // Top Up Failed
                else if (validity == 0 && matchedCode != voucherCode) {
                    // Alert user of unSuccessful Top Up
                    alert("Top-Up Failed! Voucher Code not accepted");
                }
            })
        }catch(e){
            alert(e.message)
        }
    },
    // Deactivate User Accout
    deleteAccount: function(){
        // If Connected to Internet
        if( navigator.onLine == true){
            // Confirm User Wants to Delete
            let confirm_ = confirm("Please press Ok, to continue with Account deactivation.");
            // Proceed With Account Deletion
            if( confirm_ == true){
                //  Get User Ref Key
                let userKey = State.usr_.ky;
                // Delete Ref
                m_.database().ref("Users/" + userKey).remove().then(function(){
                    // Alert User
                    alert("Account Succeffully Deactivated!");
                    // Load App Sign-In Page
                    
                    // Delete Filesystem
                    sys_operations.deleteFileSystem();
                })
                // Remove User from Firebase
                .then(function(){
                    // Get User Session
                    let user = m_.auth().currentUser;
                    user.delete().then(function() {
                        // Notify User Deactivation Successul
                        alert("Account Deactivation Successful");
                        // Render Login Page
                        Landing.render()
                    })
                    // Catch Error
                    .catch(function(error) {
                        alert(error.message)
                    });
                })

            } 
        }
        // If Not Connected to Net
        else if( navigator.onLine == false){

        }
    },
    // User Sign Out
    signOut: function(){
        m_.auth().signOut().then(function() {
            // Load Sign In Page
            Landing.render()
        }).catch(function(error) {
            // An error happened.
            alert(error.message)
        });
    },
    clearStorage: function(){
        // Alert user that sign in is required after filesystem Purge
        let confirm_ = confirm("Clearing Storage will require you to sign-in again. Press Ok to proceed.");
        
        // Purge or Not
        ( confirm_ == true)?  sys_operations.deleteFileSystem() : null;
        
        // Load Sign Up Page
        alert("Purge Succesfull");
        
        // Load Sign In Page
        Landing.render()
    }
}

// Submit Voucher
const submit_voucher = function(){
    Setting_.submit_voucher()
}
const topUp = function(){
    return Setting_.topUp()
}
const clearStorage = function(){
    return Setting_.clearStorage()
}
const signout_ = function(){
    return Setting_.signOut()
}
const deactivate = function(){
    return Setting_.deleteAccount();
}
const purchaseVoucher = function(){
    return Setting_.purchaseVoucher()
}
const proceedToInvoice = function(){
    return Setting_.userDetailsInputValidation()
}
const confirmPurchase = function(){
    return Setting_.completePurchase()
}