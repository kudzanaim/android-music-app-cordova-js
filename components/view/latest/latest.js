const Latest = {
    // Render and Container Markup
    page_markup: function(){
        var output = `
            <div class="new_release_cont_ navpage">
                <h1 class="nw_cont_hdr">New Releases</h1>
                <div class="newrelease_tabs">
                    <button class="release_tab_new newsongs_tab_ tab_active_new" data-name="songtab" onclick="_taber_(this)">Songs</button>
                    <button class="release_tab_new newalbums_tab_" data-name="albumtab" onclick="_taber_(this)">Albums</button>
                </div>
                <div class="newrelease_cont_tabs">  </div>
                <button class="pagination_container" onclick="">Load More</button>
            </div>
        `;
        return output
    },
    offline:function(){
        var output = `
            <div class="new_release_cont_ new_release_cont_offline navpage">
                <h1 class="nw_cont_hdr nw_cont_hdr_offline">New Releases</h1>
                <div class="newrelease_tabs">
                    <button class="release_tab_new newsongs_tab_ tab_active_new tab_active_new_offline" data-name="songtab" >Songs</button>
                    <button class="release_tab_new newalbums_tab_ newalbums_tab_offline" data-name="albumtab" >Albums</button>
                </div>
                <div class="newrelease_cont_tabs_offline"> 
                    <div class="offline_container_latest">
                        <svg class="offline_globe" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 31.416 31.416" style="enable-background:new 0 0 31.416 31.416;" xml:space="preserve"><g><g><g>
                            <path d="M28.755,6.968l-0.47,0.149L25.782,7.34l-0.707,1.129l-0.513-0.163L22.57,6.51l-0.289-0.934L21.894,4.58l-1.252-1.123    l-1.477-0.289l-0.034,0.676l1.447,1.412l0.708,0.834L20.49,6.506l-0.648-0.191L18.871,5.91l0.033-0.783l-1.274-0.524l-0.423,1.841    l-1.284,0.291l0.127,1.027l1.673,0.322l0.289-1.641l1.381,0.204l0.642,0.376h1.03l0.705,1.412l1.869,1.896l-0.137,0.737    l-1.507-0.192l-2.604,1.315l-1.875,2.249l-0.244,0.996h-0.673l-1.254-0.578l-1.218,0.578l0.303,1.285l0.53-0.611l0.932-0.029    l-0.065,1.154l0.772,0.226l0.771,0.866l1.259-0.354l1.438,0.227l1.67,0.449l0.834,0.098l1.414,1.605l2.729,1.605l-1.765,3.372    l-1.863,0.866l-0.707,1.927l-2.696,1.8l-0.287,1.038c6.892-1.66,12.019-7.851,12.019-15.253    C31.413,12.474,30.433,9.465,28.755,6.968z" data-original="#000000" class="active-path" data-old_color="#ffffff" fill="#ffffff"/>
                            <path d="M17.515,23.917l-1.144-2.121l1.05-2.188l-1.05-0.314l-1.179-1.184l-2.612-0.586l-0.867-1.814v1.077h-0.382l-2.251-3.052    v-2.507L7.43,8.545L4.81,9.012H3.045L2.157,8.43L3.29,7.532L2.16,7.793c-1.362,2.326-2.156,5.025-2.156,7.916    c0,8.673,7.031,15.707,15.705,15.707c0.668,0,1.323-0.059,1.971-0.137l-0.164-1.903c0,0,0.721-2.826,0.721-2.922    C18.236,26.357,17.515,23.917,17.515,23.917z" data-original="#000000" class="active-path" data-old_color="#ffffff" fill="#ffffff"/>
                            <path d="M5.84,5.065l2.79-0.389l1.286-0.705l1.447,0.417l2.312-0.128l0.792-1.245l1.155,0.19l2.805-0.263L19.2,2.09l1.09-0.728    l1.542,0.232l0.562-0.085C20.363,0.553,18.103,0,15.708,0C10.833,0,6.474,2.222,3.596,5.711h0.008L5.84,5.065z M16.372,1.562    l1.604-0.883l1.03,0.595l-1.491,1.135l-1.424,0.143l-0.641-0.416L16.372,1.562z M11.621,1.691l0.708,0.295l0.927-0.295    l0.505,0.875l-2.14,0.562l-1.029-0.602C10.591,2.526,11.598,1.878,11.621,1.691z" data-original="#000000" class="active-path" data-old_color="#ffffff" fill="#ffffff"/></g></g></g> 
                        </svg>
                        <div class="offilne_msg">Go online to browse all the latest</br>songs.</div>
                    </div>
                </div>
            </div>
        `; 
        return output
    },
    render:function(){
        // Get markup
        var markup =  ( navigator.onLine == true )? this.page_markup() : this.offline();
        // Render Container
        $(".app_body_").html(markup);
        // Render Songs
        return this.get_songs()
    },
    song_tab_markup: function(){
        var output = `
            <section class="albums-all-cont">
                <h1 class="releases_cont_hdr_">Latest Albums</h1>
                <div class="album_cont_new"></div>
                <div class="pagination_container" onclick="loadsongs()">Load More</div>
            </section>
        `;
        return output
    },
    album_tab_markup: function(){
        var output = `
            <section class="albums-all-cont">
                <h1 class="releases_cont_hdr_">Latest Albums</h1>
                <div class="album_cont_new"></div>
                <div class="pagination_container" onclick="loadalbums()">Load More</div>
            </section>
        `;
        return output
    },
    // Album & Song Markup
    song_mkp:function(songname_, artist, artwork, index, objectID){
        var output = `
            <div class="latest_songitem dataContainer" id="song" onclick="_opts_m(this)" title="`+index+`"
                data-image="`+artwork+`" data-songid="`+objectID+`" data-songname="`+songname_+`" data-artistname="`+artist+`" 
            >
                <div class="_songartwork_new">
                    <img class="_songart_work_new" src="`+artwork+`">
                </div>
                <div class="latest_itm_cont"  title="`+index+`">
                    <div class="track_songname_ s_playname" title="`+index+`">`+songname_+`</div>
                    <div class="track_artist_ a_playname" title="`+index+`">`+artist+`</div>
                </div> 
            </div>
        `;
        return output
    },
    album_markup:function(album_, artist_, img_, index){
        function length_size(){
            var s = album_.split(" ");
            s.length = 14;
            album_ = s.join(" ") + "..."
        }

        // Shorten Long Album Names
        (album_.length > 15)? length_size(): null;

        var output = `
            <div class="album_item " onclick="alget(this)" id="album" title="`+index+`">
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
    // get Songs and Albums
    get_albums:function(){
        // Append Album Paginator
        $(".pagination_container").removeClass("disabled_");
        $(".pagination_container").attr("onclick", "loadalbums()");
        $(".pagin_message").remove()
        
        // Get Albums
        firebase.database().ref("albums").orderByChild("timeStamp").limitToFirst(10).on("value", function(snap){
            var albums = Object.values(snap.val());
            var keys = Object.keys(snap.val());

            // Render albums
           var k = function(){
            albums.map( function(album, index){
                if( album.albumTitle!= undefined){
                    // Mark up of playlist item
                    var markup = Latest.album_markup( album.albumTitle, album.Artist, album.albumArtwork, index)
                    // Render item to DOM
                    $(".newrelease_cont_tabs").append(markup)
                }
            })
           }

            // delete "all" object
            keys.map(function(a,index){
                if(a == "albums"){
                    // delete all
                    keys.splice(index, 1);
                    // assign new key
                    State.last_item_key_albums = keys[keys.length - 1]
                    // pop off offset
                    albums.pop()
                    // proceed
                    k()
                }
            })
        })
    },
    get_songs:function(){
        firebase.database().ref("songs").orderByChild("timeStamp").limitToFirst(9).on("value", function(snap){
            // Append Song Paginator Clickhandler
            $(".pagination_container").removeClass("disabled_");
            $(".pagination_container").attr("onclick", "loadsongs()");
            $(".pagin_message").remove()

            // Get Songs
            var songs = Object.values(snap.val());
            var keys = Object.keys(snap.val());

            // Map thru data to write to DOM
            var k =function(){
                songs.map( function(song, index){
                    if(song.songTitle != undefined){
                        // Mark up of playlist item
                        let songindx = _.findIndex( songs , { 'songTitle': song.songTitle, 'artist': song.artist });
                        let objectID = keys[ songindx ]; 
                        let markup = Latest.song_mkp(song.songTitle, song.artist, song.image, index, objectID);
                        // Render item to DOM
                        $(".newrelease_cont_tabs").append(markup)
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
    // Change Tab Function
    tabber:function(param){
        var tab = $(param).attr("data-name"); //songstab | albumtab
        
        // Change Tab Active
        $('.release_tab_new').removeClass("tab_active_new")
        $(param).addClass("tab_active_new");

        // Clear container
        $(".newrelease_cont_tabs").html("")
        
        // Add Active Tab
        if("albumtab" == tab){
            // Render songs
            return this.get_albums()
        }
        else if("songtab" == tab){
            // Render Albums
            return this.get_songs()
        }
    },
    // Load More Function => Songs
    loadmore:function(type){
        if(type == "songs"){
            firebase.database().ref("songs").orderByKey().startAt(State.last_item_key).limitToFirst(12).on("value", function(snap){
                var songs = (snap.val() == null || snap.val() == undefined)? [] : Object.values(snap.val());
                var keys = (snap.val() == null || snap.val() == undefined)? [] : Object.keys(snap.val());
            
                // Save offset itemKey
                State.last_item_key = (keys.length == 0)? 0 : keys[keys.length - 1];
                // pop off offset
                songs.pop()
                // Clear Container
                $(".songs_cont_new").html("")
                // Proceed
                if( songs.length <= 0){
                    $(".pagin_message").remove()
                    $(`<div class="pagin_message">End of List</div>`).insertAfter(".newrelease_cont_tabs");
                    $(".pagination_container").addClass("disabled_");
                }else{
                    songs.map( function(song, index){
                        if(song.songTitle != undefined){
                            // Mark up of playlist item
                            let songindx = _.findIndex( songs , { 'songTitle': song.songTitle, 'artist': song.artist });
                            let objectID = keys[ songindx ]; 
                            let markup =  Latest.song_mkp(song.songTitle, song.artist, song.image, index, objectID);
                            // Render item to DOM
                            $(".newrelease_cont_tabs").append(markup)
                        }
                    })
                }
            })
        }
        else if(type == "albums"){
            firebase.database().ref("albums").orderByKey().startAt(State.last_item_key_albums).limitToFirst(5).on("value", function(snap){
                var albums = (snap.val() == null || snap.val() == undefined)? [] : Object.values(snap.val());
                var keys = (snap.val() == null || snap.val() == undefined)? [] : Object.keys(snap.val());
            
                // Save offset itemKey
                State.last_item_key_albums = (keys.length == 0)? 0 : keys[keys.length - 1];
                // pop off offset
                albums.pop()
                // Clear Container
                $(".songs_cont_new").html("")
                // Proceed
                if( albums.length <= 0){
                    $(".pagin_message").remove()
                    $(`<div class="pagin_message">End of List</div>`).insertAfter(".newrelease_cont_tabs");
                    $(".pagination_container").addClass("disabled_");
                }else{
                    albums.map( function(album, index){
                        if(album.albumTitle != undefined){
                            // Mark up of playlist item
                            var markup = Latest.album_markup( album.albumTitle, album.Artist, album.albumArtwork, index)
                            // Render item to DOM
                            $(".newrelease_cont_tabs").append(markup)
                        }
                    })
                }
            })
        }
    }
}

var _taber_ = function(param){
    return Latest.tabber(param)
}
var loadalbums = function(){
    return Latest.loadmore("albums")
}
var loadsongs = function(){
    return Latest.loadmore("songs")
}
