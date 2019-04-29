const Nav = {
    route:function(e){

        // Show notification if Offline
        if(navigator.onLine == false){
            // Push Bottom Player Up
            $(".bottomGutter_mobile").addClass("connection_pushup")
            // Add Alert Message to DOM
            $(".App_Root").append(`<div class="connection_error_regular">No Internet Connection</div>`);
            // Add Conn_err Class to Root
            $(".App_Root").addClass(`no_connection`);
        }else{
            $(".connection_error_regular").remove();
            $(".bottomGutter_mobile").removeClass("connection_pushup");
        }
        // Get Nav Name
        var page = ($(e).attr("data-name") != "home_logo" )? $(e).find(".btn_title_mbl").text().trim() : "Home";

        // Change Active Class
        $(".nav_itm_mob").removeClass("navtab_active_");
        ($(e).attr("data-name") != "home_logo" )? $(e).addClass("navtab_active_") : $('.home_mbl').addClass("navtab_active_");
        
        // close all other
        $(".srch_page_mobile").remove()
        $(".librarypage_mob").remove()
        $(".libraryMainContainer").remove()
        $(".new_release_cont_").remove()
        $(".home_container_").remove()

        // Route to Page
        switch(page){
            case "Home":
                return Home_.render()
            case "Latest":
                return Latest.render()
            case "Search":
                return search.mobile()
            case "Library":
                return Pages.renderLibraryItems()
        }
    },
    menu:function(){
        let menu = `
        <div class="context_menu_mobile _menu_settings_">
            <div class="_menucontents_ settingseffect">
                <h1 class="settings_hdr">Settings</h1>

                <div class="settingsContainer">
                    <div class="strma_premium" onclick="topUp()"> 
                        <div class="premium_logo">Top Up</div>
                        <div class="tip_sepRATOR_"><i>Premium</i></div>
                        <div class="premium_descr">
                            Start enjoying unlimited listening and offline downloads for only $1.50
                        </div>
                    </div>
                    <div class="twobuttoncontainer">
                        <div class="cleardata_container" onclick="clearStorage()">
                            `+ Nav.stroage_icon()+`
                            <div class="twobtn_text">Clear Storage</div>
                        </div>
                        <div class="signout_container" onclick="signout_()">
                        `+ Nav.signout_icon()+`
                            <div class="twobtn_text">Sign Out</div>
                        </div>
                    </div>
                    <div class="deactivate_btn" onclick="deactivate()">Deactivate Account</div>
                    <div class="close_sttngs_btn" onclick="close_mnu()">Close Menu</div>
                </div>
            </div>

        </div>
        `;
        // If Menu exists then remove else Append
        ( $('.App_Root').find("._menu_settings_").length > 0    )? 
            (   $("._menu_settings_").addClass("closesettingseffect"), setTimeout(function(){  $("._menu_settings_").removeClass("closesettingseffect"), $("._menu_settings_").remove()  }, 180)  ) 
            : $('.App_Root').append(menu)
    },
    signout_icon:function(){
        let output = `
            <svg class="signout_icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 477.867 477.867" style="enable-background:new 0 0 477.867 477.867;" xml:space="preserve" width="512px" height="512px" class=""><g><g><g>
                <path class="pth1" d="M426.657,0H204.79c-28.277,0-51.2,22.923-51.2,51.2v102.4c0,9.426,7.641,17.067,17.067,17.067s17.067-7.641,17.067-17.067    V51.2c0-9.426,7.641-17.067,17.067-17.067h221.867c9.426,0,17.067,7.641,17.067,17.067v375.467    c0,9.426-7.641,17.067-17.067,17.067H204.79c-9.426,0-17.067-7.641-17.067-17.067v-102.4c0-9.426-7.641-17.067-17.067-17.067    s-17.067,7.641-17.067,17.067v102.4c0,28.277,22.923,51.2,51.2,51.2h221.867c28.277,0,51.2-22.923,51.2-51.2V51.2    C477.857,22.923,454.934,0,426.657,0z" data-original="#000000" class="active-path" data-old_color="#ffffff" fill="#ffffff"/></g></g><g><g>
                <path class="pth2_" d="M341.323,221.867H58.256l56.201-56.201c6.548-6.78,6.36-17.584-0.42-24.132c-6.614-6.387-17.099-6.387-23.712,0    L4.991,226.867c-1.585,1.586-2.838,3.471-3.686,5.547c-1.726,4.175-1.726,8.864,0,13.039c0.852,2.083,2.111,3.974,3.703,5.564    l85.333,85.333c6.548,6.78,17.352,6.968,24.132,0.42c6.78-6.548,6.968-17.352,0.42-24.132c-0.137-0.142-0.277-0.282-0.42-0.42    L58.256,256h283.068c9.426,0,17.067-7.641,17.067-17.067S350.749,221.867,341.323,221.867z" data-original="#000000" class="active-path" data-old_color="#ffffff" fill="#ffffff"/></g></g></g>
            </svg>
        `;
        return output
    },
    stroage_icon: function(){
        let output = `
        <svg class="storage_icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 60 60" style="enable-background:new 0 0 60 60;" xml:space="preserve" width="512px" height="512px" class=""><g><g>
            <path d="M8.044,11h44v14h4V6.768C56.044,5.793,55.251,5,54.277,5H23.611l-2.485-4.141C20.808,0.329,20.227,0,19.61,0H5.812   C4.837,0,4.044,0.793,4.044,1.768V25h4V11z" data-original="#000000" class="active-path" data-old_color="#ffffff" fill="#ffffff"/>
            <rect x="10.044" y="21" width="40" height="4" data-original="#000000" class="active-path" data-old_color="#ffffff" fill="#ffffff"/>
            <rect x="11.044" y="17" width="38" height="3" data-original="#000000" class="active-path" data-old_color="#ffffff" fill="#ffffff"/>
            <rect x="12.044" y="13" width="36" height="3" data-original="#000000" class="active-path" data-old_color="#ffffff" fill="#ffffff"/>
            <path d="M45.044,41h-17v10h17V41z M39.044,43h1c0.553,0,1,0.447,1,1s-0.447,1-1,1h-1c-0.553,0-1-0.447-1-1S38.492,43,39.044,43z    M31.044,43h4c0.553,0,1,0.447,1,1s-0.447,1-1,1h-4c-0.553,0-1-0.447-1-1S30.492,43,31.044,43z M42.044,49h-11   c-0.553,0-1-0.447-1-1s0.447-1,1-1h11c0.553,0,1,0.447,1,1S42.597,49,42.044,49z" data-original="#000000" class="active-path" data-old_color="#ffffff" fill="#ffffff"/>
            <path d="M59.65,27.443C59.408,27.162,59.057,27,58.685,27H1.316c-0.37,0-0.722,0.161-0.963,0.441   c-0.242,0.28-0.35,0.651-0.294,1.02l4.918,30.461C5.074,59.547,5.602,60,6.233,60h47.534c0.632,0,1.16-0.453,1.257-1.081   l4.917-30.454C59.997,28.098,59.892,27.726,59.65,27.443z M47.044,53h-21V39h21V53z" data-original="#000000" class="active-path" data-old_color="#ffffff" fill="#ffffff"/></g></g> 
        </svg>
        `;
        return output
    }
}
 
const rte_ = function(e){
    return Nav.route(e)
}
const menu_mobile = function(){
    return Nav.menu()
}


