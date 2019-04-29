var _Router_ = {
    Route: function(page, param_){

        // Highlight page on Nav
        $(".nav_btn").removeClass("active_btnnav")
        $(param_).addClass("active_btnnav")

        // Route to Page
        switch(page){
            case "Home":
                return Home_.render()
            case "Popular Artist":
                return Popular_.render()
            case "New Releases":
                return Releases_.render()
            default:
                return Home_.render()
        }
    }
}