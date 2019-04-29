var Releases_ = {
    render: function(){
        var markup = this.markup();

        // Render Body
        $(".app_body_").html(markup)

        // Render albums
        this.render_music();

        // Render Songs
        return this.render_songs()
    },
    markup: function(){
        var output = `
            <div class="new_release_cont_">
                
                <section class="albums-all-cont">
                    <h1 class="releases_cont_hdr_">Latest Albums</h1>
                    <div class="album_cont_new"></div>
                </section>

                <section class="songs-all-cont">
                    <h1 class="releases_cont_hdr_">Latest Songs</h1>
                    <div class="songs_cont_new"></div>
                    <div class="show_more"><div class="shw_btn_ ripple" onclick="ldmr_()">Show More</div></div>
                </section>

            </div>
        `;
        return output
    },
    render_music:function(){
        // Get Albums
        firebase.database().ref("albums").on("value", function(snap){
            var albums = Object.values(snap.val());

            // Render albums
            firebase.database().ref("albums").once("value").then( function(snap){    return snap.val()  }).then(function(){
                albums.map( function(album){
                    if( album.albumTitle!= undefined){
                        // Mark up of playlist item
                        var markup = this.album_markup( album.albumTitle, album.Artist, album.albumArtwork)
                        // Render item to DOM
                        $(".album_cont_new").append(markup)
                    }
                })
            })
        })
    },
    render_songs:function(){
        firebase.database().ref("songs").orderByChild("timeStamp").limitToFirst(9).on("value", function(snap){
            // Get osngs
            var songs = Object.values(snap.val());
            var keys = Object.keys(snap.val());

            // Map thru data to write to DOM
            var k =function(){
                songs.map( function(song){
                    if(song.songTitle != undefined){
                        // Mark up of playlist item
                        var markup = Releases_.song_markup(song.songTitle, song.artist, song.image);
                        // Render item to DOM
                        $(".songs_cont_new").append(markup)
                    }
                })
            }

            // delete "all" object
            keys.map(function(a,index){
                if(a == "all"){
                    // delete all
                    keys.splice(index, 1);
                    // assign new key
                    State.last_item_key = keys[keys.length - 1]
                    // pop off offset
                    songs.pop()
                    // proceed
                    k()
                }
            })
            
        })
    },
    album_markup:function(album_, artist_, img_){
        var output = `
            <div class="album_item ripple">
                <img src="`+img_+`" class="album_img_">
                <div class="album_meta_itm_cont">
                    <div class="album_songname_">`+album_+`</div>
                    <div class="album_artist_">`+artist_+`</div>
                </div>
            </div>
        `;
        return output
    },
    song_markup:function(song_, artist_, img_){
        var output = `
            <div class="song_l_item ripple">
                <img src="`+img_+`" class="songl_img_">
                <div class="songl_meta_itm_cont">
                    <div class="song_nametitle_">`+song_+`</div>
                    <div class="song_artist_">`+artist_+`</div>
                </div>
            </div>
        `;
        return output
    },
    loadmore:function(){
        firebase.database().ref("songs").orderByKey().startAt(State.last_item_key).limitToFirst(9).on("value", function(snap){
            var songs = Object.values(snap.val());
            var keys = Object.keys(snap.val());
        
            // Save offset itemKey
            State.last_item_key = keys[keys.length - 1]
            // pop off offset
            songs.pop()
            // Clear Container
            $(".songs_cont_new").html("")
            // Proceed
            songs.map( function(song){
                if(song.songTitle != undefined){
                    // Mark up of playlist item
                    var markup = Releases_.song_markup(song.songTitle, song.artist, song.image);
                    // Render item to DOM
                    $(".songs_cont_new").append(markup)
                }
            })
        })
    }
}

var ldmr_ = function(){
    return Releases_.loadmore()
}

