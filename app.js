(function() {

  return {
    events: {
      'app.activated': 'appInit',
      'comment.text.changed':'checkText'
    },

    appInit: function(){
      this.shortcuts = JSON.parse(this.setting('shortcuts'));
    },

    checkText: _.debounce( function() {
      var shared = this.shortcuts['shared'];
      var userShortcuts = this.shortcuts[this.currentUser().id()];

      //for each of the shared shortcuts. replace
      this.matchAndReplace(shared);

      //for each user specific, replace.
      this.matchAndReplace(userShortcuts);

    }, 200),

    matchAndReplace: function(shortcuts){
      for( element_key in shortcuts ){
        regex = new RegExp("\\s" + element_key + "\\s", "g");
        this.comment().text( this.comment().text().replace(regex, " " + shortcuts[element_key] + " ") );
      }
    }

  };

}());
