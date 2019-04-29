const State = {
    q_: [],
    currentlyPlaying:null,
    q_viewState: false,
    lgn_sts: false,
    screen_notify: false,
    SystemDirectory: 'file:///storage/emulated/0/Android/data/com.strma.strma',
    deleteState: false,
    subscription:{
        monthly: "1.50",
        data:null
    },
    playlistsToDelete:[],
    PremiumSettings: {
        subscriptionState: false
    },
    mouse_state:{
        sliderstate: false,
        uplistener: 0,
        mouseup:true
    },
    filesystem:{
        dataPort:null,
        databaseCopy: null,
        configsCopy:null,
        isCreated: false
    },
    fileTypes:{
        json: "application/json",
        music: ".mdk",
        text: "text/plain"
    },
    directories:{
        songsFiles: "resources",
        artwork: "artwork"
    },
    files:{
        configs: "config.json",
        database: "db.json"
    },
    downloadCounter:0,
    errorTicket:0
    
}
