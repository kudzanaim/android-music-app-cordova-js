const Lib = {
    opn:function(){
        return this.playlists()
    },
    country_list:function(){
        let output = `
            <select class="country_origin_ loginWith_type_  loginfrm_">
                <option value="">Select Country</option>
                <option value="Algeria">Algeria</option>
                <option value="Angola">Angola</option>
                <option value="Benin">Benin</option>
                <option value="Botswana">Botswana</option>
                <option value="Burkina Faso">Burkina Faso</option>
                <option value="Burundi">Burundi</option>
                <option value="Cameroon">Cameroon</option>
                <option value="Cape Verde">Cape Verde</option>
                <option value="Central African Republic">Central African Republic</option>
                <option value="Chad">Chad</option>
                <option value="Congo">Congo</option>
                <option value="DRC">Democratic Republic of Congo</option>
                <option value="Cota D'Ivoire">Cote d'Ivoire</option>
                <option value="Djibouti">Djibouti</option>
                <option value="Ecuador">Ecuador</option>
                <option value="Egypt">Egypt</option>
                <option value="Equatorial Guinea">Equatorial Guinea</option>
                <option value="Eritrea">Eritrea</option>
                <option value="Ethiopia">Ethiopia</option>
                <option value="Gabon">Gabon</option>
                <option value="Gambia">Gambia</option>
                <option value="Ghana">Ghana</option>
                <option value="Guinea">Guinea</option>
                <option value="Guinea Bissau">Guinea-Bissau</option>
                <option value="Kenya">Kenya</option>
                <option value="Lesotho">Lesotho</option>
                <option value="Liberia">Liberia</option>
                <option value="Libya">Libya</option>
                <option value="Madagascar">Madagascar</option>
                <option value="Malawi">Malawi</option>
                <option value="Mali">Mali</option>
                <option value="Mauritania">Mauritania</option>
                <option value="Mauritius">Mauritius</option>
                <option value="Morocco">Morocco</option>
                <option value="Mozambique">Mozambique</option>
                <option value="Namibia">Namibia</option>
                <option value="Niger">Niger</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Rwanda">Rwanda</option>
                <option value="Senegal">Senegal</option>
                <option value="Seychelles">Seychelles</option>
                <option value="Sierra">Sierra Leone</option>
                <option value="Somalia">Somalia</option>
                <option value="South Africa">South Africa</option>
                <option value="Sudan">Sudan</option>
                <option value="Swaziland">Swaziland</option>
                <option value="Tanzania">Tanzania, United Republic of</option>
                <option value="Togo">Togo</option>
                <option value="Tunisia">Tunisia</option>
                <option value="Uganda">Uganda</option>    
                <option value="Western Sahara">Western Sahara</option>
                <option value="Zambia">Zambia</option>
                <option value="Zimbabwe">Zimbabwe</option>
            </select>
        `;
        return output
    },
    cls:function(){
        return $(".createPlFormCont").remove()
    },
    pl_mkp:function(){
        let output = `
            <div class="playlist_Container">
                <h1 class="playlst_cont_header">Your Playlists</h1>
                <div class="playlists_section">`+this.create_pl_mkup()+`</div>
            </div>
        `;
        return output
    },
    playlists: function(){
        // Get Visibility
        let visibility = $(".App_Root").find(".playlist_Container").length;

        // Render Playlists function
        let play_rendr = function(){
            // Container markup
            let markup = Lib.pl_mkp();
            // Render Container
            $(".App_Root").append(markup)
            // Close Queue if Open
            $(".q_cont_sngs").remove()
            // Get Playlists
            let playlists = Object.values(State.usr_.playlists);
            // Map thru Playlists and render
            return playlists.map(function(playlist, indx){
                if(playlist.playlistName != undefined){
                    let pl_mkup = Lib.pl_item_mkup(playlist.playlistName);
                    
                    if(playlist.playlistName == "My Songs"){
                        $(pl_mkup).insertBefore( "#create_newpl" ).addClass("_mySongsPL")
                    }else{$(pl_mkup).insertBefore( "#create_newpl" )}
                }
            })
        }
        
        
        // Toggle visibility
        if(visibility < 1){
            return play_rendr()
        }
        else if(visibility >= 1){
            return $(".playlist_Container").remove()
        }
    },
    pl_item_mkup:function(pl_name){
        let output = `
            <div class="pl_item_user" title="`+pl_name+`" onclick="opn_pl(this)">
                <img class="pl_icon_user" src="../../assets/icons/playlist.png">
                <span class="pl_name_user_ playlist">`+pl_name+`</span>
            </div>
        `;
        return output
    },
    create_pl_mkup:function(){
        let output = `
            <div class="create_newpl" id="create_newpl" title="Create new Playlist" onclick="cr_pl()">
                <img class="pl_icon_user_create" src="../../assets/icons/plus.png">
                <span class="pl_name_user_ playlist">New Playlist</span>
            </div>
        `;
    return output
    }, 
    createpl:function(){
        // Markup
        let markup = this.createpl_container();
        // Append Container
        return $(".App_Root").append(markup)
    },
    createpl_container:function(){
        let output = `
            <div class="createPlFormCont createplEffect">
                    <div class="createpl_form">
                        <h1 class="reg_user_hdr_land_">Create Playlist</h1>
                        <section class="fields_createpl">
                            <input class="create_field pl_name_field" placeholder="Playlist Name">
                            <textarea class="create_field pl_descript_field" placeholder="Description of playlist"></textarea>
                        </section>
                        <div class="btn_container_reguser">
                            <button class="sign_btn_reguser_login ripple" onclick="create()">Create</button>
                        </div> 
                    </div>
                    <button class="cls_sgn_lgn_create ripple" onclick="c_lgnsgn()">Close</button>
            </div>
        `;
        return output
    },
    postPL:function(){
        // Playlist Object
        let pl = {
            description: $(".pl_descript_field").val().trim(),
            playlistName: $(".pl_name_field").val().trim(),
            songs:{songs: "appended here"} 
        }
        // Upload to DB
        m_.database().ref("Users/"+State.usr_.ky+"/playlists").push(pl)
        // Close Widget
        $(".createPlFormCont").remove();
        // Update pls
        return m_.database().ref("Users/"+State.usr_.ky+"/playlists").once("value", function(snap){
            State.usr_.playlists = snap.val();
            Lib.playlists()
        })
    },
    signout:function(){
        alert("Signed Out")
    }
}

// opn lib
const lb_ = function(){
    return Lib.opn()
}
// open sgn up form
const sgnup = function(){
    return Lib.sgn_up()
}
// open lgn form
const lgn = function(){
    return Lib.lgn()
}
// close lgn widget
const c_lgnsgn = function(){
    return Lib.cls()
}

// open pl
const opn_pl = function(param){
    return Pages.render_page("usr_playlist", param)
}
// cr_pl
const cr_pl = function(){
    return Lib.createpl()
}
// postPL to DB
const create = function(){
    return Lib.postPL()
}
const signout = function(){
    return Lib.signout()
}