

var search = {
    srch:function(){
        // If Mobile Screen
        if($(document)[0].body.clientWidth < 600){
            // Remove placeholder
            $(".placeholder_logo_container_srch").remove()

            // Run Query
            this.go()
        }
        // Wide Screens
        else{
            this.go()
        }

    },
    go: function(){
        // close search
        window.clssrch_ = function(){
            // Remove button
            $(".cls_src_btn").remove()
            // Clear Input Val
            $(".search_bar").val('')
            
            return $(".resultsContainer").remove(), $(".result_cont_mobile").remove() 
        }

        // Close Button
        var button = `<span class="cls_src_btn" onclick="clssrch_()"><img src="assets/icon/close.png" class="cls_srch_btn"></span>`
        
        // Search value
        var val  = ($(document)[0].body.clientWidth < 600) ? $(".searchmobile_mobile").val() : $(".search_bar").val();

        // Determine if bar empty
        if ( val.length > 0){

            // Add Close Button
            ($(document)[0].body.clientWidth > 600) ? $(".search_bar_cont").prepend(button) : null;
            
            // Get container markup
            var res_cont = this.result_cont();
            var mobile_container = this.result_cont_mobile();
            
            // Append Container function
            $(".srch_page_mobile").append(mobile_container);

            // Format term for search
            var query = val.split(" ").map( function(x){return x.charAt(0).toUpperCase() + x.slice(1)}).join(" ");
            
            // Render results
            return (
                this.qry_songs(query),
                this.qry_artists(query),
                this.qry_albums(query)
            )

        }
        else if( val.length <= 0){
            return clssrch_()
        }
    },
    result_cont:function(){
        var output = `
            <div class="resultsContainer">
                
                <h1 class="res_cont_hdr_main">Search Results</h1>
                
                <div class="res_main_cont">
                    <div class="sng_results_container">
                        <h1 class="res_cont_hdr_res">Songs</h1>
                        <div class="res_legend">
                            <span class="legend_item">Title</span>
                            <span class="legend_item">Artist</span>
                            <span class="legend_item">Streams</span>
                        </div>
                        <div class="song_res_main_cont"></div>
                    </div>
                    
                    <div class="art_albm_cont_">
                        <div class="albm_resukts_cont">
                            <h1 class="res_cont_hdr_re">Albums</h1>
                            <div class="album_res_main_cont"></div>
                        </div>
                        <div class="artist_resukts_cont">
                            <h1 class="res_cont_hdr_re">Artists</h1>
                            <div class="artists_res_main_cont"></div>
                        </div>
                    </div>
                </div>

            </div>
        `;
        return output
    },
    a_rslt:function(artist, image){
        var output = `
            <article class="artist_resultItem_" onclick="artget(this)" id="artist">
                <img src="`+image+`" class="art_res_item_img_">
                <span class="art_res_item_name_ artist">`+artist+`</span>
            </article>
        `;
        return output
    },
    s_rslt:function(songname, img_, artist, index, objectID){
        var output_mobile = `
            <div class="song_container">
                <div class="albmtrack_item_open dataContainer ripple" onclick="p_(this)" title="`+index+`" id="song"
                    data-image="`+img_+`" data-songid="`+objectID+`" data-songname="`+songname+`" data-artistname="`+artist+`" 
                >
                    <span class="albmtrack_item_open_meta_">
                        <span class="albmtrack_item_open_meta_top">
                            <span class="albmtrack_item_index" title="`+index+`"><img src="assets/note.png" class="note_sng_itm" title="`+index+`"></span>
                            <span class="albmtrack_item_title" title="`+index+`"><div class="track_fld_song s_playname" title="`+index+`">`+songname+`</div></span>
                        </span>
                        <span class="albmtrack_item_artist" title="`+index+`"><div class="track_fld_song a_playname" title="`+index+`">`+artist+`</div></span>
                    </span>
                </div>
                <div class="song_options_img_ocnt" onclick="_opts_(this)" id="opts_">
                    <img class="_song_options_" src="assets/icons/more.png">
                </div>
            </div>
        `;

        // if mobile then close context menu
        output = ( $(document)[0].body.clientWidth < 600)? output_mobile : output;

        return output
    },
    al_rslt:function(artist, album, image, index){
        var output = `
            <div class="album_item_res ripple" onclick="alget(this)" id="album" title="`+index+`">
                <img src="`+image+`" class="album_img_res" title="`+index+`">
                <div class="album_meta_itm_cont_res" title="`+index+`">
                    <div class="album_songname_res album" title="`+index+`">`+album+`</div>
                    <div class="album_artist_res" title="`+index+`">`+artist+`</div>
                    <span class="al_it_artist album_artist_db" title="`+index+`">`+artist+`</span>
                </div>
            </div>
        `;
        return output
    },
    qry_songs:function(query_){
        // Empty Conainer
        $(".song_res_main_cont").html("")
        // Query DB of Term
        firebase.database().ref("songs").orderByChild("songTitle").startAt(query_).endAt(query_+"\uf8ff").on("value", function(snap){
            let song_keys = Object.keys(snap.val());

            // Map thru results and append to dom
            if(snap.val() != null || snap.val() != undefined){

                Object.values(snap.val()).map(function(result, index){
                    var markup = search.s_rslt(result.songTitle, result.image, result.artist, index, song_keys[index]     );
                    $(".song_res_main_cont").append(markup)
                })

            }else {return}
        })
    },
    qry_albums:function(query_){
        // Empty Container
        $(".album_res_main_cont").html("")
        // Query DB of Term
        firebase.database().ref("albums").orderByChild("albumTitle").startAt(query_).endAt(query_+"\uf8ff").on("value", function(snap){
            // Map thru results and append to dom
            if(snap.val() != null || snap.val() != undefined){
                Object.values(snap.val()).map(function(result, index){
                    var markup = search.al_rslt(result.Artist, result.albumTitle, result.albumArtwork, index);
                    $(".album_res_main_cont").append(markup)
                })
            }else {return}
        })
    },
    qry_artists:function(query_){
        // Empty Conainer
        $(".artists_res_main_cont").html("")
        // Query DB of Term
        firebase.database().ref("artists").orderByChild("artistName").startAt(query_).endAt(query_+"\uf8ff").on("value", function(snap){
            // Map thru results and append to dom
            if(snap.val() != null || snap.val() != undefined){
                Object.values(snap.val()).map(function(result, indexedDB){
                    var markup = search.a_rslt(result.artistName, result.artistImage);
                    $(".artists_res_main_cont").append(markup)
                })
            }else {return}
        })
    },
    mobile: function(){
        var markup =  ( navigator.onLine == true )? this.mobile_page() : this.offline();
        return $(".app_body_").append(markup)
    },
    mobile_page:function(){
        var output = `
            <div class="srch_page_mobile navpage">
                <div class="srch_inptcont">
                    <svg class="input_iconserch" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90.96 90.06"><defs><style>.cls-1{fill:none;stroke:#fff;stroke-miterlimit:10;stroke-width:5px;}.cls-2{fill:#fff;}
                        </style></defs><title>search</title><ellipse class="cls-1" cx="38.91" cy="38.22" rx="36.41" ry="35.72"></ellipse><path class="cls-2" d="M577,992.45a27.87,27.87,0,0,0,7.12-6.75l17.25,15.78s-.49,6.71-6.69,7.52Z" transform="translate(-510.45 -918.94)" style=""></path></svg>
                    <input class="searchmobile_mobile" onkeyup="srch()" placeholder="Song, artist or album...">
                </div>
                
                <div class="placeholder_logo_container_srch">
                    <svg class="srchpage_menu_icn" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90.96 90.06"><defs><style>.cls-1{fill:none;stroke:#fff;stroke-miterlimit:10;stroke-width:5px;}.cls-2{fill:#fff;}
                    </style></defs><title>search</title><ellipse class="cls-1" cx="38.91" cy="38.22" rx="36.41" ry="35.72"></ellipse><path class="cls-2" d="M577,992.45a27.87,27.87,0,0,0,7.12-6.75l17.25,15.78s-.49,6.71-6.69,7.52Z" transform="translate(-510.45 -918.94)" style=""></path></svg>
                    <span>Search any song, artist <br/> or album.</span>
                </div>
            </div>
        `;
        return output
    },
    offline:function(){
        var output = `
            <div class="srch_page_mobile navpage">
                <div class="srch_inptcont">
                    <svg class="input_iconserch" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90.96 90.06"><defs><style>.cls-1{fill:none;stroke:#fff;stroke-miterlimit:10;stroke-width:5px;}.cls-2{fill:#fff;}
                        </style></defs><title>search</title><ellipse class="cls-1" cx="38.91" cy="38.22" rx="36.41" ry="35.72"></ellipse><path class="cls-2" d="M577,992.45a27.87,27.87,0,0,0,7.12-6.75l17.25,15.78s-.49,6.71-6.69,7.52Z" transform="translate(-510.45 -918.94)" style=""></path></svg>
                    <input class="searchmobile_mobile" placeholder="Song, artist or album...">
                </div>
                
                <div class="offline_container_search">
                    <svg class="offline_globe" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 31.416 31.416" style="enable-background:new 0 0 31.416 31.416;" xml:space="preserve"><g><g><g>
                        <path d="M28.755,6.968l-0.47,0.149L25.782,7.34l-0.707,1.129l-0.513-0.163L22.57,6.51l-0.289-0.934L21.894,4.58l-1.252-1.123    l-1.477-0.289l-0.034,0.676l1.447,1.412l0.708,0.834L20.49,6.506l-0.648-0.191L18.871,5.91l0.033-0.783l-1.274-0.524l-0.423,1.841    l-1.284,0.291l0.127,1.027l1.673,0.322l0.289-1.641l1.381,0.204l0.642,0.376h1.03l0.705,1.412l1.869,1.896l-0.137,0.737    l-1.507-0.192l-2.604,1.315l-1.875,2.249l-0.244,0.996h-0.673l-1.254-0.578l-1.218,0.578l0.303,1.285l0.53-0.611l0.932-0.029    l-0.065,1.154l0.772,0.226l0.771,0.866l1.259-0.354l1.438,0.227l1.67,0.449l0.834,0.098l1.414,1.605l2.729,1.605l-1.765,3.372    l-1.863,0.866l-0.707,1.927l-2.696,1.8l-0.287,1.038c6.892-1.66,12.019-7.851,12.019-15.253    C31.413,12.474,30.433,9.465,28.755,6.968z" data-original="#000000" class="active-path" data-old_color="#ffffff" fill="#ffffff"/>
                        <path d="M17.515,23.917l-1.144-2.121l1.05-2.188l-1.05-0.314l-1.179-1.184l-2.612-0.586l-0.867-1.814v1.077h-0.382l-2.251-3.052    v-2.507L7.43,8.545L4.81,9.012H3.045L2.157,8.43L3.29,7.532L2.16,7.793c-1.362,2.326-2.156,5.025-2.156,7.916    c0,8.673,7.031,15.707,15.705,15.707c0.668,0,1.323-0.059,1.971-0.137l-0.164-1.903c0,0,0.721-2.826,0.721-2.922    C18.236,26.357,17.515,23.917,17.515,23.917z" data-original="#000000" class="active-path" data-old_color="#ffffff" fill="#ffffff"/>
                        <path d="M5.84,5.065l2.79-0.389l1.286-0.705l1.447,0.417l2.312-0.128l0.792-1.245l1.155,0.19l2.805-0.263L19.2,2.09l1.09-0.728    l1.542,0.232l0.562-0.085C20.363,0.553,18.103,0,15.708,0C10.833,0,6.474,2.222,3.596,5.711h0.008L5.84,5.065z M16.372,1.562    l1.604-0.883l1.03,0.595l-1.491,1.135l-1.424,0.143l-0.641-0.416L16.372,1.562z M11.621,1.691l0.708,0.295l0.927-0.295    l0.505,0.875l-2.14,0.562l-1.029-0.602C10.591,2.526,11.598,1.878,11.621,1.691z" data-original="#000000" class="active-path" data-old_color="#ffffff" fill="#ffffff"/></g></g></g> 
                    </svg>
                    <div class="offilne_msg">Go online to search thousands of </br>songs.</div>
                </div>
            </div>
        `;
        return output
    },
    result_cont_mobile:function(){
        var output = `
            <div class="result_cont_mobile">
                <div class="sng_results_container">
                    <h1 class="res_cont_hdr_re">Songs</h1>
                    <div class="song_res_main_cont"></div>
                </div>
                <div class="artist_resukts_cont">
                    <h1 class="res_cont_hdr_re">Artists</h1>
                    <div class="artists_res_main_cont"></div>
                </div>
                <div class="albm_resukts_cont">
                    <h1 class="res_cont_hdr_re">Albums</h1>
                    <div class="album_res_main_cont"></div>
                </div>
                
            </div>
        `;
        return output
    }

}

var srch = function(){
    return search.srch()
}