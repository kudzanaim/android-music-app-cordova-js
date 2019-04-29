// Initialize Application
const app_initialize = {
    // GET database Configurations from Cloud Server
    getDatabases:function(callback){
        try {
            // Headers and Site Origin but uncessary
            let url_ = app_initialize.serverURL();
            let body = JSON.stringify(window.location);

            // Make POST request to Server
            return $.post(url_, body, function(_configs_, _st_){
                return app_initialize.init_databases({sm: _configs_.sm, sc: _configs_.sc}, callback)
            })
        } catch (e) {
            alert(e.message)
        }
    },
    // Initialize Databases
    init_databases: function(c_, callback){
        try {
            // Initialize Project
            let strmacom = c_.sc;                 let strmamedia = c_.sm;
            firebase.initializeApp(strmacom);     window.m_ = firebase.initializeApp(strmamedia, "m_");

            // Start App
            if(m_ != undefined && firebase != undefined){
                return callback()
            }
        } catch (e) {
            alert(e.message)
        }
    },
    // Launch App
    app:function(){
        try {
            // Make Container Visible
            $(".App_Root").addClass("_applaunchfx_");

            // App Launch
            getLatestPlaylists.check();
    
            // Nav Click Handler
            window.navx_click = function(param){
                return _Router_.Route($(param).text().trim(), param)
            }
        } catch (e) {
            alert("Launch Error: "+e.message)
        }
    },
    // Server URL
    serverURL:function(){
        let y = ``;
        return y
    },
    // Check if databases configured
    databaseCheck:function(callback){
        try {
            if(window.m_ == undefined ){
                location.reload()
                app_initialize.getDatabases(callback);
            }
        } catch (e) {
            alert("DBcheck: "+e.message)
        }
    },
    // Determine Connection
    conn:function(){
        
        // Online
        document.addEventListener("online", function(){
            try {
                // Push Bottom Player Up
                $(".bottomGutter_mobile").addClass("connection_pushup")
                // Alert User of Connection Change
                $(".App_Root").append(`<div class="connection_error">Internet back Online</div>`);
                $(".connection_error").css("background", "#077d2c")
                // Change root
                setTimeout(() => {
                    $(".App_Root").removeClass("no_connection");
                    $(".connection_error").remove();
                    $(".bottomGutter_mobile").removeClass("connection_pushup");
                }, 5500);
                // Check if databases configured
                // let callback = (  $(".app_body_").find(".home_container_").length > 0  )? app_initialize.app: undefined;
                app_initialize.databaseCheck(app_initialize.app);

            } catch (e) {
                alert("online error: "+e.message)
            }
        }, false);
        
        // Offline
        document.addEventListener("offline", function(){
            // Remove Bottom Error
            $(".connection_error_regular").remove();
            // Push Bottom Player Up
            $(".bottomGutter_mobile").addClass("connection_pushup")
            // Add Alert Message to DOM
            $(".App_Root").append(`<div class="connection_error">No Internet Connection</div>`);
            // Add Conn_err Class to Root
            $(".App_Root").addClass(`no_connection`);
            // Change root
            setTimeout(() => {
                $(".connection_error").remove();
                $(".bottomGutter_mobile").removeClass("connection_pushup");
            }, 5500);
        }, false);

    },
    Preflight:function(){
        try {
            // Check for filesystem
            State.DirEntry.getFile("config.json", {create:false, exclusive:false}, function(fileEntry){
                // 1. Check Configurations
                State.filesystem.isCreated = true
                sys_operations.getFile("config.json", userAccessConfigurations.calculateSubStatus);
            }, 
            // if File System doesnt Exist so user must sign in
            function(){
                // 1. Launch Sign-In Page
                Landing.SplashScreen();
            })
        } catch (error) {
            alert("Preflight: "+error.message)
        }
    },
    setEventListeners:function(){
        // Listens for Song Download Completion
        window.addEventListener("downloadFinished", function(data){
            // Reset Progress
            State.downloadProgress = 0;
            // $(".progressB").css("display", "none");
            $(".dlprogress_slider").css( "width", 0 );
            setTimeout(() => {
                $(".progressB").css("display", "");
            }, 200);
            // Call download loop
            playlistOperations.downloadloop();
            // Issue an error listener
            playlistOperations.errorListener();
        })
    }
}

// User Access settings based on subscrition Status
const userAccessConfigurations = {
    // Properties
    userKey: null, configurations: null,
    // Once Ready then call ==>> updateDatabse() from here
    calculateSubStatus: function(config){
        try {
            let configs = JSON.parse(config);
            let subEnding = configs.subStatus.subEnd;
            let dateToday = new Date().getTime();

            // Ending Date Surpassed
            if( subEnding < dateToday){ 
                // Alert User => use small bottom screen notification to notify User
                
                // Disable premium Options & features
                State.PremiumSettings.subscriptionState = false;
                // Purge & Re-Create Users filesystem
                userAccessConfigurations.resetFileSystem();      
            }
            // Else is if subscription is still Valid
            else if( subEnding > dateToday){

                // Get PlaylistsDB and Update Database
                sys_operations.getFile("db.json", updateDatabase.UpdateDatabase);
                
                // Enable premium Options & features
                State.PremiumSettings.subscriptionState = true;
        }
        } catch (e) {
            alert("Calc: "+e.message)
        }
    },
    // Update user subscription Status DB record
    updateUserSubStatusDB: function(){
        // Get User record
        // m_.database().ref("Users/" + userAccessConfigurations.userKey + "/AccountDetails/subStatus").once("value", function(snap){})
    },
    // Reset User filesystem
    resetFileSystem: function(){
        try {
            // Reset newPlaylist and Played Songs buffer
            let database_data = {   playlists: {},   newPlaylists:[],    playedSongs:[], downloads: []  };
            // Update Db
            sys_operations.updateDB("db.json", database_data)
            // Delete Song Directory
            sys_operations.deleteDirectory("resources", ()=>sys_operations.createDirectory("resources"));
            sys_operations.deleteDirectory("artwork", ()=>sys_operations.createDirectory("artwork"));
            // Launch The App
            app_initialize.app()

        } catch (e) { "reset: "+alert(e.message) }
    }
}

// Update Users Record on Main Database
const updateDatabase = {
    // Properties
    newplaylists:null, playedSongs:null, playlists:null, userkey:null, downloads:null,
    // Start Update Process
    UpdateDatabase: function( playlistDB){
        try {
            // DB object
            let DB = JSON.parse( playlistDB );

            // Initialize Properties
            updateDatabase.newplaylists = DB.newPlaylists;    updateDatabase.playedSongs = DB.playedSongs;      updateDatabase.playlists = DB.playlists;
            updateDatabase.downloads = DB.downloads;

            // Get Userkey from Config
            sys_operations.getFile("config.json", updateDatabase.getuserKey);
        } catch (e) {
            alert("update error: "+e.message)
        }

    },
    getuserKey:function(config){
       try { 
            // User Key
            updateDatabase.userkey = JSON.parse(config).userRefKey;
            updateDatabase.checkConnectionBeforeSynch();

       } catch (e) {
           alert("userkey: "+e.message)
       }
    },
    // Check Connection before Synchronizing with database
    checkConnectionBeforeSynch: function(  ){
       try {
            // Online 
            if( navigator.onLine == true){ 
                app_initialize.getDatabases( updateDatabase.PushNewPlaylists )
            }
            // Offline
            else if( navigator.onLine == false){
                // Render Offline Pages if no connection
                app_initialize.app()
            }
       } catch (e) {
           alert("connection error: "+e.message)
       }
    },
    // 1. Push New Playlists
    PushNewPlaylists: function(){    
       try { 
            if(   Object.values(updateDatabase.newplaylists).length > 0   ){ 
                // Convert Playlist Object to Array
                let playlists = updateDatabase.newplaylists;
                let userkey = updateDatabase.userkey;
                let count = 0;

                // Map thru Playlists and push to Database
                playlists.map( (playlist) => {
                    // Create New playlist Object
                    let pl = {   playlistName: playlist.playlistName, description: playlist.description, songs:{ songs:"appended here"}  }
                    let pl_songs = playlist.songs;

                    // Push Playist to DB
                    m_.database().ref("Users/" + userkey + "/playlists").push(pl).then( snap =>{
                        
                        // Push pl songs
                        pl_songs.map( song => {
                            m_.database().ref("Users/" + userkey + "/playlists/" + snap.key + "/songs").push(song);
                        })

                    }).then(()=>{
                        
                        // Increment Count
                        count = count + 1;
        
                        // If All Uploaded then Complete Task
                        (  count == playlists.length  )? updateDatabase.updateStreamCounts(): null;

                    });

                })
            }
            else if( Object.values(updateDatabase.newplaylists).length == 0  ){
                // Complete Function
                return updateDatabase.updateStreamCounts()
            }
       } catch (error) {
            alert("PushPlay: "+error.message)
       }
    },
    // 2. Update Streamcounts
    updateStreamCounts: function(){
        try {
            if( updateDatabase.playedSongs.length > 0){
                // Map thru and post stream for each
                let played = updateDatabase.playedSongs;
                // Count Completed
                let count = 0;      let processCompletionStatus = false;    

                // Set Completion Timeout after 30secs if function fails throw error
                setTimeout(()=>{
                    if( processCompletionStatus == false){
                        alert("Server Synchronization Error");
                        updateDatabase.dlnewData()
                    }
                }, 30000)

                // Map thru
                played.map(song => {
                    let songid = song.songid;   let plays = song.streamCount;
                    // Get song key from Online Database
                    firebase.database().ref("songs/" + songid).once("value", function(snap){
                        // Calculate new Stream Counts
                        let newstreamCount = snap.child("streamCount").val()  +  plays;
                        // Update streamCount songObject
                        firebase.database().ref("songs/" + songid).update({  streamCount: newstreamCount  })
                        // Increment Completed
                        count = count + 1;
                        // IF all Completed Advance
                        if( count == played.length){
                            processCompletionStatus = true;
                            updateDatabase.dlnewData()
                        }
                    })
                })
    
            }
            else if( updateDatabase.playedSongs.length == 0 ){
                // Complete Function
                this.dlnewData()
            }
        } catch (error) {
            // Alert User
            alert("updateStreams: "+error.message);
        }
    },
    // 3. download new data
    dlnewData: function(){
        try { 
            // Get New playlists from Database
            m_.database().ref("Users/" + updateDatabase.userkey + "/playlists").once("value", function(snap){
                // Pass new Playlists to UpdateFS Funct
                updateDatabase.updateFilesystem(  snap.val()  );
            })
        } catch (e) {
            alert("dlData: "+e.message)
        }
    },
    // 4. Update Filesystem
    updateFilesystem:function(updated_playlists){
        try {
            // Reset newPlaylist and Played Songs buffer
            let database_data = {
                playlists: updated_playlists,
                newPlaylists:[],
                playedSongs:[],
                downloads: updateDatabase.downloads 
            }

            // Update Playlist Db on Device
            sys_operations.updateDB("db.json", database_data)

            // Add playlists to State
            State.usr_ = { playlists: updateDatabase, ky: updateDatabase.userkey }; 

            // Render App
            app_initialize.app()

        } catch (e) {
            alert("UpdateFSys: "+e.message)
        }
    }
}

// Get Users Updated Playlists from Server
const getLatestPlaylists = {
    check:function(){
       try {
            // Get User Login Details
            window.fs_created = setInterval(() => {
                if(  State.filesystem.isCreated == true  ){
                    clearInterval( window.fs_created )
                    setTimeout(function(){
                        sys_operations.getFile( "config.json", getLatestPlaylists.getplaylists );
                    },200)
                }
            }, 100);
       } catch (e) {
           alert("check error: "+e.message)
       }
    },
    getplaylists:function(configs){
        try {
            if( navigator.onLine == true ){
                // Configs Object
                let config = JSON.parse( configs );

                // Attach Configs to State
                State.filesystem.configsCopy = config;

                // Close lgn widget
                $("._loginform_cont_p").remove();
    
                // Append Spinner
                $(".App_Root").append(` <div class="spinner_container"><div class="mk-spinner-centered mk-spinner-ring"></div>
                                        <div class="spin_text">Loading Playlists...</div></div>`);
    
                // data object
                let _data_ = {  email: config.email,   pass: config.password,  type: "lgn" }
                
                // Get Playlists
                let url = "";
                
                return $.post(url, _data_, function(data, status){
                    // Save Playlists
                    if(data.message == "Successful"){
                        // Save playlists
                        let usr_ = data.usr;    let k_ = usr_.ky
                        State.usr_ = {playlists: usr_.dta, ky:k_};
                        State.lgn_sts = true;
                        
                        // Close sgn in container
                        setTimeout(function() {    
                             $(".spinner_container").remove()  
                            //  Load Home Page
                            _Router_.Route("Home", $(".home_btn_nav"))    
                        }, 3000);
                    }
                })
            }else{
                _Router_.Route("Home", $(".home_btn_nav"))
            }
        } catch (e) {
            alert("get playlists: "+e.message)
        }
    }
}