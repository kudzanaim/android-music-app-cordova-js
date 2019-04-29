

const context = {
    exe:function(e, type){

        // Get Parent
        let SongObject = $(e)[0].parentElement;
        State.songToplay = SongObject;
        State.selectedSongId = $(e).parent().find(".dataContainer").attr("data-songid")
        
        // Open Menu
        this.open( type )

    },
    open:function(type){
        // Remove Menu Instances in DOM
        $(".context_menu").remove();
        $(".context_menu_mobile").remove();

        // Append Container to Body
        let menu = this.markup(type);
        $(".App_Root").append(menu)

        // Toggle
        $(".context_menu").css("display","block")

    },
    markup:function(type){
       
        let static_mobile = `
            <div class="context_menu_mobile">
                <div class="cnt_mob_items">
                    <span class="cxt_menu_item" onclick="ply_mnu()">Play</span>
                    <div class="line_menu_cxt"></div>
                    <span class="cxt_menu_item" onclick="slctor()">Add to Playlist</span>
                    <span class="cxt_menu_item" onclick="to_qu_()">Add to Queue</span>
                    <span class="download_btn_cntxt" onclick="download_song()">Download</span>
                    <span class="cxt_menu_item cls_btn_cntxt" onclick="close_mnu()">Close</span>
                </div >
            </div>
        `;

        let playlist_mobile = `
            <div class="context_menu_mobile context_menu_">
                <div class="cnt_mob_items">
                    <span class="cxt_menu_item" onclick="ply_mnu()">Play</span>
                    <div class="line_menu_cxt"></div>
                    <span class="cxt_menu_item" onclick="slctor_()">Add to Playlist</span>
                    <span class="cxt_menu_item" onclick="to_qu_()">Add to Queue</span>
                    <span class="cxt_menu_item" onclick="del(this)">Delete</span>
                    <span class="download_btn_cntxt" onclick="download_song()">Download</span>
                    <span class="cxt_menu_item cls_btn_cntxt" onclick="close_mnu()">Close</span>
                </div >
            </div>
        `;

        let downloads_mobile = `
            <div class="context_menu_mobile context_menu_">
                <div class="cnt_mob_items">
                    <span class="cxt_menu_item" onclick="ply_mnu()">Play</span>
                    <div class="line_menu_cxt"></div>
                    <span class="cxt_menu_item" onclick="slctor_()">Add to Playlist</span>
                    <span class="cxt_menu_item" onclick="to_qu_()">Add to Queue</span>
                    <span class="cxt_menu_item" onclick="deleteFromDevice()">Delete</span>
                    <span class="cxt_menu_item cls_btn_cntxt" onclick="close_mnu()">Close</span>
                </div >
            </div>
        `;

        let latest_mobile = `
            <div class="context_menu_mobile context_menu_">
                <div class="cnt_mob_items">
                    <span class="cxt_menu_item" onclick="_p_m()">Play</span>
                    <div class="line_menu_cxt"></div>
                    <span class="cxt_menu_item" onclick="slctor_()">Add to Playlist</span>
                    <span class="cxt_menu_item" onclick="to_qu_()">Add to Queue</span>
                    <span class="download_btn_cntxt" onclick="download_song()">Download</span>
                    <span class="cxt_menu_item cls_btn_cntxt" onclick="close_mnu()">Close</span>
                </div >
            </div>
        `;

        switch(type){
            case "album":
                return static_mobile
            case "playlist":
                return playlist_mobile
            case "downloads":
                return downloads_mobile
            case "static":
                return static_mobile
            case "home":
                return static_mobile
            case "latest":
                return latest_mobile
        }
    },
    play_sng: function(){
        return Player.toQueue(State.songToplay), $(".context_menu").remove()
    },
    a_t_pl:function(e){

        // Close Containers
        $(".context_menu").remove();
        $(".context_menu_mobile").remove();         $("._pl_slctor_").remove();

        // Get Song
        let SongObject = State.songToplay;                              let playlist = (  $(e).text() == "Favourites")? "My Songs" : $(e).text() ;
        let song = $(SongObject).find(".s_playname").text();            let artist = $(SongObject).find(".a_playname").text(); 

        // Push to DB Playlist
        m_.database().ref("Users/"+State.usr_.ky+"/playlists").orderByChild("playlistName").startAt(playlist).endAt(playlist+"\uf8ff").once("child_added", function(snap){
            // Get pl Key
            let plkey = snap.key;
            // Get Song
            firebase.database().ref("songs").orderByChild("songTitle").startAt(song).endAt(song+"\uf8ff").once("child_added", function(snap_){
                if(artist == snap_.child("artist").val()){
                    // Song to Push
                    let song_2_push = snap_.val();
                    // Push to DB
                    m_.database().ref("Users/"+State.usr_.ky+"/playlists/"+plkey+"/songs").push(song_2_push)
                    // Update Playlists In State
                    .then(function(){
                        m_.database().ref("Users/"+State.usr_.ky+"/playlists").once("value", function(snap){
                            State.usr_.playlists = snap.val();
                        })
                    })
                }
            })
        })
    },
    pl_selctr:function(type){

            // if mobile then close context menu
            $(".context_menu_mobile").remove();
    
            // Selector Container
            let Container = `<div class="_pl_slctor_"><h1 class="pl_slctor_hdr">Select Playlist</h1>
            <div class="pl_slctor_cont"></div><button class="selctr_clse_mob" onclick="close_mnu()">Close</button></div>`;
            
            // Append Container                     
            $(".App_Root").append(Container);  
    
            // Map thru Playlists anmd Append to Dom
            Object.values(State.usr_.playlists).map(function(playlist, index){
                if(playlist.playlistName != undefined){
                    let plname = ( playlist.playlistName == "My Songs")? "Favourites": playlist.playlistName;
                    let pl_item = `<div class="_plslctor_item" onclick="a2pl(this)">`+ plname +`</div>`;
                    $(".pl_slctor_cont").append(pl_item);
                }
            })
        
    },
    __delete_:function(){
        // Get song to Delete
        let song_ = State.songToplay;   let pl = State.open_pl.name; let k = State.open_pl.k;   let count = 0;
        let songname = $(song_).find(".s_playname").text();     let artist = $(song_).find(".a_playname").text();
        
        // Get Somgs Key
        m_.database().ref("Users/"+State.usr_.ky+"/playlists/"+k+"/songs").orderByChild("songTitle").startAt(songname).endAt(songname+"\uf8ff").once("child_added", function(snap){
            if( artist == snap.child("artist").val()){
                let key = snap.key;

                // Delete Song
                m_.database().ref("Users/"+State.usr_.ky+"/playlists/"+k+"/songs/"+key).remove()
                .then(function(){
                    m_.database().ref("Users/"+State.usr_.ky+"/playlists").once("value", function(snap){
                        State.usr_.playlists = snap.val();
                    })
                })
                // Remove Menu
                $(".context_menu_mobile").remove()
                $("._pl_slctor_").remove()

                // Remove deleted Song
                $(song_).remove()
                
            }
        })
    },
    delete: function(){
        // Playlist and Song ID
        let song_ = State.songToplay;       let pl_id = State.open_pl.k;        let songname = $(song_).find(".s_playname").text();
        let sngindx = _.findIndex(Object.values(State.usr_.playlists[ pl_id ].songs), {"songTitle": songname} );
        let id = Object.keys( State.usr_.playlists[ pl_id ].songs )[sngindx]

        // Delete Fom Database
        m_.database().ref( "Users/" + State.usr_.ky + "/playlists/" + pl_id +"/songs/"+ id ).remove()
        
        // Remove Menu
        $(".context_menu_mobile").remove()
        $("._pl_slctor_").remove()

        // Remove deleted Song
        $(song_).addClass("deleted");
        setTimeout(function(){  $(song_).remove() },600);
    },
    to_q:function(){
        // Song 
        let song_ = State.songToplay
        let songname = $(song_).find(".s_playname").text();     let artist = $(song_).find(".a_playname").text();

        // Get Song from DB
        firebase.database().ref("songs").orderByChild("songTitle").startAt(songname).endAt(songname+"\uf8ff").once("child_added", function(snap){
            if( artist == snap.child("artist").val()){
                // Song Object
                let song = snap.val();
                                
                // Push to Queue
                State.q_.push({
                    songTitle: song.songTitle,
                    artist: song.artist,
                    songID: snap.key,
                    artwork:song.image,
                    iframe: song.iframe
                })

                // Re-render Q funct
                let r_rnd_q = function(){
                    // Get Tracks and Map
                    $(".q_cnt_main").html("")
                    State.q_.map(function(song, indx){
                        let track = queue.track_mkup(song.songTitle, song.artist);
                        $(".q_cnt_main").append(track)
                    })
                }
    
                // If Queue Open then Re-Render
                ( $(".app_body_").hasClass(".q_cont_sngs") == true ) ? r_rnd_q() : null;

                // Remove Menu
                $(".context_menu").remove()
                $(".context_menu_mobile").remove()
                $("._pl_slctor_").remove()
            }
        })
    },
    cls_menu:function(){
        return $(".context_menu_mobile").remove(), $("._pl_slctor_").remove()
    },
    downloadsong:function(){
       try { 
           if( State.PremiumSettings.subscriptionState == true ){
               // Get Song Name
               let songname = $($(State.songToplay).find(".dataContainer")).attr("data-songname");
               let songKey = $($(State.songToplay).find(".dataContainer")).attr("data-songid");
               
                // Get Song URL
                firebase.database().ref( "songs/" + songKey ).once("value", function(snap){
       
                    let iframe = snap.child("iframe").val();
       
                    // Song Object
                    let songObject = {
                        songid: snap.key,
                        artist: snap.child("artist").val(),
                        iframe: snap.child("iframe").val(),
                        image: snap.child("image").val(), 
                        songTitle: snap.child("songTitle").val(),
                        streamCount: snap.child("streamCount").val()
                    }
       
                    // Get storageURL 
                    let storage = m_.storage().ref().child("songsAll/" + iframe );
                    storage.getDownloadURL().then(function (url) {
                        songOperations.downloadsong(songname, url, songObject)
                    });            
                });
       
                // Close Context Menu
                $(".context_menu_mobile").remove();
           }
           else if(  State.PremiumSettings.subscriptionState == false ){
               let confirm_ = confirm("Must on Premium Plan to download songs. Press Ok to start Strma Premium.");
               if( confirm_ == true ){
                    Nav.menu();
                    setTimeout(() => {
                        Setting_.topUp();
                    }, 100);
               }
           }
    } catch (e) {
           alert(e.message)
       }
    },
    deleteSongFromDevice:function(){
        // Get Song ID
        let song_ = State.songToplay; 
        let id = State.selectedSongId;
        songOperations.deleteSong( id );

        // Close Options Menu
        $(".context_menu_mobile").remove();

        // Remove deleted Song
        $(song_).addClass("deleted");
        setTimeout(function(){  $(song_).remove() },600);
    }
}

// cls [prompt]
const cls_prompt = function(){
    return context.close_prompt()
}
// Options_stat
const opts = function(e){
    return context.exe(e, "static") 
}
// Options_stat
const opts_ = function(e){
    return context.exe(e, "playlist")
}
// Options_stat
const _opts_ = function(e){
    return context.exe(e, "home")
}
// Options_stat on Latest Music
const _opts_m = function(e){
    State.contToPlay = $(e).find(".latest_itm_cont"); dataContainer
    e = $(e).find(".latest_itm_cont")[0];
    return context.exe(e, "latest")
}
// Options Container for Downloaded SOngs
const optionsForDownloads = function(e){
    return context.exe(e, "downloads")
}
// ply btn
const ply_mnu = function(){
    return context.play_sng()
}
// open selctor
const slctor = function(e){
    return context.pl_selctr()
}
// open selctor
const slctor_ = function(){
    return context.pl_selctr("playlist")
}
// sdd2pl
const a2pl = function(e){
    return context.a_t_pl(e)
}
// del
const del = function(e){
    return context.delete()
}
const to_qu_ = function(){
    return context.to_q()
}
const close_mnu = function(){
    return context.cls_menu()
}
// delete song from device
const deleteFromDevice = function(){
    return context.deleteSongFromDevice()
}


const download_song = function(){
    return context.downloadsong()
}
