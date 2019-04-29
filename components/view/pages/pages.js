const Pages = {
    artist_markup:function(artist_name, artwork){
        let output = `
            <div class="album_page_ artist_page_tag closedPage">
                <div class="artist_meta_container">
                    <button class="close_page ripple" onclick="clspge(this)">Close</button>
                    <div class="artwork_albm_cont"><img class="artist_artwork_open" src="`+artwork+`"></div>
                    <div class="album_name_open">`+artist_name+`</div>
                    <div class="type_">artist</div>
                </div>
                <div class="artist_library">
                    <div class="page_hdr_artist_prof">Artist Profile</div>

                    <div class="artist_popular_music">
                        <h1 class="popular_artist_header_">Popular</h1>
                        <div class="popular_songs_cont"></div>
                    </div>

                    <div class="latest_rls_artist_music_">
                        <h1 class="popular_artist_header_">Latest Release</h1>
                    </div>

                    <div class="artist_albums_music">
                        <h1 class="popular_artist_header_">Albums</h1>
                        <div class="artist_albums_cont"></div>
                    </div>
                </div>
            </div>
        `;
        return output
    },
    latestSong:function(title, image, date, type, artist, index){
        let album = `
            <article class="new_release_song ripple" id="`+type+`" title="`+index+`" onclick="nw_rls(this)">
                <img class="nw_rls_img" src="`+image+`" title="`+index+`">
                <section class="nw_rls_meta" title="`+index+`">
                    <span class="title_nw_rels album" title="`+index+`">`+title+`</span>
                    <span style="display:none" class="title_nw_rels album_artist_db" title="`+index+`">`+artist+`</span>
                    <span class="date_nw_rels" title="`+index+`">`+new Date(date).toDateString()+`</span>
                </section>
            </article>
        `;
        let song = `
        <article class="new_release_song ripple" id="`+type+`" title="`+index+`" onclick="nw_rls(this)">
                <img class="nw_rls_img" src="`+image+`" title="`+index+`">
                <section class="nw_rls_meta" title="`+index+`">
                    <span class="title_nw_rels s_playname" title="`+index+`">`+title+`</span>
                    <span style="display:none" class="title_nw_rels a_playname" title="`+index+`">`+artist+`</span>
                    <span class="date_nw_rels" title="`+index+`">`+new Date(date).toDateString()+`</span>
                </section>
        </article>
        `;
        
        // Switch
        switch(type){
            case "album":
                return album
            case "song":
                return song
        }
    },
    getalbum:function(album_name, artist_){
        firebase.database().ref("albums").orderByChild("albumTitle").startAt(album_name).endAt(album_name+"\uf8ff").on("child_added", function(snap){
            // If artist match
            if(  artist_ == snap.val().Artist){
                let album = snap.val();
                let markup = Pages.album_markup( album.albumTitle ,album.albumArtwork, album.Artist, album.Tracklist.length );
                let tracklist = album.Tracklist;
    
                // Add page Change to session
                sessionStorage.setItem("Page", "album")

                // Append Containter
                $(".app_body_").append(markup)
                
                // Append Tracklist
                return tracklist.map(function(track, index){
                    firebase.database().ref("songs").orderByChild("songTitle").startAt(track).endAt(track+"\uf8ff").on("child_added", function(snapp){
                        let songID = snapp.key;
                        let item = snapp.val();
                        let song = Pages.al_track_mk_up(item.songTitle, item.image, item.artist, item.streamCount, index, songID);
                        $(".album_trcks_cont").append(song)
                    })
                })
            }
        })
    },
    getplaylist:function(playlistname){
        firebase.database().ref("playlists").orderByChild("playlistName").startAt(playlistname).endAt(playlistname+"\uf8ff").on("child_added", function(snap){
            let playlist = snap.val();
            let markup = Pages.playlist_markup( playlist.playlistName ,playlist.artwork, "Strma", playlist.tracks.length );
            let tracklist = Object.values(playlist.tracks);

            // Append Containter
            $(".album_page_").remove()
            $(".app_body_").append(markup)
            $(".album_page_").addClass("playlist_page_tag")
            $(".type_").text("playlist")

            // Add page Change to session
            sessionStorage.setItem("Page", "playlist")
            
            // Append Tracklist
            return tracklist.map(function(track, index){
                if( track != undefined){
                    firebase.database().ref("songs").orderByChild("songTitle").startAt(track.songTitle).endAt(track.songTitle+"\uf8ff").on("child_added", function(snapp){
                        let songID = snapp.key;
                        let item = snapp.val();
                        if(track.artist == item.artist && track.songTitle == item.songTitle && item.streamCount ){
                            let song = Pages.artist_track_mk_up(item.songTitle, item.image, item.artist, index, songID, item.streamCount);
                            $(".album_trcks_cont").append(song)
                        }
                    })
                }
            })
        })
    },
    getartist:function(artist_){
        firebase.database().ref("artists").orderByChild("artistName").startAt(artist_).endAt(artist_+"\uf8ff").on("child_added", function(snap){
            // Markup && Data
            let artist = snap.val();
            let markup = Pages.artist_markup(artist_, artist.artistImage);

            // Append Container to DOM
            $(".app_body_").append(markup)

            // Query top 5 artists song
            firebase.database().ref("songs").orderByChild("artist").startAt(artist_).endAt(artist_+"\uf8ff").once("value", function(snap){
                // If artists has Songs
                let do_ = async function(){

                    // Song Array
                    let songObjets = snap.val();
                    let songs = await Object.values(songObjets);

                    // Sort Songs
                    let sorted = _.orderBy(songs, ['streamCount'], ['desc'])

                    // Slice Popular songs
                    sorted.length = 5;

                    // Map thru songs and append to DOM
                    sorted.map(function(song, index){
                        // Get Song Key of this Song
                        let songkey = _.findKey(songObjets, { 'iframe': song.iframe })
                        let markup_ = Pages.artist_track_mk_up(song.songTitle, song.image, song.artist, index, songkey, song.streamCount);
                        $(".popular_songs_cont").append(markup_)
                    })
                    
                    // Get Latest released Song or Album
                    let sortd_sngs_dte = _.orderBy(songs, ["timeStamp"], ["desc"]);    let song1 = sortd_sngs_dte[0];

                    firebase.database().ref("albums").orderByChild("Artist").startAt(artist_).endAt(artist_+"\uf8ff").on("value", function(snap){
                        let album = Object.values(snap.val());
                        let srtd_albums = _.orderBy(album, ["timeStamp"], ["desc"]);
                        let album1 = srtd_albums[0];

                        // Return latest release
                        console.clear()
                        if(album1.timeStamp >=  song1.timeStamp){
                            let _markup = Pages.latestSong(album1.albumTitle, album1.albumArtwork,album1.timeStamp, "album", album1.Artist);
                            $(".latest_rls_artist_music_").append(_markup)
                        }
                        else{
                            let markup_ = Pages.latestSong(song1.songTitle, song1.image, song1.timeStamp, "song", song1.artist);
                            $(".latest_rls_artist_music_").append(markup_)
                        }
                    })

                    
                }
                // If no Songs
                let no_ = function(){
                    return $(".popular_songs_cont").html(`
                        <div class="artist_no_songs">Sorry! This artist has no songs Posted</br> to their profile.</div>
                    `) 
                }
                // Turnary
				if( snap.numChildren() > 0) {
                    // Get Songs
                    do_();
                    // Get Albums
                    Pages.get_artists_albums(artist_)
                }
                else if(snap.numChildren() == 0){
                    no_()
                }
            })

        })
    },
    album_markup:function(album_name, artwork, artist, num_songs){
        let output = `
            <div class="album_page_ album_page_tag closedPage">
                <div class="album_meta_container">
                    <button class="close_page ripple" onclick="clspge(this)">Close</button>
                    <div class="type_">album</div>
                    <div class="artwork_albm_cont artwork_playlist_cont"><img class="album_artwork_open" src="`+artwork+`"></div>
                    <div class="album_name_open pl_name_open_">`+album_name+`</div>
                    <div class="album_artist_open" onclick="">By `+artist+`</div>
                    <div class="numsongs_open">`+num_songs+` Songs</div>
                    <button class="playall_ ripple" onclick="">Play All</button>
                </div>
                <div class="tracklist_container">
                    <h1 class="tracklist_header_">Tracklist</h1>
                    <div class="album_legend_open">
                        <span class="albm_lgnd_item">Title</span>
                        <span class="albm_lgnd_item">Featured Artists</span>
                        <span class="albm_lgnd_item">Streams</span>
                    </div>
                    <div class="album_trcks_cont"></div>
                </div>
            </div>
        `;
        return output
    },
    playlist_markup:function(playlist_name, artwork, artist, num_songs){
        let output = `
            <div class="album_page_ album_page_tag closedPage">
                <div class="album_meta_container">
                    <button class="close_page ripple" onclick="clspge(this)">Close</button>
                    <div class="type_">album</div>
                    <div class="artwork_albm_cont artwork_playlist_cont"><img class="album_artwork_open album_playlist_open" src="`+artwork+`"></div>
                    <div class="pl_name_open_">`+playlist_name+`</div>
                    <div class="album_artist_open" onclick="">By `+artist+`</div>
                    <div class="numsongs_open">`+num_songs+` Songs</div>
                    <button class="playall_ ripple" onclick="">Play All</button>
                </div>
                <div class="tracklist_container">
                    <h1 class="tracklist_header_">Tracklist</h1>
                    <div class="album_legend_open">
                        <span class="albm_lgnd_item">Title</span>
                        <span class="albm_lgnd_item">Featured Artists</span>
                        <span class="albm_lgnd_item">Streams</span>
                    </div>
                    <div class="album_trcks_cont"></div>
                </div>
            </div>
        `;
        return output
    },
    al_track_mk_up:function(title, img_, artist, streams,index, objectID){

        let output = `
            <div class="song_container">
                <div class="albmtrack_item_open dataContainer ripple" onclick="p_(this)" title="`+index+`" id="song"
                    data-image="`+img_+`" data-songid="`+objectID+`" data-songname="`+title+`" data-artistname="`+artist+`" 
                >
                    <span class="albmtrack_item_open_meta_">
                        <span class="albmtrack_item_open_meta_top">
                            <span class="albmtrack_item_index" title="`+index+`"><img src="assets/note.png" class="note_sng_itm" title="`+index+`"></span>
                            <span class="albmtrack_item_title" title="`+index+`"><div class="track_fld_song s_playname" title="`+index+`">`+title+`</div></span>
                        </span>
                        <span class="albmtrack_item_artist" title="`+index+`"><div class="track_fld_song a_playname" title="`+index+`">`+artist+`</div></span>
                    </span>
                    <span class="albmtrack_item_streams" title="`+index+`"><div class="track_fld_song" title="`+index+`">`+streams.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+`</div></span>
                </div>
                <div class="song_options_img_ocnt" onclick="opts(this)" id="opts">
                    <img class="_song_options_" src="assets/icons/more.png">
                </div>
            </div>
        `;

        return output
    },
    pl_track_mk_up:function(title, img_, artist,streams,  index, objectID){

        let output = `
            <div class="song_container">
                <div class="albmtrack_item_open dataContainer ripple" onclick="p_(this)" title="`+index+`" id="song"
                    data-image="`+img_+`" data-songid="`+objectID+`" data-songname="`+title+`" data-artistname="`+artist+`" 
                >
                    <span class="albmtrack_item_open_meta_">
                        <span class="albmtrack_item_open_meta_top">
                            <span class="albmtrack_item_index" title="`+index+`"><img src="assets/note.png" class="note_sng_itm" title="`+index+`"></span>
                            <span class="albmtrack_item_title" title="`+index+`"><div class="track_fld_song s_playname" title="`+index+`">`+title+`</div></span>
                        </span>
                        <span class="albmtrack_item_artist" title="`+index+`"><div class="track_fld_song a_playname" title="`+index+`">`+artist+`</div></span>
                    </span>
                    <span class="albmtrack_item_streams" title="`+index+`"><div class="track_fld_song" title="`+index+`">`+streams.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+`</div></span>
                </div>
                <div class="song_options_img_ocnt" onclick="opts_(this)" id="opts_">
                    <img class="_song_options_" src="assets/icons/more.png">
                </div>
            </div>
        `;

        return output
    },
    favorites_track_mk_up:function(title, img_, artist,  index, objectID){

        let output = `
            <div class="song_container" style="position:relative; left:5vw;">
                <div class="albmtrack_item_open dataContainer ripple" onclick="p_(this)" title="`+index+`" id="song"
                    data-image="`+img_+`" data-songid="`+objectID+`" data-songname="`+title+`" data-artistname="`+artist+`" data-playlistname="My Songs"
                >
                    <span class="albmtrack_item_open_meta_">
                        <span class="albmtrack_item_open_meta_top">
                            <span class="albmtrack_item_index" title="`+index+`"><img src="assets/note.png" class="note_sng_itm" title="`+index+`"></span>
                            <span class="albmtrack_item_title" title="`+index+`"><div class="track_fld_song s_playname" title="`+index+`">`+title+`</div></span>
                        </span>
                        <span class="albmtrack_item_artist" title="`+index+`"><div class="track_fld_song a_playname" title="`+index+`">`+artist+`</div></span>
                    </span>
                </div>
                <div class="song_options_img_ocnt" onclick="opts_(this)" id="opts_">
                    <img class="_song_options_" src="assets/icons/more.png">
                </div>
            </div>
        `;

        return output
    },
    downloads_track_mk_up:function(title, img_, artist,  index, objectID){

        let output = `
            <div class="song_container" style="position:relative; left:5vw;">
                <div class="albmtrack_item_open dataContainer ripple" onclick="p_(this)" title="`+index+`" id="song"
                    data-image="`+img_+`" data-songid="`+objectID+`" data-songname="`+title+`" data-artistname="`+artist+`" data-playlistname="My Songs"
                >
                    <span class="albmtrack_item_open_meta_">
                        <span class="albmtrack_item_open_meta_top">
                            <span class="albmtrack_item_index" title="`+index+`"><img src="assets/note.png" class="note_sng_itm" title="`+index+`"></span>
                            <span class="albmtrack_item_title" title="`+index+`"><div class="track_fld_song s_playname" title="`+index+`">`+title+`</div></span>
                        </span>
                        <span class="albmtrack_item_artist" title="`+index+`"><div class="track_fld_song a_playname" title="`+index+`">`+artist+`</div></span>
                    </span>
                </div>
                <div class="song_options_img_ocnt" onclick="optionsForDownloads(this)" id="opts_">
                    <img class="_song_options_" src="assets/icons/more.png">
                </div>
            </div>
        `;

        return output
    },
    artist_track_mk_up:function(title, img_, artist, index, objectID, streams){
        let output = `
            <div class="song_container">
                <div class="albmtrack_item_open dataContainer ripple" onclick="p_(this)" title="`+index+`" id="song"
                    data-image="`+img_+`" data-songid="`+objectID+`" data-songname="`+title+`" data-artistname="`+artist+`" 
                >
                    <span class="albmtrack_item_open_meta_">
                        <span class="albmtrack_item_open_meta_top">
                            <span class="albmtrack_item_index" title="`+index+`"><img src="assets/note.png" class="note_sng_itm" title="`+index+`"></span>
                            <span class="albmtrack_item_title" title="`+index+`"><div class="track_fld_song s_playname" title="`+index+`">`+title+`</div></span>
                        </span>
                        <span class="albmtrack_item_artist" title="`+index+`"><div class="track_fld_song a_playname" title="`+index+`">`+artist+`</div></span>
                    </span>
                    <span class="albmtrack_item_streams" title="`+index+`"><div class="track_fld_song" title="`+index+`">`+streams.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+`</div></span>
                </div>
                <div class="song_options_img_ocnt" onclick="opts(this)" id="opts_">
                    <img class="_song_options_" src="assets/icons/more.png">
                </div>
            </div>
        `;

        return output
    },
    get_artists_albums:function(artist_){
        firebase.database().ref("albums").orderByChild("Artist").startAt(artist_).endAt(artist_+"\uf8ff").once("value", function(snap){
            // Map thru Albums
            let map_ = function(){
                // Albums await
                let albums = Object.values(snap.val());
                // Loop Thru
                albums.map(function(album, index){
                    let markup = Pages.albm_mkup_artist(album.albumTitle, album.albumArtwork, album.releaseDate, artist_);
                    $(".artist_albums_cont").append(markup)
                })
            }
            // If no Albums
            let no_ = function(){
                return $(".album_trcks_cont").html(`
                    <div class="artist_no_songs">This artist has no Albums Posted to </br>their profile.</div>
                `) 
            }
            // Turnary
			if( snap.numChildren() > 0) {
                map_()
            }
            else if(snap.numChildren() == 0){
                no_()
            }
        })
    },
    albm_mkup_artist:function(album, artwork, date, artist){
        let output = `
            <div class="artists_albms_item_art" onclick="alget(this)">
                <img class="al_it_img" src="`+artwork+`">
                <span class="al_it_title album">`+album+`</span>
                <span class="al_it_date">`+date+`</span>
                <span class="al_it_artist album_artist_db">`+artist+`</span>
            </div>
        `;
        return output
    },
    render_page:function(type, param){

        // Switch between Page Type
        switch(type){
            // Playlists
            case "playlist":
                // playlist name
                sessionStorage.setItem("Page", "Playlist")
                let playlist = $(param).find(".playlist").text()
                return  this.getplaylist(playlist)
            case "usr_playlist":
                // playlist name
                sessionStorage.setItem("Page", "Playlist")
                let playlist_ = $(param).find(".playlist").text()
                return  this.usr_plylist(playlist_)
            case "album":
                // album name
                sessionStorage.setItem("Page", "Album")
                let album = $(param).find(".album").text()
                let artistt = $(param).find(".album_artist_db").text()
                return this.getalbum(album, artistt)
            case "artist":
                // artist name
                sessionStorage.setItem("Page", "Artist")
                let artist = $(param).find(".artist").text()
                return this.getartist(artist)
        }
    },
    cls:function(param){
        $(".album_page_").addClass("closepage")

        let type = $(param).parent().find(".type_").text()
        
        setTimeout(() => {
            $(".album_page_").addClass("closedPage")
            switch(type){
                case "playlist":
                    return $(".playlist_page_tag").remove()
                case "album":
                    return $(".album_page_tag").remove()
                case "artist":
                    return $(".artist_page_tag").remove()
            }
        }, 230);
    },
    usr_plylist:function(playlistname){
        let count = 0;
        m_.database().ref("Users/"+State.usr_.ky+"/playlists").orderByChild("playlistName").startAt(playlistname).endAt(playlistname+"\uf8ff").on("child_added", function(snap){
            let playlist = snap.val();
            let tracklist = Object.values(playlist.songs);
            let markup = Pages.usr_pl_mkup( playlist.playlistName, tracklist.length -1);
            
            // Add to State
            State.open_pl = {
                name: playlistname,
                k: snap.key
            };

            // Append Containter
            $(".album_page_").remove()
            $(".app_body_").append(markup)

            // Add page Change to session
            sessionStorage.setItem("Page", "playlist")
            
            // Append Tracklist
            return tracklist.map(function(track, index){
                if( track != undefined){
                    firebase.database().ref("songs").orderByChild("songTitle").startAt(track.songTitle).endAt(track.songTitle+"\uf8ff").on("child_added", function(snapp){
                        let songID = snapp.key;
                        let item = snapp.val();
                        if(track.artist == item.artist && track.songTitle == item.songTitle){ 
                            let song = Pages.pl_track_mk_up_(item.songTitle, item.image ,item.artist, item.streamCount,count+1, songID);
                            $(".album_trcks_cont").append(song);
                            count++;
                        }
                    })
                }
            })
        })
    },
    pl_track_mk_up_:function(title, img_, artist, streams, index, objectID){

        let output = `
            <div class="song_container">
                <div class="albmtrack_item_open dataContainer ripple" onclick="p_(this)" title="`+index+`" id="song"
                    data-image="`+img_+`" data-songid="`+objectID+`" data-songname="`+title+`" data-artistname="`+artist+`" 
                >
                    <span class="albmtrack_item_open_meta_">
                        <span class="albmtrack_item_open_meta_top">
                            <span class="albmtrack_item_index" title="`+index+`"><img src="assets/note.png" class="note_sng_itm" title="`+index+`"></span>
                            <span class="albmtrack_item_title" title="`+index+`"><div class="track_fld_song s_playname" title="`+index+`">`+title+`</div></span>
                        </span>
                        <span class="albmtrack_item_artist" title="`+index+`"><div class="track_fld_song a_playname" title="`+index+`">`+artist+`</div></span>
                    </span>
                    <span class="albmtrack_item_streams" title="`+index+`"><div class="track_fld_song" title="`+index+`">`+streams.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+`</div></span>
                </div>
                <div class="song_options_img_ocnt" onclick="opts_(this)" id="opts_">
                    <img class="_song_options_" src="assets/icons/more.png">
                </div>
            </div>
        `;     
        return output
    },
    usr_pl_mkup:function(pl_name, num_songs){
        let output = `
            <div class="album_page_ playlist_page_tag closedPage">
                    <div class="album_meta_container">
                        <button class="close_page ripple" onclick="clspge(this)">Close</button>
                        <div class="type_">playlist</div>
                        <div class="artwork_albm_cont usrpl_artwork_albm_cont"><img class="album_artwork_open" src="assets/turntable.jpg"></div>
                        <div class="pl_name_open_">`+pl_name+`</div>
                        <div class="album_artist_open" onclick="">By You</div>
                        <div class="numsongs_open">`+num_songs+` Songs</div>
                        <button class="playall_ ripple" onclick="">Play All</button>
                    </div>
                    <div class="tracklist_container">
                        <h1 class="tracklist_header_">Tracklist</h1>
                        <div class="album_legend_open">
                            <span class="albm_lgnd_item">Title</span>
                            <span class="albm_lgnd_item">Featured Artists</span>
                            <span class="albm_lgnd_item">Streams</span>
                        </div>
                        <div class="album_trcks_cont"></div>
                    </div>
                </div>
        `;
        return output
    },
    
    MyPlaylists_markup:function(){
        let output = `
            <div class="librarypage_mob">
                <div class="library_header_contM">
                    <span class="library_hdr_lg">Your Playlists</span>
                    <h1 class="library_hdr_small">Library</h1>
                </div>
                <div class="library_playlist_contM"></div>
            </div>
        `;
        return output
    },
    
    // svg types
    svgs:function(type){
        let favourites = `
            <svg id="Layer_1" class="menu_icn_" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96.25 95" style="">
                <defs><style>.cls-1,.cls-2{fill:none;stroke:#fff;stroke-miterlimit:10;}.cls-1{}.cls-2{stroke-width:6px;}</style></defs>
                <ellipse class="cls-1" cx="48.12" cy="47.5" rx="44.62" ry="44" style="stroke: #ffffff;stroke-miterlimit: 15;"></ellipse>
                <ellipse class="cls-2" cx="48.12" cy="47" rx="10.82" ry="10.71" style="stroke: #ffffff;stroke-width: 12px;"></ellipse>
            </svg>
        `;
        let downloads = `
            <svg id="Layer_1" class="menu_icn_" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96.25 95" style="">
                <defs><style>.cls-1,.cls-2{fill:none;stroke:#fff;stroke-miterlimit:10;}.cls-1{}.cls-2{stroke-width:6px;}</style></defs>
                <ellipse class="cls-1" cx="48.12" cy="47.5" rx="44.62" ry="44" style="stroke: #ffffff;stroke-miterlimit: 15;"></ellipse>
                <ellipse class="cls-2" cx="48.12" cy="47" rx="10.82" ry="10.71" style="stroke: #ffffff;stroke-width: 12px;"></ellipse>
            </svg>
        `;
        let playlists = `
            <svg id="Layer_1" class="menu_icn_" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96.25 95" style="">
                <defs><style>.cls-1,.cls-2{fill:none;stroke:#fff;stroke-miterlimit:10;}.cls-1{}.cls-2{stroke-width:6px;}</style></defs>
                <ellipse class="cls-1" cx="48.12" cy="47.5" rx="44.62" ry="44" style="stroke: #ffffff;stroke-miterlimit: 15;"></ellipse>
                <ellipse class="cls-2" cx="48.12" cy="47" rx="10.82" ry="10.71" style="stroke: #ffffff;stroke-width: 12px;"></ellipse>
            </svg>
        `;

        switch(type){
            case 'favourites':
                return favourites
            case 'downloads':
                return downloads
            case 'playlists':
                return playlists
        }
    },
    // Library Items Markup
    libraryItemsMarkUp:function(){
        let output = `
            <div class="libraryMainContainer navpage">
                <h1 class="_cat_hdr_">Library Categories</h1>
                <div class="libitems_container">
                    <div class="libitem ripple activelibtab" data-name="My Playlists" onclick="openCat(this)">
                        `+Pages.svgs("playlists")+`
                        <span>My Playlists</span>
                    </div>
                    <div class="libitem ripple" data-name="Favourites" onclick="openCat(this)">
                        `+Pages.svgs("favourites")+`
                        <span>Favourites</span>
                    </div>
                    <div class="libitem ripple" data-name="Downloads" onclick="openCat(this)">
                        `+Pages.svgs("downloads")+`
                        <span>Downloads</span>
                    </div>      
                </div>
                <div class="lib_content_container"></div>
            </div>
        `;
        return output
    },
    // Render Library items
    renderLibraryItems:function(){
        // render Tab Navigation
        let libItems = this.libraryItemsMarkUp();
        $(".app_body_").html(libItems)
        
        // Render First Tab ===>> My Playlists
        return Pages.openTab( $(".libitem")[0] )
    }, 
    // Render My Playlists
    renderMyPlaylists:function(){
        // Append Create button
        $(".lib_content_container").addClass("playlistitems").html(`<div class="playlist_panel_bnts"><div class="_create_cont_"><div class="panel_btn create_pl_btn" onclick="cr_pl()"><div class="btn_text">Create</div></div></div>
        <div class="_del_cont_"><div class="panel_btn delete_pl_btn" onclick="delete_pl()"><div class="btn_text">Delete</div>
        </div><div class="panel_btn done_pl_btn" onclick="doneDeletepl()"><div class="btn_text">Done</div></div></div></div>`)
        
        // Get Pls
        let pls = Object.values(State.usr_.playlists);
        let keys = Object.keys(State.usr_.playlists);

        // Map pls
        pls.map(function(pl, index){
            if(pl != undefined && pl.songs != undefined && pl.playlistName != "My Songs"){
                let pl_name = pl.playlistName; 
                let keyIndex = _.findIndex(pls, { 'playlistName': pl.playlistName });
                let key = keys[keyIndex];
                let numsongs = (Object.values(pl.songs).length == 1)? 0: Object.values(pl.songs).length - 1;
                let pl_item = Pages.pl_item(pl_name, numsongs, key);
                $(".lib_content_container").append(pl_item)
            }
        })
    },
    renderOfflinePlaylistsPage:function(){
        let markup = `
        <div class="offline_container_playlists">
            <svg class="offline_globe" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 31.416 31.416" style="enable-background:new 0 0 31.416 31.416;" xml:space="preserve"><g><g><g>
                <path d="M28.755,6.968l-0.47,0.149L25.782,7.34l-0.707,1.129l-0.513-0.163L22.57,6.51l-0.289-0.934L21.894,4.58l-1.252-1.123    l-1.477-0.289l-0.034,0.676l1.447,1.412l0.708,0.834L20.49,6.506l-0.648-0.191L18.871,5.91l0.033-0.783l-1.274-0.524l-0.423,1.841    l-1.284,0.291l0.127,1.027l1.673,0.322l0.289-1.641l1.381,0.204l0.642,0.376h1.03l0.705,1.412l1.869,1.896l-0.137,0.737    l-1.507-0.192l-2.604,1.315l-1.875,2.249l-0.244,0.996h-0.673l-1.254-0.578l-1.218,0.578l0.303,1.285l0.53-0.611l0.932-0.029    l-0.065,1.154l0.772,0.226l0.771,0.866l1.259-0.354l1.438,0.227l1.67,0.449l0.834,0.098l1.414,1.605l2.729,1.605l-1.765,3.372    l-1.863,0.866l-0.707,1.927l-2.696,1.8l-0.287,1.038c6.892-1.66,12.019-7.851,12.019-15.253    C31.413,12.474,30.433,9.465,28.755,6.968z" data-original="#000000" class="active-path" data-old_color="#ffffff" fill="#ffffff"/>
                <path d="M17.515,23.917l-1.144-2.121l1.05-2.188l-1.05-0.314l-1.179-1.184l-2.612-0.586l-0.867-1.814v1.077h-0.382l-2.251-3.052    v-2.507L7.43,8.545L4.81,9.012H3.045L2.157,8.43L3.29,7.532L2.16,7.793c-1.362,2.326-2.156,5.025-2.156,7.916    c0,8.673,7.031,15.707,15.705,15.707c0.668,0,1.323-0.059,1.971-0.137l-0.164-1.903c0,0,0.721-2.826,0.721-2.922    C18.236,26.357,17.515,23.917,17.515,23.917z" data-original="#000000" class="active-path" data-old_color="#ffffff" fill="#ffffff"/>
                <path d="M5.84,5.065l2.79-0.389l1.286-0.705l1.447,0.417l2.312-0.128l0.792-1.245l1.155,0.19l2.805-0.263L19.2,2.09l1.09-0.728    l1.542,0.232l0.562-0.085C20.363,0.553,18.103,0,15.708,0C10.833,0,6.474,2.222,3.596,5.711h0.008L5.84,5.065z M16.372,1.562    l1.604-0.883l1.03,0.595l-1.491,1.135l-1.424,0.143l-0.641-0.416L16.372,1.562z M11.621,1.691l0.708,0.295l0.927-0.295    l0.505,0.875l-2.14,0.562l-1.029-0.602C10.591,2.526,11.598,1.878,11.621,1.691z" data-original="#000000" class="active-path" data-old_color="#ffffff" fill="#ffffff"/></g></g></g> 
            </svg>
            <div class="offilne_msg">Go online to browse your playlists.</div>
        </div>
        `;
        return $(".lib_content_container").html(markup)

    },
    // A Playlist Item Markup
    pl_item: function(pl_name, num_songs, plID){
        let output = `
            <div class="pl_item_mobile" onclick="opn_pl(this)">
                <img class="pl_item_icon" src="assets/icons/playlistPink.png">
                <span class="pl_item_meta">
                    <span class="pl_item_pl_name playlist">`+pl_name+`</span>
                    <span class="pl_item_numsongs">`+num_songs+` songs</span>
                </span>
                <span class="pl_item_arrIcon_cnt" onclick="">
                    <img class="pl_item_arrIcon" src="assets/icons/right.png">
                    `+ Pages.deleteIcon(plID)+`
                </span>
            </div>
        `;
        return output
    },
    // render Downloads
    downloads: function(){
        // Get Database file
        sys_operations.getFile("db.json", Pages.render_downloads)
    },
    // Favourites
    favourites:function(){
       try {
        if(   navigator.onLine == true  ){
            // Get Database file
            let favourites = Object.values( State.usr_.playlists );
            let playlistIndex = _.findIndex(favourites, { 'playlistName': 'My Songs' });
            let playlist_ = favourites[playlistIndex];
            let playlist_id = Object.keys( State.usr_.playlists)[ playlistIndex ];
            
            State.open_pl = { k: playlist_id };

            // Render playlists
            Pages.render_favourites( playlist_ )
        }
        else if(   navigator.onLine == false  ){
            let defaultMarkup = `
                <div class="offline_container_playlists">
                    <svg class="offline_globe" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 31.416 31.416" style="enable-background:new 0 0 31.416 31.416;" xml:space="preserve"><g><g><g>
                        <path d="M28.755,6.968l-0.47,0.149L25.782,7.34l-0.707,1.129l-0.513-0.163L22.57,6.51l-0.289-0.934L21.894,4.58l-1.252-1.123    l-1.477-0.289l-0.034,0.676l1.447,1.412l0.708,0.834L20.49,6.506l-0.648-0.191L18.871,5.91l0.033-0.783l-1.274-0.524l-0.423,1.841    l-1.284,0.291l0.127,1.027l1.673,0.322l0.289-1.641l1.381,0.204l0.642,0.376h1.03l0.705,1.412l1.869,1.896l-0.137,0.737    l-1.507-0.192l-2.604,1.315l-1.875,2.249l-0.244,0.996h-0.673l-1.254-0.578l-1.218,0.578l0.303,1.285l0.53-0.611l0.932-0.029    l-0.065,1.154l0.772,0.226l0.771,0.866l1.259-0.354l1.438,0.227l1.67,0.449l0.834,0.098l1.414,1.605l2.729,1.605l-1.765,3.372    l-1.863,0.866l-0.707,1.927l-2.696,1.8l-0.287,1.038c6.892-1.66,12.019-7.851,12.019-15.253    C31.413,12.474,30.433,9.465,28.755,6.968z" data-original="#000000" class="active-path" data-old_color="#ffffff" fill="#ffffff"/>
                        <path d="M17.515,23.917l-1.144-2.121l1.05-2.188l-1.05-0.314l-1.179-1.184l-2.612-0.586l-0.867-1.814v1.077h-0.382l-2.251-3.052    v-2.507L7.43,8.545L4.81,9.012H3.045L2.157,8.43L3.29,7.532L2.16,7.793c-1.362,2.326-2.156,5.025-2.156,7.916    c0,8.673,7.031,15.707,15.705,15.707c0.668,0,1.323-0.059,1.971-0.137l-0.164-1.903c0,0,0.721-2.826,0.721-2.922    C18.236,26.357,17.515,23.917,17.515,23.917z" data-original="#000000" class="active-path" data-old_color="#ffffff" fill="#ffffff"/>
                        <path d="M5.84,5.065l2.79-0.389l1.286-0.705l1.447,0.417l2.312-0.128l0.792-1.245l1.155,0.19l2.805-0.263L19.2,2.09l1.09-0.728    l1.542,0.232l0.562-0.085C20.363,0.553,18.103,0,15.708,0C10.833,0,6.474,2.222,3.596,5.711h0.008L5.84,5.065z M16.372,1.562    l1.604-0.883l1.03,0.595l-1.491,1.135l-1.424,0.143l-0.641-0.416L16.372,1.562z M11.621,1.691l0.708,0.295l0.927-0.295    l0.505,0.875l-2.14,0.562l-1.029-0.602C10.591,2.526,11.598,1.878,11.621,1.691z" data-original="#000000" class="active-path" data-old_color="#ffffff" fill="#ffffff"/></g></g></g> 
                    </svg>
                    <div class="offilne_msg">Go online to view your favourites.</div>
                </div>
            `;
            return $(".lib_content_container").html(defaultMarkup)
        }
       } catch (e) {
           alert(e.message)
       }
    },
    // Open Tab
    openTab:function(param){
        // Tab Name
        let tab = $(param).attr("data-name");
        
        // Remove and Change Class
        $(".libitem").removeClass("activelibtab");     $(param).addClass("activelibtab");

        // Clear Tab Content
        $(".lib_content_container").html("").removeClass("playlistitems")
        
        // Render Content Page
        switch(tab){
            case "My Playlists":
                const page = ( navigator.onLine == true )? Pages.renderMyPlaylists : Pages.renderOfflinePlaylistsPage;
                return page()

            case "Downloads":
                return Pages.downloads()

            case "Favourites":
                return Pages.favourites() 
        }
    },
    // Render Function
    render_favourites: function(playlist){
        try {
            let songs = Object.values(playlist.songs);
            let count = -1;
 
            // Add downloadSwitch
            let download_switch_notsaved = `<div class="switchContainer"><div class="downloadtext_">Downloaded</div><div class="downloadSwitch">
                                    <div class="switchball" onclick="toggle_download()"></div><span class="switchtext">Saved for online</span></div></div>`;

            let download_switch_saved = `<div class="switchContainer"><div class="downloadtext_">Downloaded</div><div class="downloadSwitch savedSwitchContainer">
                                    <div class="switchball savedBall" onclick="toggle_download()"></div><span class="switchtext savedSwitchtext">Saved for online</span></div></div>`;
            
            // If offline Access Set
            let download_switch = ( State.filesystem.configsCopy.offlineAccess != true )? download_switch_notsaved : download_switch_saved;
            // let download_switch = download_switch_saved;

            // Append Switch
            $(".lib_content_container").html(download_switch)
            
            // Map through Downloads
            if(songs.length > 0){
                // Map thru
                songs.map((song, index)=>{
                    if(song.songTitle != undefined){
                        // Get Song Id from DB
                        firebase.database().ref("songs").orderByChild("songTitle").startAt(song.songTitle).endAt(song.songTitle+"\uf8ff").once( "value", function(snap){
                            let results = Object.values( snap.val() );
                            let resultids = Object.keys( snap.val() );
                            results.map( item => {
                                if( item.artist == song.artist ){
                                    let songindex = _.findIndex(results, {songTitle: song.songTitle});
                                    let songid = resultids[ songindex ];
                                    let markup = Pages.favorites_track_mk_up( song.songTitle, song.image, song.artist, index, songid  );
                
                                    // Append Song
                                    $(".lib_content_container").append(markup);
                                    count = count + 1;

                                    // if All appended then make Visible
                                    if( count == songs.length -2 ){
                                        $(".lib_content_container").addClass("playlistitems")
                                    }
                                    
                                }
                            })
                        })
                    }
                })
            }
            else if(downloads.length == 0){
                let defaultMarkup = `
                    <div class="noSongsInDownloads">
                        <svg class="noDownloadsIcon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 369.486 369.486" style="enable-background:new 0 0 369.486 369.486;" xml:space="preserve" ><g><g><g>
                            <path d="M184.743,357.351c-3.478,0-6.798-1.449-9.164-3.998l-147.67-159.16c-0.038-0.041-0.076-0.082-0.113-0.123    C9.871,174.223,0,147.921,0,120.008c0-27.914,9.871-54.215,27.796-74.061l2.244-2.484c18.246-20.201,42.608-31.327,68.599-31.327    s50.354,11.126,68.601,31.328l17.503,19.38l17.503-19.379c18.246-20.202,42.608-31.328,68.6-31.328s50.354,11.126,68.601,31.329    l2.241,2.478c17.928,19.851,27.799,46.152,27.799,74.065s-9.872,54.215-27.796,74.061c-0.037,0.043-0.075,0.084-0.113,0.125    l-147.671,159.16C191.541,355.901,188.221,357.351,184.743,357.351z M46.295,177.252l138.448,149.219l138.448-149.22    c28.485-31.603,28.467-82.97-0.055-114.549l-2.239-2.478c-13.449-14.891-31.224-23.09-50.051-23.09    c-18.828,0-36.603,8.199-50.048,23.085L194.02,89.869c-2.369,2.624-5.74,4.121-9.275,4.121s-6.906-1.497-9.276-4.121    l-26.779-29.648c-13.446-14.887-31.22-23.086-50.048-23.086S62.039,45.333,48.594,60.22l-2.244,2.484    C17.828,94.283,17.809,145.65,46.295,177.252z" data-original="#000000" class="active-path" data-old_color="#ffffff" fill="#ffffff"/></g></g></g> 
                        </svg>
                        <div class="noDLMessage">You have not added any songs to your to </br>favourites!</div>
                    </div>
                `;
                return $(".lib_content_container").addClass("playlistitems").html(defaultMarkup)
            }
            else{
                return $(".lib_content_container").addClass("playlistitems").html(`<div class="noDLMessage">Error loading your favourites. Please </br>restart Application</div>`)
            }
        } catch (e) {
            alert(e.message)
        }
    },
    // Render Function
    render_downloads: function(db_){
        try {
            let db = JSON.parse( db_ );
            let downloads = db.downloads;
            let count = 0;

            // Map through Downloads
            if(downloads.length > 0){
                // Map thru
                downloads.map((download, index)=>{
                    if(download.songTitle != undefined){
                        let markup = Pages.downloads_track_mk_up(    download.songTitle, download.image, download.artist, index, download.songid   );
                        // Append Song
                        $(".lib_content_container").append(markup);
                        count = count + 1;
                        // if All appended then make Visible
                        if( count == downloads.length){
                            $(".lib_content_container").addClass("playlistitems")
                        }
                    }
                })
            }
            else if(downloads.length == 0){
                let defaultMarkup = `
                    <div class="noSongsInDownloads">
                        <svg class="noDownloadsIcon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 44 44" enable-background="new 0 0 44 44" width="512px" height="512px" ><g><g><g>
                            <path d="m33,22c-6.075,0-11,4.925-11,11s4.925,11 11,11 11-4.925 11-11-4.925-11-11-11zm0,20c-4.971,0-9-4.029-9-9s4.029-9 9-9 9,4.029 9,9-4.029,9-9,9z" data-original="#000000"  data-old_color="#ffffff" fill="#ffffff"/></g></g><g><g>
                            <path d="m37,32h-3v-3c0-0.553-0.448-1-1-1s-1,0.447-1,1v3h-3c-0.552,0-1,0.447-1,1s0.448,1 1,1h3v3c0,0.553 0.448,1 1,1s1-0.447 1-1v-3h3c0.552,0 1-0.447 1-1s-0.448-1-1-1z" data-original="#000000" class="active-path" data-old_color="#ffffff" fill="#ffffff"/></g></g><g></g><g>
                            <path fill-rule="evenodd" d="m1,2h28c0.552,0 1-0.447 1-1s-0.448-1-1-1h-28c-0.552,0-1,0.447-1,1s0.448,1 1,1zm23,18h-23c-0.552,0-1,0.447-1,1s0.448,1 1,1h23c0.552,0 1-0.447 1-1s-0.448-1-1-1zm5-10h-28c-0.552,0-1,0.447-1,1s0.448,1 1,1h28c0.552,0 1-0.447 1-1s-0.448-1-1-1zm-12,20h-16c-0.552,0-1,0.447-1,1s0.448,1 1,1h16c0.552,0 1-0.447 1-1s-0.448-1-1-1z" data-original="#000000" class="active-path" data-old_color="#ffffff" fill="#ffffff"/></g></g></g> 
                        </svg>
                        <div class="noDLMessage">No songs downloaded for offline</br> listening!</div>
                    </div>
                `;
                return $(".lib_content_container").addClass("playlistitems").html(defaultMarkup)
            }
            else{
                return $(".lib_content_container").addClass("playlistitems").html(`<div class="noDLMessage">Error loading your Downloads. Please </br>restart Application</div>`)
            }
        } catch (e) {
            alert(e.message)
        }
    },
    // Toggle Download
    toggleDownload: function(){
        try {
            // Delete Old Configs and pass Update Function as Callback
            sys_operations.deleteFile( "config.json", Pages.k )

        } catch (e) {
            alert(e.message)
        }
    },
    // Chane Toggle State
    toggleState:function( _state_ ){
        if( _state_ == true){
            $(".switchball").addClass("savedBall");
            $(".switchtext").addClass("savedSwitchtext");
            $(".downloadSwitch").addClass("savedSwitchContainer")
        }
        else if( _state_ == false ){
            $(".switchball").removeClass("savedBall");
            $(".switchtext").removeClass("savedSwitchtext");
            $(".downloadSwitch").removeClass("savedSwitchContainer")
        }
    },
    // Download all Songs in Favourites 
    k:()=>{
        // Create new Config data object
        let data = State.filesystem.configsCopy;

        // Change Offline State
        data.offlineAccess = !data.offlineAccess;
     
        // Attatch New State
        State.filesystem.configsCopy = data;

        // Toggle Download Switch
        if( State.filesystem.configsCopy.offlineAccess == true ){
            // Change CSS styling of Switch
            Pages.toggleState(true);
            // Download All Songs
            playlistOperations.downloadfavourites();
        }else if( State.filesystem.configsCopy.offlineAccess == false ){
            // Change CSS styling of Switch
            Pages.toggleState(false);
            // Delete All Songs
        }
            
        sys_operations.createFile(  "config.json", data, "application/json", function(){} )
    },
    // Trash Icon
    deleteIcon: function(playlistID){
        let output = `
            <svg data-playlistid="`+playlistID+`" class="trash_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 486.4 486.4" style="enable-background:new 0 0 486.4 486.4;" xml:space="preserve" width="512px" height="512px" class=""><g><g><g>
                <path d="M446,70H344.8V53.5c0-29.5-24-53.5-53.5-53.5h-96.2c-29.5,0-53.5,24-53.5,53.5V70H40.4c-7.5,0-13.5,6-13.5,13.5    S32.9,97,40.4,97h24.4v317.2c0,39.8,32.4,72.2,72.2,72.2h212.4c39.8,0,72.2-32.4,72.2-72.2V97H446c7.5,0,13.5-6,13.5-13.5    S453.5,70,446,70z M168.6,53.5c0-14.6,11.9-26.5,26.5-26.5h96.2c14.6,0,26.5,11.9,26.5,26.5V70H168.6V53.5z M394.6,414.2    c0,24.9-20.3,45.2-45.2,45.2H137c-24.9,0-45.2-20.3-45.2-45.2V97h302.9v317.2H394.6z" data-original="#000000" class="active-path" data-old_color="#ffffff" fill="#ffffff"/>
                <path d="M243.2,411c7.5,0,13.5-6,13.5-13.5V158.9c0-7.5-6-13.5-13.5-13.5s-13.5,6-13.5,13.5v238.5    C229.7,404.9,235.7,411,243.2,411z" data-original="#000000" class="active-path" data-old_color="#ffffff" fill="#ffffff"/>
                <path d="M155.1,396.1c7.5,0,13.5-6,13.5-13.5V173.7c0-7.5-6-13.5-13.5-13.5s-13.5,6-13.5,13.5v208.9    C141.6,390.1,147.7,396.1,155.1,396.1z" data-original="#000000" class="active-path" data-old_color="#ffffff" fill="#ffffff"/>
                <path d="M331.3,396.1c7.5,0,13.5-6,13.5-13.5V173.7c0-7.5-6-13.5-13.5-13.5s-13.5,6-13.5,13.5v208.9    C317.8,390.1,323.8,396.1,331.3,396.1z" data-original="#000000" class="active-path" data-old_color="#ffffff" fill="#ffffff"/></g></g></g> 
            </svg>
        `;
        return output
    },
    deleteplaylistLauncher: function(){
        // Change Delete State
        State.deleteState = !State.deleteState;
        // Change All
        if( State.deleteState == true ){
            // Change CSS
            $(".trash_").css("display", "block");
            $(".pl_item_arrIcon").css("display", "none");
            $(".pl_item_mobile").addClass("delete_state");
            $("span.pl_item_arrIcon_cnt").css("background", "#d80d1e");
            // Change Delete Text to Done
            $(".delete_pl_btn").css("display", "none");
            $(".done_pl_btn").css("display", "grid");
            // Add Onclick Attribute
            $(".pl_item_arrIcon_cnt").attr("onclick", "pushDelPl(this)");
            $(".pl_item_mobile").attr("onclick", "");

        }else if( State.deleteState == false ){
            // Change CSS
            $(".trash_").css("display", "none");
            $(".pl_item_arrIcon").css("display", "block");
            $(".pl_item_mobile").removeClass("delete_state");
            $("span.pl_item_arrIcon_cnt").css("background", "none");
            // Change Delete Text to Done
            $(".delete_pl_btn").css("display", "grid");
            $(".done_pl_btn").css("display", "none");
            // Add Onclick Attribute
            $(".pl_item_arrIcon_cnt").attr("onclick", "");
            $(".pl_item_mobile").attr("onclick", "opn_pl(this)");
        }
    },
    // Delete all selected playlists
    doneDeleteplaylist:function(){
        // Close Delete Launcher
        Pages.deleteplaylistLauncher();
        // Map Thru Playlist Query Db to delete
        State.playlistsToDelete.map(function(id){
            m_.database().ref( "Users/" + State.usr_.ky + "/playlists/" + id ).remove();        
        })

    },
    // Add playlist to Delete to State
    pushDeletedPlaylistToState: function(param){

        // Get playlist ID from Attributes
        let playlistid = $(param).find(".trash_").attr("data-playlistid");

        // Push To State
        State.playlistsToDelete.push( playlistid );

        // Delete From View
        let itemToDelete = $(param).parent();
        $(param).parent().addClass("deleted");
        setTimeout(function(){  $(itemToDelete).remove() },600);


    }

}







// album click
const alget = function(param){
    return Pages.render_page("album", param)
}
// artist
const artget = function(param){
    return Pages.render_page("artist", param)
}
// playlist
const plget = function(param){
    return Pages.render_page("playlist", param)
}
// cls page
const clspge = function(param){
    return Pages.cls(param)
}
// Open Tab
const openCat = function(param){
    return Pages.openTab(param)
}
// Toggle Download Switch
const toggle_download = function(){
    return Pages.toggleDownload()
}
// delete playlists launcher
const delete_pl = function(){
    return Pages.deleteplaylistLauncher()
}
// Done Delete playlist
const doneDeletepl = function(){
    return Pages.doneDeleteplaylist()
}
// Push delete playlist to state
const pushDelPl = function(param){
    return Pages.pushDeletedPlaylistToState(param)
}






// function(){
//     alert(2)
//     // Toggle Download Switch
//     if( State.filesystem.configsCopy.offlineAccess == true ){
//         // Change CSS styling of Switch
//         Pages.toggleState(true);
//         // Download All Songs
//     }else if( State.filesystem.configsCopy.offlineAccess == false ){
//         // Change CSS styling of Switch
//         Pages.toggleState(false);
//         // Delete All Songs
//     }
// }