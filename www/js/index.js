var loading = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function() {
        this.receivedEvent('loading');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var loading = document.getElementById(id);
        loading.setAttribute('style', 'display:none;');
    }
};
loading.initialize();
