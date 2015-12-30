(function() {

  return {
    events: {
      'app.activated': 'appInit',
      'comment.text.changed':'checkText',
      'click .add_shortcut': 'openModal',
      'click .save_button': 'saveShortcut',
      'hidden #add_shortcut_modal': function(){ this.switchTo('home');}
    },

    requests: {
      updateAppInstallation: function(installationId, shortcutString){
        return {
          url: '/api/v2/apps/installations/'+ installationId +'.json',
          type: 'PUT',
          dataType: 'json',
          data: {
            'settings': { "shortcuts" : shortcutString }
          }
        };
      }
    },

    saveShortcut: function(){
      this.addUserShortcut(this.$('.shortcut_input:last').val(), this.$('.replace_input:last').val());
      this.addInputRow();
    },

    openModal: function(){
      this.switchTo('add_shortcut_modal');
      this.$('#add_shortcut_modal').modal('toggle');
      this.addInputRow(); //Adds the first input row to the form.
    },

    appInit: function(){
      this.shortcuts = JSON.parse(this.setting('shortcuts'));
      this.switchTo('home');
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
      for(var element_key in shortcuts ){
        var regex = new RegExp("\\s" + element_key + "\\s", "g");
        this.comment().text( this.comment().text().replace(regex, " " + shortcuts[element_key] + " ") );
      }
    },

    addUserShortcut: function(shortcut, replace){
      this.shortcuts[this.currentUser().id()][shortcut] = replace;
      this.ajax('updateAppInstallation', this.installationId(), JSON.stringify(this.shortcuts) );
    },

    addInputRow: function(){
      this.$('#shortcut_form').append(this.getInputRow());
      this.$('.replace_input').keypress(function(e){
        if(e.which == 13){
          this.saveShortcut();
        }
      }.bind(this));
      //Requests focus to the last added row
      this.$('.shortcut_input:last').focus();
    },

    getInputRow: function(){
      return "<input class=\"shortcut_input\" type=\"text\" placeholder=\"shortcut\"> <input class=\"replace_input\" type=\"text\" placeholder=\"replace with\">";
    }

  };

}());
