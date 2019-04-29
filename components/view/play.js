const Player = {
    toQueue:function(param, type){
        
        // Close Context Menu
        $(".context_menu_mobile").remove();

        // Get Connection
        let connection = this.connectionDetect();
        
        // Song Meta
        let songname = $(param).find(".s_playname").text();
        let artistname = $(param).find(".a_playname").text();

        // Add song to State
        State.currentlyPlaying = {title: songname, artist:artistname};

        // Get Container
        let container = $(param)[0].parentNode.parentNode.className;

        // Emtpy Queue if played from Album
        let imi_ = function(){ 
            // if(type =="album_playlists"){
            if( container == "album_trcks_cont" || container == "popular_songs_cont"){
                let item_index = parseInt($(param).attr("title"));
    
                // Get Tracks
                let tracks_= ( container =="popular_songs_cont" )? Object.values($(".popular_songs_cont").find(".albmtrack_item_open")) : Object.values($(".album_trcks_cont").find(".albmtrack_item_open"));
                let tracks__lngth = ( container == "popular_songs_cont" )? $(".popular_songs_cont").find(".albmtrack_item_open").length :
                $(".album_trcks_cont").find(".albmtrack_item_open").length;
                tracks_.length = tracks__lngth;
    
                // Tracks to be Removed
                let num_of_tracks2rmv = item_index;

                let prev_songs = tracks_.splice( 0, num_of_tracks2rmv );
                
                // Empty Queue
                State.q_ = [];
    
                // Append Song to bottom of Queue
                tracks_.push.apply(tracks_, prev_songs);
                
                // Map thru tracks
                tracks_.map(function(song,indx_){
    
                    // Get name & osng for DB query
                    let song_n = $(song).find(".s_playname").text();
                    let song_a = $(song).find(".a_playname").text();
    
                    if( navigator.onLine == true){
                        // Query DB
                        firebase.database().ref("songs").orderByChild("songTitle").startAt(song_n).endAt(song_n+"\uf8ff").once("child_added", function(snap){
                            // Match exact songartist
                            if(song_a == snap.child("artist").val()){
                                let song = snap.val();
                                
                                // Push to Queue
                                State.q_.unshift({
                                    songTitle: song.songTitle,
                                    artist: song.artist,
                                    songID: snap.key,
                                    artwork:song.image,
                                    iframe: song.iframe
                                })
    
                                // Play Song
                                setTimeout(function(){Player.play()}, 1000)
                            }
                        })
                    }
                    else if( navigator.onLine == false ){
                        alert("Playing Offline|| Song:: "+song_n +" Artist:: "+song_a);
                        // Get Song File
                        sys_operations.getSongMeta(song_n, song_a)
                    }

                })
            }
            else{
                // if song is already in playlist
                State.q_.map(function(song, index){
                    if(songname == song.songTitle){
                        State.q_.splice(index, 1)
                    }
                })
        
                // if Connected to Internet
                if( navigator.onLine == true){
                    // Query DB
                    firebase.database().ref("songs").orderByChild("songTitle").startAt(songname).endAt(songname+"\uf8ff").once("child_added", function(snap){
                        // Match exact songartist
                        if(artistname == snap.child("artist").val()){
                            let song = snap.val();
                            let p1_ = State.q_[0];
                            
                            // Move to Current 1st to Last FIFO
                            ( State.q_.length > 1)? ( State.q_.shift(), State.q_.push(p1_) ):null;
            
                            // Push to Queue
                            State.q_.unshift({
                                songTitle: song.songTitle,
                                artist: song.artist,
                                songID: snap.key,
                                artwork:song.image,
                                iframe: song.iframe
                            })
            
                            // Play Song
                            setTimeout(function(){Player.play()}, 1000)
                        }
                    })
                }
                // If Offline
                else if( navigator.onLine == false ){
                    // Get Song File
                    sys_operations.getSongMeta(songname, artistname)
                }
            }
        }

        imi_()
    },
    play:function(offline_url){ 
        // Show Spinner for 3secs
        $(".App_Root").append(` <div class="spinner_container"><div class="mk-spinner-centered mk-spinner-ring"></div>
        <div class="spin_text"></div></div>`);

        // Remove spinner when song playing
        let remove_spin = setInterval(function(){
            if($(".audioElement")[0].currentTime > 0){
                clearInterval(remove_spin)
                $(".spinner_container").remove()  
            }  
        }, 100)

        // Get song URL
        if( navigator.onLine == true){
            let s = State.q_[0];
            let l = m_.storage().ref().child("songsAll/" + s.iframe);
            l.getDownloadURL().then(function (u) {
                
                // Add URL to audio source
                $(".audioElement")[0].src = null;
                $(".audioElement")[0].src = u;
                
                // Play song
                Player.controls("play");
                
                // Count Stream once play init
                let c_ = setInterval(function(){
                    if( $(".audioElement")[0].currentTime >= 15){
                        // clear interval and count
                        clearInterval(c_)
                        Player.countStream( State.q_[0].songTitle, State.q_[0].artist )
                    }
                }, 10); 

                // Meta Operations
                Player.meta_ops()
        });
        }
        else if( navigator.onLine == false){
            // Add URL to audio source
            $(".audioElement")[0].src = null;
            $(".audioElement")[0].src = offline_url;
            
            // Play song
            Player.controls("play");
            
            // Count Stream once play init
            let c_ = setInterval(function(){
                if( $(".audioElement")[0].currentTime >= 15){
                    // clear interval and count
                    clearInterval(c_);
                    songOperations.updateStreamCount( State.q_[0].songTitle, State.q_[0].artist);
                }
            }, 10); 

            // Meta Operations
            Player.meta_ops()
        }
    },
    next:function(){
        // q length
        let s_ = State.q_.length;
        let s = State.q_;
        
        // If 1songs
        if( s_ == 1 ){
            // Repeat song at position 1
            Player.play()
        }
        
        // More than 1
        else if( s_ >1){
            // unshift index 0 to end of array
            let s1 = s[0];
            State.q_.shift();
            State.q_.push(s1)

            // Then Play
            Player.play()
        }
        
        // if 0
        else if(0){
            return
        }
    },
    prev:function(){
        // q length
        let s_ = State.q_.length;
        let s = State.q_;
        
        // If 1song
        if( s_ == 1 ){
            // Repeat song at position 1
            Player.play()
        }
        
        // More than 1
        else if( s_ >1){
            // unshift last index to 1st position
            let s1 = s[ s_ - 1 ];
            State.q_.pop();
            State.q_.unshift(s1)

            // Then Play
            Player.play()
        }
        
        // if 0
        else if(0){
            return
        }
    },
    countStream:function(songName, artist_){
        firebase.database().ref("songs").orderByChild("songTitle").startAt(songName).endAt(songName+"\uf8ff").once("child_added", function(snap){
            // Match artist b4 proceed
            if( artist_ == snap.child("artist").val()){
                // Get Data
                let streams = snap.child("streamCount").val() + 1;
                let key = snap.key;
                let newref = {
                    artist: snap.val().artist,
                    iframe: snap.val().iframe,
                    image: snap.val().image,
                    songTitle: snap.val().songTitle,
                    streamCount: streams,
                    timeStamp:snap.val().timeStamp,
                }
                // Update Ref with New Count
                firebase.database().ref( "songs/" + key ).update( newref )
            }
        })
    },
    meta_ops:function(){
        // Await song to start play
        let sp_ = setInterval(function(){if($(".audioElement")[0].currentTime >0){    clearInterval(sp_), procd_()}}, 10);
        
        // Proceed after song start
        let procd_ = function(){

            // Change MetaData
            let artwork_ = State.q_[0].artwork;     let songTitle_ = State.q_[0].songTitle;        let artist_ = State.q_[0].artist;
            $(".meta_src_pc").attr("src", artwork_);         $(".songName_meta").text(songTitle_);                       $(".artistName_meta").text(artist_);
            
            (  $(".App_Root").find(".img_toggle_cont").length > 0 ) ? $(".toggle_songimg_").attr("src", artwork_): null; 

            // Android Media Controls
            Player.start( songTitle_, artist_, artwork_ );

            // Update Duration
            let d_ = Player.d($(".audioElement")[0].duration)
            $(".duration_time").text(d_)          

            // Change Controls || Buttons ||
            let q = setInterval(function () {
                // Update Slider
                Player.slider(q);
                // Update time
                Player.t_changer();
            }, 1000); 
        }
    },
    slider:function (z) {
        // Get audio Element
        let x_new = $(".audioElement")[0];
        let width_incr = Math.ceil((x_new.currentTime / x_new.duration) * 100) + "%";
        
        // Update duration Bar
        $(".duration_slider").css("width", width_incr);

        // Update Slider Dot
        ($(".sliderDot").length > 0)? $(".sliderDot").css("left", $("#duration_bar")[0].offsetWidth * (x_new.currentTime / x_new.duration) ) : null;
        
        // When SongEnd
        Player.songEnded(z);
    },
    songEnded: function(a){
        let currT = $(".audioElement")[0].currentTime;
        let currD = $(".audioElement")[0].duration;
        if (currT == currD) {
            clearInterval(a);
            // Change Controls
            Player.controls("pause");
            // Remove Song From Elemnt
            $(".audioElement").attr("src","null")
            // Continuos Play
            if(State.q_.length >1){
                setTimeout(function(){
                    Player.controls("next")
                },2000)
            }
        }
    },
    t_changer: function() {
        let CT_raw = $(".audioElement")[0].currentTime;
        // i. Check if track has started and if not keep checking then Update Duration Meta
        let duChecker = setInterval(function(){
          if (CT_raw != 0) {
            clearInterval(duChecker);
            let time = CT_raw / 60;
            let minutes = Math.floor(time);
            if (minutes < 10) {
              minutes = "0" + minutes;
            }
            let secr = time - minutes;
            let sec = Math.ceil(secr * 60);
            if (sec < 10) {
              sec = "0" + sec;
            }
            let current_time = minutes + ":" + sec;
            $(".crnt_time").text(current_time);
          }
        });
    },
    controls:function(call_){
        // Message
        let call = ( $(call_).attr("title") != undefined)? $(call_).attr("title") : call_;
    
        // switch by call
        switch(call){
            case "play":
                return  $(".audioElement")[0].play(), $(".play").css("display", "none"), $(".pause").css("display", "block")
            case "pause":
                return $(".audioElement")[0].pause(), $(".play").css("display", "block"), $(".pause").css("display", "none")
            case "next":
                return Player.next()
            case "prev":
                return Player.prev()
        }
    },
    d:function(CT_raw){
        // Get Sec & Min
        let time = CT_raw / 60;     let minutes = Math.floor(time);
        // Min correction
        if (minutes < 10) {     minutes = "0" + minutes;    }
        // Sec 60
        let secr = time - minutes;      let sec = Math.ceil(secr * 60);
        // Sec Correction
        if (sec < 10) {     sec = "0" + sec;    }
        
        return  minutes + ":" + sec;
    },
    sld_mover:function() {
        $(".duration_bar").click(function (event) {

            // Parameters
            let CurrntSong_duration = $(".audioElement")[0].duration;
            let T = ( $(document)[0].body.clientWidth < 600) ? $(document)[0].body.clientWidth : parseInt($(".duration_bar").css("width"));
            let x = $(".duration_bar").offset().left;
            let y = event.pageX;
            let z = ((y - x) / T) * 100;
            let new_width = Math.ceil(Math.abs(z)) + "%";

            // Update Duration Bar
            $(".duration_slider").css("width", new_width);

            // Update Slider Dot
            $(".sliderDot").css("left", $("#duration_bar")[0].offsetWidth * (z/100) );

            // Convert width to time;
            let seek_value = (Math.abs(y - x) / T) * CurrntSong_duration;

            // Seek to Duration
            let set_currentTime =  function(){  $(".audioElement")[0].currentTime = seek_value };
            ( $(".audioElement").attr("src") != "null" )? set_currentTime() : null;

        });
    },
    open_latest_rls:function(param){
        // Get Type of object
        let type = $(param).attr("id");

        // Switch
        switch(type){
            case "album":
                return Pages.render_page( "album", param)
            case "song":
                return Player.toQueue(param)
        }
    },
    toggle_player:function(){

        // Get State of container
        let toggle_state = (  $(".App_Root").find(".toggle_container").length >= 1 )? true: false;

        // Remove if open
        if(  toggle_state == true  ){
            // Toggle regular duration bar
            $($(".duration_barcontainer")[1]).css("display", "block");
            $(".songName_meta").css("font-size","3vw")
            
            // Correct Play Pause
            if(   $(".audioElement")[0].paused == false  ){
                // Change Play icon
                $(".play").css("display", "none");     
                $(".pause").css("display", "block");
            }

            return $(".toggle_container").remove()
        }
        // Toggle open if closed
        else if(    toggle_state  == false   ){
            // Toggle regular duration bar
            $($(".duration_barcontainer")[1]).css("display", "none")

            // Markup
            let img_ = (  State.q_.length > 0  )? State.q_[0].artwork: "";
            let markup = this.toggle_mkup(img_)

            // Append 
            $(".App_Root").append(markup)

            let durationBar = Player.toggleControlsMarkup("durationbar");
            let controls = Player.toggleControlsMarkup("controls");
            let meta = Player.toggleControlsMarkup("meta");
            
            // Append Controls and time
            $(".toggle_controls").append(durationBar).append(meta).append(controls);

            // Set Event listener for mobile duration bar seek
            Player.eventListeners()

            // Correct Play Pause
            if(   $(".audioElement")[0].paused == false  ){
                // Change Play icon
                $(".play").css("display","block");     
                $(".pause").css("display","none");

                // Correct Artwork
                let a_ = State.q_[0].artwork;
                $(".toggle_songimg_").attr("src", a_);
            }
        }

    },
    toggleControlsMarkup:function(type){
        let song = (State.currentlyPlaying != null)? State.currentlyPlaying.title : "No Song Selected" ;
        let artist = (State.currentlyPlaying != null)? State.currentlyPlaying.artist : "No Artist" ;

        let durationBar = `<div class="duration_barcontainer duration_barcontainer_toggle"><div class="crnt_time crnt_time_toggle">0:00</div>
        <div id="duration_bar" class="duration_bar duration_bar_toggle" onclick="sk_()"><div class="duration_slider _duration_slider_"></div>
        <div id="sliderDot" class="sliderDot"></div></div><div class="duration_time duration_time_toggle">0:00</div></div>`;

        let controls = `<div class="media-controls_toggle"><img src="assets/icons/prevv.png" class="prev iterators__toggle" onclick="cnls(this)" title="prev">
        <img src="assets/icon/play.png" class="play playpause_" onclick="cnls(this)" title="play"><img src="assets/icon/pause.png" class="pause playpause_" onclick="cnls(this)" title="pause">
        <img src="assets/icons/nextt.png" class="next iterators__toggle" onclick="cnls(this)" title="next"></div>`;

        let meta = `<div class="metaText_toggle"><div class="songName_meta_toggle">`+song+`</div>
        <div class="artistName_meta artistName_meta_toggle">`+artist+`</div></div>`;

        switch(type){
            case "durationbar":
                return durationBar
            case "controls":
                return controls
            case "meta":
                return meta
        }
    },
    toggle_mkup:function(img){
        let output = `
            <div class="toggle_container">
                <div class="close_toggle_cont_opn" >
                    <span class="close_toggle_opn" onclick="_tgl_plyr_()">
                        <svg class="close_toggle_icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 306 306" style="enable-background:new 0 0 306 306;" xml:space="preserve" class="">
                        <g><g><g id="expand-more"><polygon points="270.3,58.65 153,175.95 35.7,58.65 0,94.35 153,247.35 306,94.35   " data-original="#000000" class="active-path" data-old_color="#9F9E9E" fill="#A1A1A1"/>
                        </g></g></g></svg>
                    </span>
                    <span class="nowplaying_txt">Now Playing</span>
                </div>
                <div class="toggle_meta_cont">
                    <div class="img_toggle_cont"><img src="`+img+`" class="toggle_songimg_"></div>
                </div>
                <div class="toggle_controls"></div>
            </div>
        `;
        return output
    },
    eventListeners:function(){
        let move_event = ( $(document)[0].body.clientWidth < 768)? "touchmove":"mousemove";
        let mousedown_event = ( $(document)[0].body.clientWidth < 768)? "touchstart":"mousedown";

        // Mouse Down
        document.getElementById("sliderDot").addEventListener(mousedown_event, function(e){
            // Prevent Drag Effect showing
            e.preventDefault();
            // Update Object
            State.mouse_state.mouseup = false;

            // Set mouseup listener
            State.mouse_state.uplistener = setInterval(() => {
                // if mouseUp
                if(State.mouse_state.mouseup == true){
                    // Clear interval
                    clearInterval(State.mouse_state.uplistener);
                    // Remove event listeners
                    return $(document).off( move_event ), $(document).off( "mouseup")
                }
            }, 10);

            // Mouse Up by device type
            ( $(document)[0].body.clientWidth < 768)? 
            document.querySelector(".sliderDot").addEventListener("touchend", function(e_){State.mouse_state.mouseup = true}) : document.querySelector(".sliderDot").addEventListener("mouseup", function(e_){State.mouse_state.mouseup = true});

            document.querySelector(".sliderDot").addEventListener(move_event, function(e_){
                // X  value
                let x = ($(document)[0].body.clientWidth < 768)? e_.changedTouches[0].clientX: e_.pageX;

                // Convert 
                let left_ = x - $("#duration_bar").offset().left;
                let width_ = Math.floor((left_/$("#duration_bar")[0].offsetWidth)*100);

                // Change slider width
                Player.changesliderWidth(left_, width_);
                
            })
        })   
    },
    changesliderWidth: function(left_, width_){
        let sliderEndXcord = $("#duration_bar")[0].offsetWidth;

        left_ = ( left_ < 0)? 0: ( left_ > sliderEndXcord) ? sliderEndXcord : left_;
        width_ = ( width_ < 0)? 0: ( width_ > 100) ? 100 : width_;
        let newTime = (width_/100)*$(".audioElement")[0].duration;

        // Move left position of Dot
        $(".sliderDot").css("left", left_-3);

        // Change Slider Width
        $(".duration_slider").css("width", `${width_}%`);

        // Change Song Time
        (   $(".audioElement").attr("src") != "null" )? ( $(".audioElement")[0].currentTime = newTime ): null;
    },
    connectionDetect: function(){
        // get connection status
        return navigator.onLine;
    },
    // inititiate media controller
    start: function(track_Name, track_Artist, image){
        MusicControls.create({
            track       : track_Name,
            artist      : track_Artist,
            cover       : image,
            
            // cover can be a local path (use fullpath 'file:///storage/emulated/...', or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
            isPlaying   : true,
            dismissable : true,
         
            // hide previous/next/close buttons:
            hasPrev   : true,
            hasNext   : true,
            hasClose  : true,
         
            // Android only, optional
            ticker	  : `Now playing `+track_Name+``,

            // The supplied drawable name, e.g. 'media_play', is the name of a drawable found under android/res/drawable* folders
            playIcon: 'media_play',
	        pauseIcon: 'media_pause',
	        prevIcon: 'media_prev',
	        nextIcon: 'media_next',
	        closeIcon: 'media_close',
            notificationIcon: 'notification'
        }, ()=>{  }, ()=>{ });
    },
    // Define media event actions
    events: function() {
        // alert(action)
        function events(action){
            alert(action)
            const message = JSON.parse(action).message;
                switch(message) {
                    case 'music-controls-next':
                        Player.next();
                        break;
                    case 'music-controls-previous':
                        Player.prev();
                        break;
                    case 'music-controls-pause':
                        Player.controls("pause");
                        MusicControls.updateIsPlaying(false); 
                        break;
                    case 'music-controls-play':
                        Player.controls("play")
                        MusicControls.updateIsPlaying(true); 
                        break;
                    case 'music-controls-destroy':
                        MusicControls.destroy(()=>{}, ()=>{});
                        break;
                    case 'music-controls-headset-unplugged':
                        Player.controls("pause")
                        break;
                    case 'music-controls-headset-plugged':
                        Player.controls("play")
                        break;
                    default:
                        break;
                }   
        }
        MusicControls.subscribe(events);
    },
    // listen for Events
    listen: function(){
        MusicControls.listen();
    }
}

const p_ = function(param){ // Play function
    $(".audioElement")[0].src = null;
    $(".audioElement")[0].src = "/blank";
    $(".audioElement")[0].play()
    return Player.toQueue(param, "album_playlists")
}
const _p_ = function(param){ // Play function
    $(".audioElement")[0].src = null;
    $(".audioElement")[0].src = "/blank";
    $(".audioElement")[0].play()

    return Player.toQueue(param, "single")
}
const _p_m = function(){ // Play function

    $(".audioElement")[0].src = null;
    $(".audioElement")[0].src = "/blank";
    $(".audioElement")[0].play()

    return Player.toQueue(State.contToPlay, "single")
}
const cnls = function(param){
    return Player.controls(param)
}
const sk_ = function(){
    return Player.sld_mover()
}
const nw_rls = function(param){ // Play function
    return Player.open_latest_rls(param)
}
const _tgl_plyr_ = function(){
    return Player.toggle_player()
}