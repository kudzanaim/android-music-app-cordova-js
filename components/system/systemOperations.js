// Filesystem operations R/W
const sys_operations = {
    // File Creations
    createFile: function(filename_, data, dataType, callback){ 
        try {
    
            // Content to write to file
            let blob = sys_operations.createBlob( data, dataType);
            // Create File Writer Object & Use Object to Write New File
            State.DirEntry.getFile(filename_, {create:true, exclusive:false}, function(fileEntry){

                fileEntry.createWriter(function(fileWriter){
                    fileWriter.onwriteend = ()=>{
                        // Add new DB copy to State for later Writes
                        ( filename_ ==  State.files.database )? ( State.filesystem.databaseCopy = data ) : null;
                        // Do something on writeEnd pass data to callback
                        callback()
                    }
                    fileWriter.write(blob);
                });
            }, function(){
                alert("Error Creating File")
            })
        } catch (e) {
            alert("Create File :"+e.message)
        }
    },
    // Get File & Set to Data Port
    getFile: function(filename, callback){
        try {
            // Create File Writer Object & Use Object to Write New File
            State.DirEntry.getFile(filename, {create:false, exclusive:false}, function(fileEntry){
                fileEntry.file( file => {
                    // Create File Reader
                    let reader = new FileReader();
                    // On read Complete
                    reader.onload = ()=>{
                        // Execute Callback with Data as an Argument
                        callback(  reader.result  )
                    }
                    // Start Read File
                    reader.readAsText(file);
                })
            })
        } catch (e) {
            alert("Get file: "+e.message); 
        }
    },
    // Update File
    updateDB:function(filename, data, callback){
        try {
            // Fix undefined callback
            ( callback == undefined)? undefined:callback;
            
            // Create new function
            const reCreateDBfile = ()=>{sys_operations.createFile(filename, data, State.fileTypes.json , callback);} 
            
            // Delete Old File
            sys_operations.deleteFile(filename, reCreateDBfile);
        } catch (e) {
            alert("UpdateDB :"+e.message)
        }
    },
    // Delete File
    deleteFile:function(filename, callback){
        try {
            // Fix undefined callback
            ( callback == undefined)? undefined:callback;
            // Delete File
            State.DirEntry.getFile(filename, {create:false, exclusive:false}, function(fileEntry){
                // remove file Object
                fileEntry.remove();
                // Wait for File to delete
                setTimeout(()=>{
                    ( callback != undefined)? callback() : null;
                }, 500)
            })
        } catch (e) {
            alert("deleteFile :"+e.message)
        }
    },
    // Create BLOB
    createBlob:function(data, dataType){
        return new Blob([JSON.stringify(data)], {type: dataType });
    },
    // GET user data from Online Database
    getUserDataFromDatabase:function(user_object, userKey){
        try {

            // Object Break Down
            let accountDetails = user_object.AccountDetails;    let subStatus = accountDetails.subStatus;
            let user_ = {
                email: accountDetails.email,
                password: accountDetails.password,
                userRefKey: userKey,
                playlists: user_object.playlists,
                subStatus: {
                    subStart: subStatus.subDate,
                    subEnd: subStatus.subEnd
                },
            }
            // Create userObject => then Call ==>> create_filesystem(user)
            sys_operations.create_filesystem(user_)

        } catch (e) {
            alert("getUserDB :"+e.message)
        }
    },
    // New File Templates
    fileTemplates: function( type, data ){
        // Conditional Return
        switch( type ){
            case "configs":
                return {
                        email: data.email,
                        password: data.password,
                        userRefKey: data.userRefKey,
                        subStatus: {
                            subStart: data.subStatus.subStart,
                            subEnd: data.subStatus.subEnd
                        },
                        offlineAccess: false
                        };
            case "database":
                return {
                        playlists:data.playlists,
                        newPlaylists:[],
                        playedSongs:[],
                        downloads:[]
                        };
        }
    },
    // Create new Filesystem
    create_filesystem: function(user){
        try {
            // File Count Status
            let count = 0;

            // Set Configs to State
            State.filesystem.configsCopy = sys_operations.fileTemplates("configs", user);

            // Set Database to State
            State.filesystem.databaseCopy = sys_operations.fileTemplates("database", user);
            
            // Files to Create
            let filesToCreate = [
                { fileName:  State.files.configs , filetype: State.fileTypes.json, data: sys_operations.fileTemplates("configs", user) },
                { fileName:  State.files.database , filetype: State.fileTypes.json, data: sys_operations.fileTemplates("database", user) }
            ];

            // Create Music files Directory
            sys_operations.createDirectory( State.directories.songsFiles );
            sys_operations.createDirectory( State.directories.artwork );

            // Map thru filesToCreate And Create Files
            filesToCreate.map( file => {
                sys_operations.createFile( file.fileName, file.data, file.filetype, ()=>{});
                count = count + 1;
                if(count == 2){  State.filesystem.isCreated = true; app_initialize.app() }
            })

        } catch (e) {
            alert("crt_fs :"+e.message)
        }
    },
    // Create new Directory
    createDirectory:function(dirName){
       try {
            State.DirEntry.getDirectory(dirName, {create: true} )
       } 
       catch (e) {
           alert("crtDir :"+e.message)
       }
    },
    // Delete Directory
    deleteDirectory: function(dirName, callback){
        (callback != undefined)? callback : ()=>{};
        try {
            State.DirEntry.getDirectory(dirName, {create: false} , function(directoryEntry){
                directoryEntry.removeRecursively(callback)
            })
        } catch (e) {
            alert(+e.message)
        }
    },
    // Get song Files
    getSong: function(songobject, callback){
        try {
            resolveLocalFileSystemURL("file:///storage/emulated/0/Android/data/com.strma.strma/resources", function (dirEntry) {
                dirEntry.getFile( songobject.songid + State.fileTypes.music , {create:false, exclusive:false}, function(fileEntry){
                    // Play Song ==>> Args( SongObject, SongURL() )
                    callback(  songobject, fileEntry.toURL() )
                }, 
                // error Handler
                function(){  alert("Song not Found") })
            })
        } catch (e) {
            alert(e.message)
        }
    },
    getSongMeta: function(songname, artist){
        try {
            sys_operations.getFile( State.files.database , function(db){
                // Map array and match songobject
                let downloads = JSON.parse(db).downloads;
                let song = _.find( downloads, { songTitle: songname, artist: artist });

                // Get Song File
                sys_operations.getSong(song, songOperations.playSong); 
            })
        } catch (e) {
            alert(e.message)
        }
    },
    deleteFileSystem:function(){
        // Delete Songs Directory
        sys_operations.deleteDirectory( State.directories.songsFiles , function(){});
        // Delete DB
        sys_operations.deleteFile( State.files.database , function(){});
        // Delete Configs
        sys_operations.deleteFile( State.files.configs , function(){})
    },
}
// Playlist Operations
const playlistOperations = {
    // Download Playlist
    downloadfavourites:function(){
        try {
            // Get Playlist Songs
            let favourites = Object.values( State.usr_.playlists );
            let playlistIndex = _.findIndex(favourites, { 'playlistName': 'My Songs' });
            let playlist_ = favourites[playlistIndex];
            
            // Attact Songs to Download to State
            State.songs_and_ids = {
                songs: Object.values(playlist_.songs),
                ids:  Object.keys(playlist_.songs)
            }

            // Remove appnd object
            State.songs_and_ids.songs.pop();
            State.songs_and_ids.ids.pop();

            // Download songs to device and push Meta to DB
            playlistOperations.downloadloop();

        } catch (e) {
            alert("dlfav"+e.message)
        }
    },
    downloadloop: function(){
        try {
            // Songlist
            let allsongs = State.songs_and_ids.songs;
            // If song is done downloading
            if(  State.downloadCounter < allsongs.length  ){
                // Download song
                playlistOperations.downloadSongInPlaylist(); 
            }
            // If All songs are done downloading
            else if( State.downloadCounter == allsongs.length  ){
                // Change Download State
                State.downloadCounter = 0;
                State.songs_and_ids = null;
            }
            
        } catch (e) {
            alert(e.message)
        }
    },
    // Download song in playlist
    downloadSongInPlaylist: function(){  
        try {
            // Download 1 song
            let song = State.songs_and_ids.songs[ State.downloadCounter ];
            let songname = song.songTitle;
            let artistname = song.artist;
           
            // Get Song URL
            firebase.database().ref("songs").orderByChild("songTitle").startAt(songname).endAt(songname+"\uf8ff").once("value", function(snap){
                Object.values(snap.val()).map( (songitem,index) =>{

                    if( artistname ==  songitem.artist ) {
                        let iframe = songitem.iframe;
    
                        // Song Object
                        let songObject = {
                            songid: Object.keys(snap.val())[index],
                            artist: songitem.artist,
                            iframe: songitem.iframe,
                            image: songitem.image, 
                            songTitle: songitem.songTitle,
                            streamCount: songitem.streamCount
                        }

                        // Get storageURL 
                        let storage = m_.storage().ref().child("songsAll/" + iframe );

                        storage.getDownloadURL().then(function (url) { 
                            songOperations.downloadsong( songitem.songTitle , url, songObject, songOperations.songDone )
                        }).catch(e=>alert(e.message));  
                    }  
                })       
            } );
        } catch (e) {
            alert(e.message)
        }
    },
    playlistObject: (playlistname, description, songs, )=>{
        return {
            playlistName: playlistname,
            description: description,
            songs: []
        }
    },
    // Listen for Any Unexpeted errors during playlist Song Downloads
    errorListener:function(errorTicket){
        try {
            if(  State.downloadCounter < State.songs_and_ids.songs.length && State.downloadCounter != 0){
                return setTimeout(() => {
                        // Capture State
                        let errorTicket_ = errorTicket;
                        // If no movement in songDownload
                        if( errorTicket_ == State.downloadCounter && $(".progressB").attr("value") == 0){
                            let userAlert = confirm("Error during download, press Ok to try again!");
                            ( userAlert )? playlistOperations.downloadloop() : null;
                            
                        }
                    }, 10000);
                }else{
                    clearInterval( window.errorListener )
            }
        } catch (e) {
            alert(e.message)
        }
    }
}
// Operations on Song Files
const songOperations = {
    // Download Songs
    downloadsong:function(songname, songurl, meta_data, extraCallback){
        try {
            // Create File Writer Object & Use Object to Write New File
            resolveLocalFileSystemURL("file:///storage/emulated/0/Android/data/com.strma.strma/resources", function (dirEntry) {
                dirEntry.getFile( meta_data.songid + State.fileTypes.music , {create:true, exclusive:false}, function(fileEntry){
                    // Create fileTransfer object
                    let ft = new FileTransfer()
                    
                    // Render Progress
                    ft.onprogress = function(result){
                        var percent =  result.loaded / result.total * 100;
                        percent = Math.round(percent);
                        $(".dlprogress_slider").css("width", percent + "%" );
                        
                        // Write Progress to State
                        State.downloadProgress = percent;
                    };
    
                    // On Success
                    let success = ()=>{       
                        // Write to Database
                        const updateDB = function(downloadsDB){
                            
                            // Parse Array
                            let db = JSON.parse( downloadsDB ).downloads;
                            
                            // New data
                            let data = {
                                playlists: State.usr_.playlists,
                                newPlaylists:[],
                                playedSongs:[],
                                downloads: [meta_data, ...db]
                            }

                            $(".dlprogress_slider").css( "width", 0 );
                            
                            // Write new data to db
                            sys_operations.updateDB(  State.files.database , data, ()=>{});
                        };

                        // Get DB
                        sys_operations.getFile( State.files.database , updateDB);

                        // Call extra callback if defined
                        ( extraCallback != undefined )? extraCallback() : null;
                    }
                    
                    // Failure
                    const error = (e)=>{
                        alert("Error downloading song")
                    }
    
                    // Download File
                    ft.download( songurl, fileEntry.toURL(), success, error )
                })
            })
        } catch (error) {
            alert(JSON.stringify(error.message))
        }
    },
    // updateStreamCount
    updateStreamCount:function( songname, artist){
        try {
            // Get Downloads from DB
            sys_operations.getFile(  State.files.database , function(db){
                let database = JSON.parse(db);
                let downloads_ = database.downloads;
                let song = _.find(downloads_, {artist: artist, songTitle: songname});

                // Find song in downloads
                let playedSongs = database.playedSongs;
                let playedsng = _.find(playedSongs, {artist: artist, songTitle: songname});
                let playedsng_index = _.findIndex(playedSongs, {artist: artist, songTitle: songname});
                
                // Increment existing song
                const incrmntsong = function(){
                    playedsng.streamCount = playedsng.streamCount + 1;
                    playedSongs[ playedsng_index ] = playedsng;
                };

                // New Song
                const newsong = function(){
                    let copy = _.cloneDeep(song);
                    copy.streamCount = 1;
                    playedSongs.push( copy );
                };

                // if undefined push new object else if not just increment value
                (  playedsng == undefined )?  newsong() : incrmntsong();
                
                // Write to Db
                sys_operations.updateDB( State.files.database , database, function(){})
            })
        } catch (e) {
            alert(e.message)
        }
    },
    // Play Song
    playSong: function(songobject, songurl){
        try {
            // Move to Current 1st to Last FIFO
            let p1_ = ( State.q_[0] != undefined)? State.q_[0] : null;
            ( State.q_.length > 1)? ( State.q_.shift(), State.q_.push(p1_) ):null;
            
            
            // Push to Queue
            State.q_.unshift({
                songTitle: songobject.songTitle,
                artist: songobject.artist,
                songID: songobject.songid,
                artwork:songobject.image,
                iframe: songobject.iframe
            })

            // Call Play functonand Pass SongURl
            setTimeout(function(){Player.play( songurl )}, 1000)
            
        } catch (e) {
            alert(e.message)
        }
    },
    // Song Download Completed
    songDone:function(){
        // Create Event
        let event = new CustomEvent("downloadFinished");
        // Set Progress Property to Zero
        State.downloadProgress = 0;
        // Increment to next song
        State.downloadCounter = State.downloadCounter + 1;
        // Increment Error ticket
        State.errorTicket = State.downloadCounter;
        // Dispatch Event
        window.dispatchEvent(event);
    },
    // Delete songs from Device
    deleteSong:function( filename ){
        
        // Delete from Local DB once Filenetry deleted
        let callback = function(id){
            // Db
            let db = State.filesystem.databaseCopy;
            // Remove Song Object
            _.remove(db.downloads, { songid: id});
            // Write updated file to Db
            sys_operations.updateDB( State.files.database , db, function(){})
        };

        // DElete File Entry
        resolveLocalFileSystemURL("file:///storage/emulated/0/Android/data/com.strma.strma/resources", function (dirEntry) {
            dirEntry.getFile( filename + State.fileTypes.music , {create:false, exclusive:false}, function(fileEntry){
                // Delete Song
                fileEntry.remove();
                // Delete from DB
                callback(filename);
            })
        });

    }
}






























// playlist.map(song =>{
//     let songname = $(song).find(".dataContainer").attr("data-songname");
//     let songid = $(song).find(".dataContainer").attr("data-songid");

//     // Get Song URL
//     firebase.database().ref( "songs/" + songid ).once("value", function(snap){

//         let iframe = snap.child("iframe").val();

//         // Song Object
//         let songObject = {
//             songid: snap.key,
//             artist: snap.child("artist").val(),
//             iframe: snap.child("iframe").val(),
//             image: snap.child("image").val(), 
//             songTitle: snap.child("songTitle").val(),
//             streamCount: snap.child("streamCount").val()
//         }

//         alert(JSON.stringify( songobject ))
        
//         // Get storageURL 
//         let storage = m_.storage().ref().child("songsAll/" + iframe );
//         storage.getDownloadURL().then(function (url) {
//             alert(url)
//             songOperations.downloadsong(songname, url, songObject)
//         });            
//     });
// })


































// let ifFinished = setInterval(() => {
//     if( State.downloadProgress >= 95 ){
//         let song = listOfSongs[ count ];
//         let songname = $(song).find(".dataContainer").attr("data-songname");
//         let songid = $(song).find(".dataContainer").attr("data-songid");
        
//         // Get Song URL
//         firebase.database().ref( "songs/" + songid ).once("value", function(snap){

//             let iframe = snap.child("iframe").val();

//             // Song Object
//             let songObject = {
//                 songid: snap.key,
//                 artist: snap.child("artist").val(),
//                 iframe: snap.child("iframe").val(),
//                 image: snap.child("image").val(), 
//                 songTitle: snap.child("songTitle").val(),
//                 streamCount: snap.child("streamCount").val()
//             }

//             // Get storageURL 
//             let storage = m_.storage().ref().child("songsAll/" + iframe );
//             storage.getDownloadURL().then(function (url) {
//                 songOperations.downloadsong(songname, url, songObject);
//                 clearInterval( ifFinished );
                
//                 if( count <= allsongs.length){
//                     count = count + 1;
                    
//                 }else{

//                 }
//             });            
//         });
//     }
// }, 10);














    // // Listen for data read from device, and execute passed callback
    // dataListener:function(callbackToExecute){
    //     // Clear Data Port
    //     StaticRange.filesystem.dataPort = null;

    //     // Set listener
    //     let data_listener = setInterval(() => {
    //         if( State.filesystem.dataPort != null){
    //             // Data
    //             let dataDB = JSON.parse(  JSON.parse(State.filesystem.dataPort)  );
                
    //             // Stop Listener
    //             clearInterval(data_listener);

    //             // Excute Callback
    //             callbackToExecute( dataDB )

    //         }
    //     }, 10);
    // },