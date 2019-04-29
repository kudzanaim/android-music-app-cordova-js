const Home_ = {
    render:function(){
       try{
            // Close search if Open
            $(".resultsContainer").remove();
            $(".search_bar").val("");
            $(".cls_src_btn").remove()

            // Get markup
            var markup = ( navigator.onLine == true )? Home_.markup() : Home_.offline();

            // Render Page Container
            $(".app_body_").html(markup);

            // Render Playlists
            ( navigator.onLine == true )? this.do_playlists() : null;

            // Render tracks
            ( navigator.onLine == true )? this.doTracks() : null;

            // Popular Artists
            ( navigator.onLine == true )?this.do_artists() : null;

            // Render Albums
            ( navigator.onLine == true )? this.do_albums() : null;
       }
       catch(e){
           alert("Home: "+e.message)
       }
    },
    markup: function(){
        var output = `
            <div class="home_container_ navpage">
                
                <div class="strma_playlists home_section">
                    <div class="cont_hdr_">Recommended Playlists</div>
                    <div class="playlists_body"></div>
                </div>
                
                <div class="cont_hdr_">Popular Artists</div>
                <div class="popular_artist_ home_section">
                    <div class="popular_artists"></div>
                </div>
                
                <div class="new_tracks_ home_section">
                    <div class="cont_hdr_">Popular Now</div>
                    <div class="newtracks_body"></div>
                    <div class="show_more"><div class="shw_btn_ ripple" onclick="ldmr()">Show More</div></div>
                </div>
                
                <div class="new_albums_ home_section">
                    <div class="cont_hdr_">New Albums</div>
                    <div class="newalbums_body"></div>
                </div>

            </div>
        `;
        return output
    },
    offline:function(){
        let output = `
            <div class="home_container_ navpage">
                <div class="offline_container">
                    <svg class="offline_globe" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 31.416 31.416" style="enable-background:new 0 0 31.416 31.416;" xml:space="preserve"><g><g><g>
                        <path d="M28.755,6.968l-0.47,0.149L25.782,7.34l-0.707,1.129l-0.513-0.163L22.57,6.51l-0.289-0.934L21.894,4.58l-1.252-1.123    l-1.477-0.289l-0.034,0.676l1.447,1.412l0.708,0.834L20.49,6.506l-0.648-0.191L18.871,5.91l0.033-0.783l-1.274-0.524l-0.423,1.841    l-1.284,0.291l0.127,1.027l1.673,0.322l0.289-1.641l1.381,0.204l0.642,0.376h1.03l0.705,1.412l1.869,1.896l-0.137,0.737    l-1.507-0.192l-2.604,1.315l-1.875,2.249l-0.244,0.996h-0.673l-1.254-0.578l-1.218,0.578l0.303,1.285l0.53-0.611l0.932-0.029    l-0.065,1.154l0.772,0.226l0.771,0.866l1.259-0.354l1.438,0.227l1.67,0.449l0.834,0.098l1.414,1.605l2.729,1.605l-1.765,3.372    l-1.863,0.866l-0.707,1.927l-2.696,1.8l-0.287,1.038c6.892-1.66,12.019-7.851,12.019-15.253    C31.413,12.474,30.433,9.465,28.755,6.968z" data-original="#000000" class="active-path" data-old_color="#ffffff" fill="#ffffff"/>
                        <path d="M17.515,23.917l-1.144-2.121l1.05-2.188l-1.05-0.314l-1.179-1.184l-2.612-0.586l-0.867-1.814v1.077h-0.382l-2.251-3.052    v-2.507L7.43,8.545L4.81,9.012H3.045L2.157,8.43L3.29,7.532L2.16,7.793c-1.362,2.326-2.156,5.025-2.156,7.916    c0,8.673,7.031,15.707,15.705,15.707c0.668,0,1.323-0.059,1.971-0.137l-0.164-1.903c0,0,0.721-2.826,0.721-2.922    C18.236,26.357,17.515,23.917,17.515,23.917z" data-original="#000000" class="active-path" data-old_color="#ffffff" fill="#ffffff"/>
                        <path d="M5.84,5.065l2.79-0.389l1.286-0.705l1.447,0.417l2.312-0.128l0.792-1.245l1.155,0.19l2.805-0.263L19.2,2.09l1.09-0.728    l1.542,0.232l0.562-0.085C20.363,0.553,18.103,0,15.708,0C10.833,0,6.474,2.222,3.596,5.711h0.008L5.84,5.065z M16.372,1.562    l1.604-0.883l1.03,0.595l-1.491,1.135l-1.424,0.143l-0.641-0.416L16.372,1.562z M11.621,1.691l0.708,0.295l0.927-0.295    l0.505,0.875l-2.14,0.562l-1.029-0.602C10.591,2.526,11.598,1.878,11.621,1.691z" data-original="#000000" class="active-path" data-old_color="#ffffff" fill="#ffffff"/></g></g></g> 
                    </svg>
                    <div class="offilne_msg">Go online to browse your home</br> screen!</div>
                </div>
            </div>
        `;
        return output
    },
    doTracks: function(){
        
        // Connect to DB and get songs
        firebase.database().ref("songs").orderByChild("timeStamp").limitToFirst(5).on("value", function(snap){
            
            // Get Data from DB
            let songs = Object.values(  snap.val() );
            let keys = Object.keys(  snap.val() );

            // Map thru data to write to DOM
            const k =function(){
                songs.map( function(song, index){
                    if(song.songTitle != undefined){
                        // Mark up of playlist item
                        let songindx = _.findIndex( songs , { 'songTitle': song.songTitle, 'artist': song.artist });
                        let songkey = keys[ songindx ]; 
                        let markup = Home_.track_markup(song.songTitle, song.artist, song.image, index, songkey);
                        // Render item to DOM
                        $(".newtracks_body").append(markup)
                    }
                })
            }
            // delete "all" object
            keys.map(function(a,index){
                if(a == "all"){
                    // Clear Container
                    $(".newtracks_body").html("")
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
    do_playlists: function (){
        // Connect to DB and get Playlists
        firebase.database().ref("playlists").on("value", function(snap){
            
            // Get Data from DB
            var playlists = Object.values(  snap.val() );
            
            // Map thru data to write to DOM
            playlists.map( function(playlist, index){
                if(playlist.playlistName != undefined){
                    // Mark up of playlist item
                    var markup = Home_.playlists_markup(playlist.artwork, playlist.playlistName, index);
                    // Render item to DOM
                    $(".playlists_body").append(markup)
                }
            })

        })

    },
    do_artists:function(){
        // Get artists
        firebase.database().ref("popularArtists").on("value", function(snap){
            var artists = Object.values(snap.val())

            // Loop thru data
            artists.map( function(artist){
                if(artist.genre != undefined){

                    // Get image URL then append item
                    firebase.storage().ref("artistImages/" + artist.artistImage).getDownloadURL().then(function(url) {
                        
                        // artist mark up
                        var artist_item = Home_.artist_markup(artist.artistName, url);

                        // Append to DOM
                        $(".popular_artists").append(artist_item);

                    })
                }
            })
        })
    },
    artist_markup:function(name, image){
        var output = `
            <article class="artist_item_popular_" onclick="artget(this)">
                <img class="img_popular_artist" src="`+image+`">
                <div class="artist_name artist">`+name+`</div>
            </article>
        `;
        return output
    },
    do_albums: function(){
        // Connect to DB and get Playlists
        firebase.database().ref("albums").on("value", function(snap){
            
            // Get Data from DB
            var albums = Object.values(  snap.val() );
            
            // Map thru data to write to DOM
            albums.map( function(album, index){
                if( album.albumTitle!= undefined){
                    // Mark up of playlist item
                    var markup = Home_.album_markup( album.albumTitle, album.Artist, album.albumArtwork, index)
                    // Render item to DOM
                    $(".newalbums_body").append(markup)
                }
            })

        })
    },
    playlists_markup: function(artwork, playlist_name, index){
        var output = `
            <div class="playlist_item_" onclick="plget(this)" id="playlist" title="`+index+`">
                <img src="`+artwork+`" class="playlist_artwork" title="`+index+`">
                <div class="playlist_name playlist" title="`+index+`">`+playlist_name+`</div>
            </div>
        `;
        return output
    },
    track_markup: function(songname_, artist_, img_, index, objectID){
        var output = `
            <div class="newtrack_item ripple"  id="song" title="`+index+`">
                <div class="_metaContainerCont_ dataContainer" onclick="_p_(this)" data-image="`+img_+`" data-songid="`+objectID+`" data-songname="`+songname_+`" data-artistname="`+artist_+`" >
                    <img src="`+img_+`" class="track_img_" title="`+index+`">
                    <div class="meta_itm_cont" title="`+index+`">
                        <div class="track_songname_ s_playname" title="`+index+`">`+songname_+`</div>
                        <div class="track_artist_ a_playname" title="`+index+`">`+artist_+`</div>
                    </div>
                </div>
                <div class="song_options_img_ocnt" onclick="_opts_(this)">
                    <img class="song_options_" src="assets/icons/more.png">
                </div>
            </div>
        `;
        return output
    },
    album_markup:function(album_, artist_, img_, index){
        var output = `
            <div class="album_item" onclick="alget(this)" id="album" title="`+index+`">
                <img src="`+img_+`" class="album_img_" title="`+index+`">
                <div class="album_meta_itm_cont" title="`+index+`">
                    <div class="album_songname_ album" title="`+index+`"><div class="nme_hlder_home">`+album_+`</div></div>
                    <div class="album_artist_" title="`+index+`">`+artist_+`</div>
                    <span class="al_it_artist album_artist_db" title="`+index+`">`+artist_+`</span>
                </div>
            </div>
        `;
        return output
    },
    loadmore:function(){
        if($(".newtracks_body").hasClass("unset_grid") == false){
            
            firebase.database().ref("songs").orderByKey().startAt(State.last_item_key).limitToFirst(5).on("value", function(snap){
                var songs = Object.values(snap.val());
                var keys = Object.keys(snap.val());
                
                if( songs.length > 2){
                    // Save offset itemKey
                    State.last_item_key = keys[keys.length - 1]
                    // pop off offset
                    songs.pop()
                    // Clear Container
                    $(".newtracks_body").html("")
                    // Proceed
                    songs.map( function(song, index){
                        if(song.songTitle != undefined){
                            // Mark up of playlist item
                            var markup = Home_.track_markup(song.songTitle, song.artist, song.image, index);
                            // Render item to DOM
                            $(".newtracks_body").append(markup)
                        }
                    })
                }
                else if(songs.length <= 2){
                    $(".newtracks_body").addClass("unset_grid")
                    return $(".newtracks_body").html(`<p style="width:84vw; text-align:center">All Songs Appended</p><p style="font-weight:100; font-size:12px; text-align: center; width: 84vw;">Click button below again to go back to first songs.</p>`)
                }
            
                
            })
        }
        else if($(".newtracks_body").hasClass("unset_grid") == true){
            $(".newtracks_body").removeClass("unset_grid");
            return Home_.doTracks()
        }
    }
}

// Load more songs
const ldmr = function(){
    return Home_.loadmore()
}
const hm_rndr_ = function(){
    if($(".app_body_").find(".home_container_").length >0){
        return Home_.render()
    }
}