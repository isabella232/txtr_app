(function() {

  return {
    events: {
      'comment.text.changed':'checkText'
    },

    checkText: _.debounce( function() {
      shortcuts = JSON.parse(this.setting('shortcuts'));

      shared = shortcuts['shared'];
      user_shortcuts = shortcuts[this.currentUser().id()];
      //for each of the shared shortcuts. replace
      this.matchAndReplace(shared);

      //for each user specific, replace.
      this.matchAndReplace(user_shortcuts);

    }, 200),

    matchAndReplace: function(shortcuts){
      for( element_key in shortcuts ){
        regex = new RegExp("\\s" + element_key + "\\s", "g");
        this.comment().text( this.comment().text().replace(regex, " " + shortcuts[element_key] + " ") );
      }
    }

  };

}());
