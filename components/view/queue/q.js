var queue = {
    toggle:function(){
        var curr_state = State.q_viewState;
        // Switcher
        switch(curr_state){
            case false:
                State.q_viewState = true
                return this.open()
            case true:
                State.q_viewState = false
                return $(".q_cont_sngs").remove()
        }
    },
    open:function(){
        // Append Container not already open
        var markup = this.markup();
        ( $(".app_body_").hasClass(".q_cont_sngs") == false ) ? $(".app_body_").append(markup) : $(".q_cnt_main").html("");

        // Close Plylists Container if Open
        $(".playlist_Container").remove()

        // Get Tracks and Map
        State.q_.map(function(song, indx){
            var track = queue.track_mkup(song.songTitle, song.artist);
            $(".q_cnt_main").append(track)
        })
    },
    markup:function(){
        var output = `
            <div class="q_cont_sngs">
                <section class="q_hdr_"><span>Queue Playlist</span></section>
                <section class="q_cnt_main"></section>
            </div>
        `;
        return output
    },
    track_mkup:function(song, artist){
        var output = `
            <div class="q_item_song_" onclick="_p_(this)">
                <img src="../../assets/note.png" class="note_sng_itm">
                <span class="songnme_q s_playname"><div class="sng_holder">`+song+`</div></span>
                <span class="artistnme_q a_playname"><div class="sng_holder">`+artist+`</div></span>
            </div>
        `;
        return output
    }
}

var q_t = function(){
    return queue.toggle()
}