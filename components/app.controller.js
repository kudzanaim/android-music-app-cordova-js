// App Launched from Here Step by Step//
function onDeviceReady(){
    try {
        resolveLocalFileSystemURL("file:///storage/emulated/0/Android/data/com.strma.strma", function (dirEntry) {
            // Then get Playlists
            app_initialize.getDatabases( function(){
                // Set Directory URL to State
                State.DirEntry = dirEntry;
    
                // Perform Preflight Checks then Launch App
                app_initialize.Preflight();
                
                // Listen for Network Connection
                app_initialize.conn();     
    
                // Set Event listeners
                app_initialize.setEventListeners();

                // Register Media Controls and Listen
                Player.events();
                Player.listen();
                
            });
        })

    } catch (error) {
        alert(error.message)
    }
   
}

document.addEventListener("deviceready",onDeviceReady, false);


// "cordova-android": "^7.0.0",

